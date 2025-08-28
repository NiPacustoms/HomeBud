'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Settings, Palette, Grid, List, Eye, EyeOff, Move, Save, RotateCcw, X } from 'lucide-react';
import { DashboardTile } from '@/types/dashboard';
import useDashboard from '@/hooks/useDashboard';
import useToast from '@/hooks/useToast';
import dynamic from 'next/dynamic';
const ToastContainer = dynamic(() => import('@/components/ui/Toast').then(m => m.ToastContainer), { ssr: false });

export default function DashboardCustomization({ isOpen, onClose, onSave, currentTiles }: { isOpen: boolean; onClose: () => void; onSave: (tiles: DashboardTile[]) => void; currentTiles: DashboardTile[]; }) {
  const { preferences, updatePreferences, updateTileOrder, exportData, importData, undo, redo, canUndo, canRedo } = useDashboard();
  const { showToast } = useToast();
  const [tiles, setTiles] = useState<DashboardTile[]>(currentTiles);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'tiles' | 'layout' | 'appearance' | 'advanced'>('tiles');
  const [selectedTile, setSelectedTile] = useState<DashboardTile | null>(null);
  const [showTileSettings, setShowTileSettings] = useState(false);
  const reorderDebounceRef = useRef<number | null>(null);
  const [importText, setImportText] = useState<string>('');
  const [exportJson, setExportJson] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => { setTiles(currentTiles); }, [currentTiles]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+Z (Mac) or Ctrl+Z (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      }
      // Cmd+Shift+Z or Ctrl+Y (Redo)
      if (((event.metaKey || event.ctrlKey) && event.key === 'z' && event.shiftKey) || 
          ((event.ctrlKey) && event.key === 'y')) {
        event.preventDefault();
        handleRedo();
      }
      // Escape to close
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleUndo = async () => {
    if (!canUndo) return;
    try {
      await undo();
      showToast('Rückgängig gemacht', 'success');
    } catch (error) {
      showToast('Fehler beim Rückgängig machen', 'error');
    }
  };

  const handleRedo = async () => {
    if (!canRedo) return;
    try {
      await redo();
      showToast('Wiederholt', 'success');
    } catch (error) {
      showToast('Fehler beim Wiederholen', 'error');
    }
  };

  const handleTileToggle = (tileId: string) => {
    setTiles(prev => prev.map(tile => 
      tile.id === tileId ? { ...tile, enabled: !tile.enabled } : tile
    ));
  };

  const handleModuleToggle = (moduleId: string) => {
    const moduleTiles = tiles.filter(tile => tile.moduleId === moduleId);
    const allEnabled = moduleTiles.every(tile => tile.enabled);
    
    setTiles(prev => prev.map(tile => 
      tile.moduleId === moduleId ? { ...tile, enabled: !allEnabled } : tile
    ));
  };

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) newExpanded.delete(moduleId); else newExpanded.add(moduleId);
    setExpandedModules(newExpanded);
  };

  const persistReorderDebounced = (ordered: DashboardTile[]) => {
    if (reorderDebounceRef.current) window.clearTimeout(reorderDebounceRef.current);
    reorderDebounceRef.current = window.setTimeout(() => {
      updateTileOrder(ordered).then(() => {
        showToast('Reihenfolge gespeichert', 'success');
      }).catch(() => {
        showToast('Fehler beim Speichern der Reihenfolge', 'error');
      });
    }, 400);
  };

  const handleTileReorder = (newOrder: DashboardTile[]) => {
    const updatedTiles = newOrder.map((tile, index) => ({ ...tile, position: index + 1 }));
    setTiles(updatedTiles);
    persistReorderDebounced(updatedTiles);
  };

  const handleTileSettings = (tile: DashboardTile) => {
    setSelectedTile(tile);
    setShowTileSettings(true);
  };

  const updateTileSettings = (updates: Partial<DashboardTile>) => {
    if (selectedTile) {
      setTiles(prev => prev.map(tile => tile.id === selectedTile.id ? { ...tile, ...updates } : tile));
    }
  };

  const resetToDefault = () => {
    setTiles(prev => prev.map(tile => ({ ...tile, enabled: true, size: 'medium', showValue: true, showChart: false, refreshInterval: 60 })));
    showToast('Standard-Einstellungen wiederhergestellt', 'info');
  };

  const handleSave = () => {
    onSave(tiles);
    showToast('Änderungen gespeichert', 'success');
    onClose();
  };

  const handleExport = async () => {
    setBusy(true);
    try { 
      const json = await exportData(); 
      setExportJson(json);
      showToast('Daten exportiert', 'success');
    } catch (error) {
      showToast('Fehler beim Exportieren', 'error');
    } finally { 
      setBusy(false); 
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) return;
    setBusy(true);
    try { 
      await importData(importText); 
      setImportText('');
      showToast('Daten erfolgreich importiert', 'success');
    } catch (error) {
      showToast('Fehler beim Importieren: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'), 'error');
    } finally { 
      setBusy(false); 
    }
  };

  const handlePreferencesUpdate = async (prefs: any) => {
    try {
      await updatePreferences(prefs);
      showToast('Einstellungen aktualisiert', 'success');
    } catch (error) {
      showToast('Fehler beim Aktualisieren der Einstellungen', 'error');
    }
  };

  const getTilesByModule = (moduleId: string) => tiles.filter(tile => tile.moduleId === moduleId);
  const getModuleStats = (moduleId: string) => {
    const moduleTiles = getTilesByModule(moduleId);
    const enabledCount = moduleTiles.filter(tile => tile.enabled).length;
    return { total: moduleTiles.length, enabled: enabledCount };
  };

  const moduleCategories = useMemo(() => ({
    monitoring: { name: 'Monitoring', icon: '📊', color: 'from-blue-500 to-cyan-600' },
    mycorrhiza: { name: 'Mykorrhiza', icon: '🍄', color: 'from-green-500 to-emerald-600' },
    trichoderma: { name: 'Trichoderma', icon: '🦠', color: 'from-purple-500 to-pink-600' },
    biological: { name: 'Biologische Innovationen', icon: '🧬', color: 'from-indigo-500 to-blue-600' },
    planning: { name: 'Planung', icon: '📅', color: 'from-orange-500 to-red-600' },
    training: { name: 'Training', icon: '🌱', color: 'from-lime-500 to-green-600' },
    diagnosis: { name: 'Diagnose', icon: '🔍', color: 'from-red-500 to-pink-600' },
    vpd: { name: 'VPD', icon: '🌡️', color: 'from-teal-500 to-cyan-600' },
    watering: { name: 'Bewässerung', icon: '💧', color: 'from-blue-500 to-indigo-600' },
    seeds: { name: 'Samen & Strains', icon: '🌿', color: 'from-emerald-500 to-green-600' },
    plants: { name: 'Pflanzen', icon: '🌺', color: 'from-pink-500 to-rose-600' },
    setup: { name: 'Setup', icon: '⚙️', color: 'from-gray-500 to-slate-600' }
  }), []);

  const sizeOptions = [
    { value: 'small', label: 'Klein', description: 'Kompakte Anzeige' },
    { value: 'medium', label: 'Mittel', description: 'Standard-Größe' },
    { value: 'large', label: 'Groß', description: 'Erweiterte Anzeige' }
  ];

  const refreshIntervals = [
    { value: 0, label: 'Manuell', description: 'Nur bei Bedarf' },
    { value: 30, label: '30 Sekunden', description: 'Hochfrequent' },
    { value: 60, label: '1 Minute', description: 'Standard' },
    { value: 300, label: '5 Minuten', description: 'Niedrig' },
    { value: 600, label: '10 Minuten', description: 'Sehr niedrig' },
    { value: 1800, label: '30 Minuten', description: 'Selten' },
    { value: 3600, label: '1 Stunde', description: 'Stündlich' },
    { value: 7200, label: '2 Stunden', description: 'Alle 2 Stunden' }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard anpassen</h2>
                  <span className="text-sm text-gray-500">(⌘Z / ⌘⇧Z für Undo/Redo)</span>
                </div>
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Schließen" title="Schließen">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex border-b border-gray-200 px-6">
                {[{ id: 'tiles', label: 'Kacheln', icon: Grid },{ id: 'layout', label: 'Layout', icon: List },{ id: 'appearance', label: 'Erscheinung', icon: Palette },{ id: 'advanced', label: 'Erweitert', icon: Settings }].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} aria-label={`${tab.label} Tab öffnen`} title={`${tab.label} Tab öffnen`}>
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'layout' && (
                    <motion.div key="layout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kachel-Reihenfolge anpassen</h3>
                        <p className="text-gray-600 mb-4">Ziehen Sie die Kacheln, um ihre Reihenfolge zu ändern</p>
                        <Reorder.Group axis="y" values={tiles.filter(t => t.enabled)} onReorder={handleTileReorder} className="space-y-2">
                          {tiles.filter(t => t.enabled).map((tile) => (
                            <Reorder.Item key={tile.id} value={tile} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Move className="w-5 h-5 text-gray-400 cursor-move" aria-hidden />
                                  <div>
                                    <div className="font-medium text-gray-900">{tile.label}</div>
                                    <div className="text-sm text-gray-500">{/* module name */}</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500" aria-hidden>🔲🟦🟩</span>
                                  <span className="text-sm text-gray-500">Position {tile.position}</span>
                                </div>
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'appearance' && (
                    <motion.div key="appearance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard-Theme</h3>
                          <div className="space-y-3">
                            {['light', 'dark', 'auto'].map((theme) => (
                              <label key={theme} className="flex items-center space-x-3 cursor-pointer">
                                <input type="radio" name="theme" value={theme} className="text-green-600" aria-label={`Theme ${theme}`} checked={preferences?.theme === theme} onChange={() => handlePreferencesUpdate({ theme })} />
                                <span className="capitalize">{theme}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kachel-Dichte</h3>
                          <div className="space-y-3">
                            {['compact', 'comfortable', 'spacious'].map((density) => (
                              <label key={density} className="flex items-center space-x-3 cursor-pointer">
                                <input type="radio" name="density" value={density} className="text-green-600" aria-label={`Dichte ${density}`} checked={(density === 'compact' && preferences?.compactMode) || (density !== 'compact' && !preferences?.compactMode)} onChange={() => handlePreferencesUpdate({ compactMode: density === 'compact' })} />
                                <span className="capitalize">{density}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'advanced' && (
                    <motion.div key="advanced" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Erweiterte Einstellungen</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Automatische Aktualisierung</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md" aria-label="Automatische Aktualisierung auswählen" value={preferences?.autoRefresh ? 'enabled' : 'disabled'} onChange={(e) => handlePreferencesUpdate({ autoRefresh: e.target.value === 'enabled' })}>
                              <option value="enabled">Aktiviert</option>
                              <option value="disabled">Deaktiviert</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Standard-Intervall</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md" aria-label="Daten-Cache auswählen" value={preferences?.refreshInterval ?? 60} onChange={(e) => handlePreferencesUpdate({ refreshInterval: parseInt(e.target.value) })}>
                              <option value={60}>1 Minute</option>
                              <option value={300}>5 Minuten</option>
                              <option value={600}>10 Minuten</option>
                              <option value={1800}>30 Minuten</option>
                              <option value={3600}>1 Stunde</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import/Export</h3>
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <button onClick={handleExport} disabled={busy} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50" aria-label="Exportieren">Exportieren</button>
                            <button onClick={handleImport} disabled={busy || !importText.trim()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50" aria-label="Importieren">Importieren</button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Import JSON</label>
                            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="JSON einfügen..." aria-label="Import JSON" title="Import JSON" />
                          </div>
                          {exportJson && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Export JSON</label>
                              <textarea value={exportJson} readOnly rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" aria-label="Export JSON" title="Export JSON" placeholder="Exportierter JSON-Inhalt" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'tiles' && (
                    <motion.div key="tiles" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      {Object.entries(moduleCategories).map(([moduleId, moduleInfo]) => {
                        const moduleTiles = tiles.filter(t => t.moduleId === moduleId);
                        const stats = getModuleStats(moduleId);
                        const isExpanded = expandedModules.has(moduleId);
                        const allEnabled = moduleTiles.every(tile => tile.enabled);

                        if (moduleTiles.length === 0) return null;

                        return (
                          <div key={moduleId} className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-gray-50">
                              <button onClick={() => toggleModuleExpansion(moduleId)} className="flex items-center space-x-3 flex-1 text-left" aria-label={`${moduleInfo.name} Bereich ${isExpanded ? 'zuklappen' : 'aufklappen'}`} title={`${moduleInfo.name} Bereich ${isExpanded ? 'zuklappen' : 'aufklappen'}`}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-r ${moduleInfo.color}`}>{moduleInfo.icon}</div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900">{moduleInfo.name}</h3>
                                  <p className="text-sm text-gray-500">{stats.enabled} von {stats.total} aktiv</p>
                                </div>
                              </button>
                              <button onClick={() => handleModuleToggle(moduleId)} className={`w-12 h-8 rounded-full transition-colors duration-300 ${allEnabled ? 'bg-green-500' : 'bg-gray-300'}`} aria-label={`Alle ${moduleInfo.name} Kacheln ${allEnabled ? 'ausblenden' : 'einblenden'}`} title={`Alle ${moduleInfo.name} Kacheln ${allEnabled ? 'ausblenden' : 'einblenden'}`}>
                                {allEnabled ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                              </button>
                            </div>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-gray-200">
                                  <div className="p-4 space-y-3">
                                    {moduleTiles.map((tile) => (
                                      <div key={tile.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                          <button onClick={() => handleTileToggle(tile.id)} className={`relative w-12 h-8 rounded-full transition-colors duration-300 ${tile.enabled ? 'bg-green-500' : 'bg-gray-300'}`} aria-label={`${tile.label} ${tile.enabled ? 'ausblenden' : 'einblenden'}`} title={`${tile.label} ${tile.enabled ? 'ausblenden' : 'einblenden'}`}>
                                            <motion.div className="w-6 h-6 bg-white rounded-full shadow-md" animate={{ x: tile.enabled ? 20 : 2 }} transition={{ duration: 0.3 }} />
                                          </button>
                                          <div className="flex items-center space-x-3">
                                            <span className="text-gray-700 font-medium">{tile.label}</span>
                                            <span className="text-sm text-gray-500" aria-hidden>🔲🟦🟩</span>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <button onClick={() => handleTileSettings(tile)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Einstellungen" aria-label={`${tile.label} Einstellungen`}>
                                            <Settings className="w-4 h-4" />
                                          </button>
                                          <Move className="w-4 h-4 text-gray-400" aria-hidden />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-gray-200 space-y-3">
                <div className="flex gap-3">
                  <button onClick={handleUndo} disabled={!canUndo} className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50" aria-label="Rückgängig">Rückgängig</button>
                  <button onClick={handleRedo} disabled={!canRedo} className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50" aria-label="Wiederholen">Wiederholen</button>
                </div>
                <button onClick={resetToDefault} className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2" title="Standard wiederherstellen" aria-label="Standard wiederherstellen">
                  <RotateCcw className="w-4 h-4" />
                  <span>Standard wiederherstellen</span>
                </button>
                <button onClick={handleSave} className="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2" title="Änderungen speichern" aria-label="Änderungen speichern">
                  <Save className="w-4 h-4" />
                  <span>Änderungen speichern</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />

      <AnimatePresence>
        {showTileSettings && selectedTile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTile.label} Einstellungen</h3>
                <button onClick={() => setShowTileSettings(false)} className="text-gray-400 hover:text-gray-600" aria-label="Einstellungsdialog schließen" title="Einstellungsdialog schließen">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Größe</label>
                  <select value={selectedTile.size} onChange={(e) => updateTileSettings({ size: e.target.value as DashboardTile['size'] })} className="w-full px-3 py-2 border border-gray-300 rounded-md" aria-label="Kachelgröße auswählen">
                    {sizeOptions.map(option => (<option key={option.value} value={option.value}>{option.label} - {option.description}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aktualisierungsintervall</label>
                  <select value={selectedTile.refreshInterval || 0} onChange={(e) => updateTileSettings({ refreshInterval: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md" aria-label="Aktualisierungsintervall auswählen">
                    {refreshIntervals.map(option => (<option key={option.value} value={option.value}>{option.label} - {option.description}</option>))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" checked={selectedTile.showValue} onChange={(e) => updateTileSettings({ showValue: e.target.checked })} className="text-green-600" aria-label="Werte anzeigen umschalten" />
                    <span className="text-sm text-gray-700">Werte anzeigen</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" checked={selectedTile.showChart} onChange={(e) => updateTileSettings({ showChart: e.target.checked })} className="text-green-600" aria-label="Chart anzeigen umschalten" />
                    <span className="text-sm text-gray-700">Chart anzeigen</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button onClick={() => setShowTileSettings(false)} className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" title="Abbrechen" aria-label="Abbrechen">Abbrechen</button>
                <button onClick={() => setShowTileSettings(false)} className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" title="Speichern" aria-label="Speichern">Speichern</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
