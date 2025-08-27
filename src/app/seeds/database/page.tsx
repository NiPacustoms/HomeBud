'use client';

import React, { useState } from 'react';
import { SeedDatabase } from '../../../components/seeds/SeedDatabase';
import { Seed } from '../../../types/seed';
import { Card } from '../../../components/ui/Card';

export default function SeedDatabasePage() {
  const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);

  const handleSeedSelect = (seed: Seed) => {
    setSelectedSeed(seed);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Samendatenbank
        </h1>
        <p className="text-gray-600">
          Durchsuchen Sie unsere umfangreiche Samendatenbank und finden Sie die perfekten Samen für Ihren Garten.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hauptbereich - Samendatenbank */}
        <div className="lg:col-span-2">
          <SeedDatabase onSeedSelect={handleSeedSelect} />
        </div>

        {/* Sidebar - Details des ausgewählten Samens */}
        <div className="lg:col-span-1">
          {selectedSeed ? (
            <Card className="sticky top-4">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedSeed.name}
                  </h2>
                  <button
                    onClick={() => setSelectedSeed(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {selectedSeed.botanicalName && (
                  <p className="text-sm text-gray-600 italic mb-4">
                    {selectedSeed.botanicalName}
                  </p>
                )}

                <div className="space-y-4">
                  {/* Grundinformationen */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Grundinformationen</h3>
                    <div className="space-y-2 text-sm">
                      {selectedSeed.category && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kategorie:</span>
                          <span className="font-medium">{selectedSeed.category}</span>
                        </div>
                      )}
                      {selectedSeed.variety && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sorte:</span>
                          <span className="font-medium">{selectedSeed.variety}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wachstumsbedingungen */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Wachstumsbedingungen</h3>
                    <div className="space-y-2 text-sm">
                      {selectedSeed.germinationTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Keimzeit:</span>
                          <span className="font-medium">{selectedSeed.germinationTime} Tage</span>
                        </div>
                      )}
                      {selectedSeed.growingTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wachstumszeit:</span>
                          <span className="font-medium">{selectedSeed.growingTime} Tage</span>
                        </div>
                      )}
                      {selectedSeed.optimalTemperature && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperatur:</span>
                          <span className="font-medium">
                            {selectedSeed.optimalTemperature.min}-{selectedSeed.optimalTemperature.max}°C
                          </span>
                        </div>
                      )}
                      {selectedSeed.optimalHumidity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Luftfeuchtigkeit:</span>
                          <span className="font-medium">
                            {selectedSeed.optimalHumidity.min}-{selectedSeed.optimalHumidity.max}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Anforderungen */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Anforderungen</h3>
                    <div className="space-y-2 text-sm">
                      {selectedSeed.lightRequirements && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Licht:</span>
                          <span className="font-medium capitalize">{selectedSeed.lightRequirements}</span>
                        </div>
                      )}
                      {selectedSeed.waterRequirements && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wasser:</span>
                          <span className="font-medium capitalize">{selectedSeed.waterRequirements}</span>
                        </div>
                      )}
                      {selectedSeed.soilType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bodentyp:</span>
                          <span className="font-medium">{selectedSeed.soilType}</span>
                        </div>
                      )}
                      {selectedSeed.pH && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">pH-Wert:</span>
                          <span className="font-medium">
                            {selectedSeed.pH.min}-{selectedSeed.pH.max}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pflanzung */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Pflanzung</h3>
                    <div className="space-y-2 text-sm">
                      {selectedSeed.spacing && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pflanzabstand:</span>
                          <span className="font-medium">{selectedSeed.spacing} cm</span>
                        </div>
                      )}
                      {selectedSeed.depth && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pflanztiefe:</span>
                          <span className="font-medium">{selectedSeed.depth} cm</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ernte */}
                  {(selectedSeed.harvestTime || selectedSeed.yield) && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Ernte</h3>
                      <div className="space-y-2 text-sm">
                        {selectedSeed.harvestTime && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Erntezeit:</span>
                            <span className="font-medium">{selectedSeed.harvestTime}</span>
                          </div>
                        )}
                        {selectedSeed.yield && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ertrag:</span>
                            <span className="font-medium">{selectedSeed.yield}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedSeed.tags && selectedSeed.tags.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedSeed.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notizen */}
                  {selectedSeed.notes && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Notizen</h3>
                      <p className="text-sm text-gray-600">{selectedSeed.notes}</p>
                    </div>
                  )}
                </div>

                {/* Aktionsbuttons */}
                <div className="mt-6 space-y-2">
                  <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    Zu meinen Pflanzen hinzufügen
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    Als Favorit markieren
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="sticky top-4">
              <div className="p-6 text-center">
                <div className="text-gray-400 text-4xl mb-4">🌱</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Samen auswählen
                </h3>
                <p className="text-gray-500 text-sm">
                  Wählen Sie einen Samen aus der Liste aus, um detaillierte Informationen zu sehen.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
