'use client';

import React, { useState, useEffect } from 'react';
import { Strain, StrainFilter, UserPreferences, StrainRecommendation } from '../../types/strain';
import { strainDatabaseService } from '../../services/strainDatabaseService';
import StrainCard from './StrainCard';
import StrainFilterPanel from './StrainFilterPanel';
import StrainRecommendationWizard from './StrainRecommendationWizard';
import StrainComparison from './StrainComparison';

interface StrainDatabaseProps {
  initialView?: 'browse' | 'recommendations' | 'comparison';
}

export default function StrainDatabase({ initialView = 'browse' }: StrainDatabaseProps) {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [filteredStrains, setFilteredStrains] = useState<Strain[]>([]);
  const [recommendations, setRecommendations] = useState<StrainRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'browse' | 'recommendations' | 'comparison'>(initialView);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<StrainFilter>({});
  const [selectedStrains, setSelectedStrains] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState<{ totalCount: number; lastUpdated: Date; version: string } | null>(null);

  useEffect(() => {
    loadDatabase();
  }, []);

  useEffect(() => {
    if (currentView === 'browse') {
      applyFilters();
    }
  }, [currentFilter, searchQuery, currentView]);

  const loadDatabase = async () => {
    try {
      setLoading(true);
      const [allStrains, databaseStats] = await Promise.all([
        strainDatabaseService.getAllStrains(),
        strainDatabaseService.getDatabaseStats()
      ]);
      
      setStrains(allStrains);
      setFilteredStrains(allStrains);
      setStats(databaseStats);
      setTotalPages(Math.ceil(allStrains.length / 20));
    } catch (error) {
      console.error('Fehler beim Laden der Strain-Datenbank:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      let filtered: Strain[] = [];

      // Suche anwenden
      if (searchQuery.trim()) {
        filtered = await strainDatabaseService.searchStrains(searchQuery);
      } else {
        filtered = strains;
      }

      // Filter anwenden
      if (Object.keys(currentFilter).length > 0) {
        filtered = await strainDatabaseService.filterStrains(currentFilter);
      }

      setFilteredStrains(filtered);
      setTotalPages(Math.ceil(filtered.length / 20));
      setCurrentPage(0);
    } catch (error) {
      console.error('Fehler beim Anwenden der Filter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: StrainFilter) => {
    setCurrentFilter(filter);
  };

  const handleGetRecommendations = async (preferences: UserPreferences) => {
    try {
      setLoading(true);
      const recs = await strainDatabaseService.getRecommendations(preferences);
      setRecommendations(recs);
      setCurrentView('recommendations');
    } catch (error) {
      console.error('Fehler beim Laden der Empfehlungen:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStrainSelect = (strainId: string) => {
    setSelectedStrains(prev => {
      if (prev.includes(strainId)) {
        return prev.filter(id => id !== strainId);
      } else if (prev.length < 4) { // Maximal 4 Strains zum Vergleich
        return [...prev, strainId];
      }
      return prev;
    });
  };

  const handleCompareStrains = () => {
    if (selectedStrains.length >= 2) {
      setCurrentView('comparison');
    }
  };

  const getCurrentPageStrains = () => {
    const start = currentPage * 20;
    return filteredStrains.slice(start, start + 20);
  };

  if (loading && strains.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Lade Strain-Datenbank...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Cannabis Strain-Datenbank
              </h1>
              {stats && (
                <p className="text-gray-600">
                  {stats.totalCount} Strains verfügbar • 
                  Aktualisiert: {new Date(stats.lastUpdated).toLocaleDateString('de-DE')} • 
                  Version {stats.version}
                </p>
              )}
            </div>
            
            {/* Navigation */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentView('browse')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'browse'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Durchsuchen
              </button>
              <button
                onClick={() => setCurrentView('recommendations')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'recommendations'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                KI-Empfehlungen
              </button>
              {selectedStrains.length >= 2 && (
                <button
                  onClick={handleCompareStrains}
                  className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Vergleichen ({selectedStrains.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
              <StrainFilterPanel
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                currentFilter={currentFilter}
                searchQuery={searchQuery}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentView === 'browse' && (
              <div className="space-y-6">
                {/* Search Results Info */}
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                      {filteredStrains.length} von {strains.length} Strains gefunden
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedStrains([])}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Auswahl löschen
                      </button>
                    </div>
                  </div>
                </div>

                {/* Strain Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getCurrentPageStrains().map((strain) => (
                    <StrainCard
                      key={strain.id}
                      strain={strain}
                      isSelected={selectedStrains.includes(strain.id)}
                      onSelect={() => handleStrainSelect(strain.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 rounded-lg bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Zurück
                      </button>
                      
                      <span className="px-4 py-2 text-gray-600">
                        Seite {currentPage + 1} von {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="px-4 py-2 rounded-lg bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Weiter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === 'recommendations' && (
              <StrainRecommendationWizard
                onGetRecommendations={handleGetRecommendations}
                recommendations={recommendations}
                loading={loading}
                onStrainSelect={handleStrainSelect}
                selectedStrains={selectedStrains}
              />
            )}

            {currentView === 'comparison' && (
              <StrainComparison
                strainIds={selectedStrains}
                onBack={() => setCurrentView('browse')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
