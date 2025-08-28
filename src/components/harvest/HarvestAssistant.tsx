'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Strain } from '@/types/strain';
import { StrainDatabaseService } from '@/services/strainDatabaseService';
import { GeminiDiagnosisService } from '@/services/geminiService';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface TrichomeAnalysisUI {
  clear: number;
  milky: number;
  amber: number;
  recommendation: string;
  confidence?: number;
}

interface HarvestSchedule {
  id: string;
  plantId: string;
  plantName: string;
  estimatedHarvestDate: string; // ISO
  reminderDate: string; // ISO
  status: 'pending' | 'ready' | 'harvested';
}

interface CuringGuide {
  humidity: number;
  temperature: number;
  duration: number;
  tips: string[];
}

export const HarvestAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'estimation' | 'trichome' | 'schedule' | 'curing'>('estimation');
  const [selectedStrainId, setSelectedStrainId] = useState<string>('');
  const [plantAge, setPlantAge] = useState<number>(0);
  const [trichomeImage, setTrichomeImage] = useState<File | null>(null);
  const [trichomeAnalysis, setTrichomeAnalysis] = useState<TrichomeAnalysisUI | null>(null);
  const [harvestSchedules, setHarvestSchedules] = useState<HarvestSchedule[]>([]);
  const [curingGuide, setCuringGuide] = useState<CuringGuide | null>(null);
  const [strains, setStrains] = useState<Strain[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingStrains, setIsLoadingStrains] = useState(false);
  const reminderTimers = useRef<Record<string, number>>({});

  const defaultCuringGuide: CuringGuide = {
    humidity: 62,
    temperature: 21,
    duration: 14,
    tips: [
      'Feuchtigkeit zwischen 60-65% halten',
      'Temperatur konstant bei 21°C',
      'Täglich lüften für 15-30 Minuten',
      'Feuchtigkeit alle 2-3 Tage messen',
      'Nach 7 Tagen auf 58-60% reduzieren'
    ]
  };

  useEffect(() => {
    setCuringGuide(defaultCuringGuide);

    // Strains laden
    const load = async () => {
      setIsLoadingStrains(true);
      try {
        const svc = StrainDatabaseService.getInstance();
        const all = await svc.getAllStrains();
        setStrains(all);
      } catch (e) {
        console.error('Strains laden fehlgeschlagen', e);
      } finally {
        setIsLoadingStrains(false);
      }
    };
    load();

    // Zeitpläne laden
    try {
      const saved = localStorage.getItem('harvest_schedules');
      if (saved) {
        const parsed = JSON.parse(saved) as HarvestSchedule[];
        setHarvestSchedules(parsed);
      }
    } catch {}

    // Notification Permission anfragen (optional)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  // Persistiere Zeitpläne
  useEffect(() => {
    try {
      localStorage.setItem('harvest_schedules', JSON.stringify(harvestSchedules));
    } catch {}
  }, [harvestSchedules]);

  // Abgeleitete Auswahl
  const selectedStrain: Strain | undefined = useMemo(() => {
    return strains.find(s => s.id === selectedStrainId);
  }, [strains, selectedStrainId]);

  const calculateHarvestEstimation = () => {
    if (!selectedStrain || plantAge <= 0) return null;

    const floweringAvg = selectedStrain.growing?.floweringTime?.average ?? 56;
    const daysUntilHarvest = Math.max(0, floweringAvg - plantAge);
    const harvestStart = new Date();
    harvestStart.setDate(harvestStart.getDate() + daysUntilHarvest);
    const harvestEnd = new Date(harvestStart);
    const harvestWindow = 7;
    harvestEnd.setDate(harvestEnd.getDate() + harvestWindow);

    const expectedYield = selectedStrain.growing?.yield?.indoor?.average
      ?? selectedStrain.growing?.yield?.outdoor?.average
      ?? 400;

    return {
      daysUntilHarvest,
      harvestStart,
      harvestEnd,
      expectedYield,
      recommendation: daysUntilHarvest <= 0
        ? 'Bereit zur Ernte!'
        : `${daysUntilHarvest} Tage bis zur optimalen Ernte`
    };
  };

  const scheduleReminder = (schedule: HarvestSchedule) => {
    // Einfache In-App Erinnerung (nur wenn Seite offen)
    const ms = new Date(schedule.reminderDate).getTime() - Date.now();
    if (ms > 0) {
      const timer = window.setTimeout(() => {
        try {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Ernte-Reminder', {
              body: `${schedule.plantName}: Ernte naht (${new Date(schedule.estimatedHarvestDate).toLocaleDateString('de-DE')})`,
            });
          }
        } catch {}
      }, ms);
      reminderTimers.current[schedule.id] = timer as unknown as number;
    }
  };

  const analyzeTrichomes = async () => {
    if (!trichomeImage) return;
    // Validierung: Typ & Größe (max 6MB)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(trichomeImage.type)) {
      setTrichomeAnalysis({
        clear: 0, milky: 0, amber: 0,
        recommendation: 'Ungültiger Dateityp. Bitte JPEG/PNG/WebP hochladen.',
      });
      return;
    }
    if (trichomeImage.size > 6 * 1024 * 1024) {
      setTrichomeAnalysis({
        clear: 0, milky: 0, amber: 0,
        recommendation: 'Bild zu groß (>6MB). Bitte kleineres Bild hochladen.',
      });
      return;
    }
    setIsAnalyzing(true);
    try {
      // EXIF strip: Re-encode via Canvas
      const objectUrl = URL.createObjectURL(trichomeImage);
      const img = new Image();
      const base64 = await new Promise<string>((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas nicht verfügbar');
            ctx.drawImage(img, 0, 0);
            // Re-encode als JPEG, Qualität 0.9
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            const b64 = dataUrl.split(',')[1] || '';
            resolve(b64);
          } catch (e) {
            reject(e);
          } finally {
            URL.revokeObjectURL(objectUrl);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Bild konnte nicht geladen werden'));
        };
        img.src = objectUrl;
      });
      const abortController = new AbortController();
      const result = await GeminiDiagnosisService.analyzeTrichomes(
        base64,
        'balanced',
        { timeoutMs: 20000, signal: abortController.signal }
      );
      setTrichomeAnalysis({
        clear: result.clear,
        milky: result.milky,
        amber: result.amber,
        recommendation: result.recommendation,
        confidence: result.confidence,
      });
    } catch (e) {
      console.error(e);
      setTrichomeAnalysis({
        clear: 33,
        milky: 44,
        amber: 23,
        recommendation: 'Analyse fehlgeschlagen – grobe Schätzung anzeigen. Wiederholen Sie die Analyse.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addHarvestSchedule = () => {
    const estimation = calculateHarvestEstimation();
    if (!estimation || !selectedStrain) return;

    const newSchedule: HarvestSchedule = {
      id: Date.now().toString(),
      plantId: selectedStrain.id,
      plantName: selectedStrain.name,
      estimatedHarvestDate: estimation.harvestStart.toISOString(),
      reminderDate: new Date(estimation.harvestStart.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    };

    setHarvestSchedules(prev => {
      const next = [...prev, newSchedule];
      scheduleReminder(newSchedule);
      return next;
    });
  };

  const updateHarvestStatus = (id: string, status: HarvestSchedule['status']) => {
    setHarvestSchedules(schedules => 
      schedules.map(schedule => 
        schedule.id === id ? { ...schedule, status } : schedule
      )
    );
  };

  const estimation = calculateHarvestEstimation();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab-Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {[
          { id: 'estimation', label: 'Ernteschätzung', icon: '📅' },
          { id: 'trichome', label: 'Trichom-Analyse', icon: '🔬' },
          { id: 'schedule', label: 'Ernte-Zeitplan', icon: '⏰' },
          { id: 'curing', label: 'Curing-Assistent', icon: '🌡️' }
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === id
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Tab-Inhalte */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Ernteschätzung Tab */}
        {activeTab === 'estimation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🌿 Dynamische Ernteschätzung
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Strain auswählen
                </label>
                <select
                  aria-label="Strain auswählen"
                  value={selectedStrainId}
                  onChange={(e) => setSelectedStrainId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">{isLoadingStrains ? 'Lade Strains…' : 'Strain auswählen...'}</option>
                  {strains.map((strain: Strain) => (
                    <option key={strain.id} value={strain.id}>
                      {strain.name} ({strain.growing?.floweringTime?.average ?? '—'} Tage)
                    </option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700">
                  Pflanzenalter (Tage seit Blütebeginn)
                </label>
                <input
                  type="number"
                  value={plantAge}
                  onChange={(e) => setPlantAge(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="z.B. 42"
                />
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
                {estimation ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Ernteschätzung
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span>📅</span>
                        <span className="text-gray-700">
                          Ernte ab: {estimation.harvestStart.toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>⏰</span>
                        <span className="text-gray-700">
                          {estimation.daysUntilHarvest} Tage bis zur Ernte
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>💧</span>
                        <span className="text-gray-700">
                          Erwarteter Ertrag: {estimation.expectedYield}g
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-green-800 font-medium">
                        💡 {estimation.recommendation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <span className="text-4xl mb-3 block">📅</span>
                    <p>Wählen Sie einen Strain und geben Sie das Pflanzenalter ein</p>
                  </div>
                )}
              </div>
            </div>

            {estimation && (
              <div className="text-center">
                <button
                  onClick={addHarvestSchedule}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Zum Ernte-Zeitplan hinzufügen
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trichom-Analyse Tab */}
        {activeTab === 'trichome' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🔬 KI-gestützte Trichom-Analyse
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Trichom-Foto hochladen
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTrichomeImage(e.target.files?.[0] || null)}
                    className="hidden"
                    id="trichome-upload"
                  />
                  <label htmlFor="trichome-upload" className="cursor-pointer">
                    <span className="text-4xl block mb-3">📷</span>
                    <p className="text-gray-600">
                      {trichomeImage ? trichomeImage.name : 'Klicken Sie hier, um ein Foto hochzuladen'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Empfohlen: Makro-Aufnahme der Blüten
                    </p>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!('Notification' in window)) return;
                      try {
                        const permission = await Notification.requestPermission();
                        if (permission !== 'granted') {
                          alert('Benachrichtigungen wurden blockiert. Bitte erlauben Sie sie in den Browsereinstellungen.');
                        }
                      } catch {}
                    }}
                    className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50"
                  >
                    🔔 Benachrichtigungen aktivieren
                  </button>
                  <span className="text-sm text-gray-500">
                    Status: {typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'n/a'}
                  </span>
                </div>

                {trichomeImage && (
                  <button
                    onClick={analyzeTrichomes}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {isAnalyzing ? 'Analysiere…' : '🔍 Trichome analysieren'}
                  </button>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
                {trichomeAnalysis ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Analyse-Ergebnisse
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Klar:</span>
                        <div className="flex items-center gap-2 w-40">
                          <ProgressBar value={trichomeAnalysis.clear} trackClassName="fill-gray-200" barClassName="fill-gray-400" />
                          <span className="font-medium">{trichomeAnalysis.clear}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Milchig:</span>
                        <div className="flex items-center gap-2 w-40">
                          <ProgressBar value={trichomeAnalysis.milky} trackClassName="fill-gray-200" barClassName="fill-slate-50" />
                          <span className="font-medium">{trichomeAnalysis.milky}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Bernstein:</span>
                        <div className="flex items-center gap-2 w-40">
                          <ProgressBar value={trichomeAnalysis.amber} trackClassName="fill-gray-200" barClassName="fill-amber-500" />
                          <span className="font-medium">{trichomeAnalysis.amber}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        💡 {trichomeAnalysis.recommendation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <span className="text-4xl mb-3 block">🔬</span>
                    <p>Laden Sie ein Foto hoch und starten Sie die Analyse</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ernte-Zeitplan Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📅 Ernte-Zeitplan & Reminder
            </h2>
            
            {harvestSchedules.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">⏰</span>
                <p className="text-gray-500 text-lg">
                  Noch keine Ernte-Termine geplant
                </p>
                <p className="text-gray-400">
                  Nutzen Sie die Ernteschätzung, um Termine hinzuzufügen
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {harvestSchedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      schedule.status === 'ready' 
                        ? 'border-green-200 bg-green-50' 
                        : schedule.status === 'harvested'
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {schedule.plantName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            📅 Ernte: {new Date(schedule.estimatedHarvestDate).toLocaleDateString('de-DE')}
                          </span>
                          <span>
                            ⏰ Reminder: {new Date(schedule.reminderDate).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {schedule.status === 'pending' && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Wartend
                          </span>
                        )}
                        {schedule.status === 'ready' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Bereit zur Ernte
                          </span>
                        )}
                        {schedule.status === 'harvested' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            Geerntet
                          </span>
                        )}
                        
                        <div className="flex gap-2">
                          {schedule.status === 'pending' && (
                            <button
                              onClick={() => updateHarvestStatus(schedule.id, 'ready')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Als bereit markieren"
                            >
                              ✅
                            </button>
                          )}
                          {schedule.status === 'ready' && (
                            <button
                              onClick={() => updateHarvestStatus(schedule.id, 'harvested')}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="Als geerntet markieren"
                            >
                              ✅
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Curing-Assistent Tab */}
        {activeTab === 'curing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🌡️ Curing-Assistent
            </h2>
            
            {curingGuide && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Optimale Curing-Bedingungen
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💧</span>
                        <div>
                          <span className="text-sm text-gray-600">Feuchtigkeit</span>
                          <p className="text-2xl font-bold text-gray-800">
                            {curingGuide.humidity}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌡️</span>
                        <div>
                          <span className="text-sm text-gray-600">Temperatur</span>
                          <p className="text-2xl font-bold text-gray-800">
                            {curingGuide.temperature}°C
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⏰</span>
                        <div>
                          <span className="text-sm text-gray-600">Dauer</span>
                          <p className="text-2xl font-bold text-gray-800">
                            {curingGuide.duration} Tage
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      📋 Curing-Checkliste
                    </h4>
                    <div className="space-y-3">
                      {curingGuide.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      🚨 Wichtige Hinweise
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl">⚠️</span>
                        <p>
                          Überwachen Sie die Feuchtigkeit täglich. Zu trocken = Qualitätsverlust
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-yellow-500 text-xl">⚠️</span>
                        <p>
                          Lüften Sie regelmäßig, aber nicht zu lange
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-green-500 text-xl">✅</span>
                        <p>
                          Geduld ist der Schlüssel zum Erfolg
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      ⏰ Curing-Erinnerungen
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Feuchtigkeit messen</span>
                        <span className="text-sm text-blue-600">Alle 2-3 Tage</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Lüften</span>
                        <span className="text-sm text-green-600">Täglich</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <span className="text-gray-700">Feuchtigkeit reduzieren</span>
                        <span className="text-sm text-amber-600">Nach 7 Tagen</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
