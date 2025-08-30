'use client';

import React, { useState, useEffect } from 'react';
import { Seed } from '../../types/seed';
import { seedDatabaseService } from '../../services/seedDatabaseService';
import { Card } from '../ui/Card';
import LoadingScreen from '../ui/LoadingScreen';

interface SeedDatabaseProps {
  onSeedSelect?: (seed: Seed) => void;
  showSearch?: boolean;
  showCategories?: boolean;
}

export const SeedDatabase: React.FC<SeedDatabaseProps> = ({
  onSeedSelect,
  showSearch = true,
  showCategories = true
}) => {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [filteredSeeds, setFilteredSeeds] = useState<Seed[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalCount: number; lastUpdated: Date } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(50);

  useEffect(() => {
    loadDatabase();
  }, []);

  useEffect(() => {
    setCurrentPage(0); // Zurück zur ersten Seite bei Filteränderungen
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    filterSeeds();
  }, [seeds, selectedCategory, searchQuery, currentPage]);

  const loadDatabase = async () => {
    try {
      setLoading(true);
      const [allSeeds, allCategories, databaseStats, totalPagesCount] = await Promise.all([
        seedDatabaseService.getAllSeeds(),
        seedDatabaseService.getCategories(),
        seedDatabaseService.getDatabaseStats(),
        seedDatabaseService.getTotalPages(pageSize)
      ]);
      
      setSeeds(allSeeds);
      setCategories(allCategories);
      setStats(databaseStats);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error('Fehler beim Laden der Samendatenbank:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSeeds = () => {
    let filtered = seeds;

    // Filter nach Kategorie
    if (selectedCategory) {
      filtered = filtered.filter(seed => seed.category === selectedCategory);
    }

    // Filter nach Suchanfrage
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(seed =>
        seed.name.toLowerCase().includes(query) ||
        seed.botanicalName?.toLowerCase().includes(query) ||
        seed.variety?.toLowerCase().includes(query) ||
        seed.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Pagination anwenden
    const start = currentPage * pageSize;
    const paginatedSeeds = filtered.slice(start, start + pageSize);
    
    setFilteredSeeds(paginatedSeeds);
  };

  const handleSeedClick = (seed: Seed) => {
    if (onSeedSelect) {
      onSeedSelect(seed);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header mit Statistiken */}
      {stats && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Samendatenbank</h2>
              <p className="text-sm text-gray-600">
                {stats.totalCount} Samen verfügbar • 
                Letzte Aktualisierung: {new Date(stats.lastUpdated).toLocaleDateString('de-DE')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{stats.totalCount}</div>
              <div className="text-xs text-gray-500">Samen</div>
            </div>
          </div>
        </div>
      )}

      {/* Suchleiste */}
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            placeholder="Samen suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}

      {/* Kategorie-Filter */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alle
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Ergebnisse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSeeds.map((seed) => (
          <Card
            key={seed.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleSeedClick(seed)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{seed.name}</h3>
                {seed.category && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {seed.category}
                  </span>
                )}
              </div>
              
              {seed.botanicalName && (
                <p className="text-sm text-gray-600 italic mb-2">
                  {seed.botanicalName}
                </p>
              )}

              <div className="space-y-1 text-sm text-gray-600">
                {seed.germinationTime && (
                  <div>🌱 Keimung: {seed.germinationTime} Tage</div>
                )}
                {seed.growingTime && (
                  <div>🌿 Wachstum: {seed.growingTime} Tage</div>
                )}
                {seed.optimalTemperature && (
                  <div>🌡️ Temperatur: {seed.optimalTemperature.min}-{seed.optimalTemperature.max}°C</div>
                )}
                {seed.lightRequirements && (
                  <div>☀️ Licht: {getLightRequirementText(seed.lightRequirements)}</div>
                )}
              </div>

              {seed.tags && seed.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {seed.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {seed.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{seed.tags.length - 3} weitere
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Keine Ergebnisse */}
      {filteredSeeds.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Keine Samen gefunden
          </h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory
              ? 'Versuchen Sie andere Suchbegriffe oder Kategorien.'
              : 'Die Samendatenbank ist leer.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredSeeds.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Zurück
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            Seite {currentPage + 1} von {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
};

function getLightRequirementText(requirement: string): string {
  switch (requirement) {
    case 'low': return 'Niedrig';
    case 'medium': return 'Mittel';
    case 'high': return 'Hoch';
    default: return requirement;
  }
}
