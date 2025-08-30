'use client';

import React, { useState, useEffect } from 'react';
import { StrainFilter } from '../../types/strain';
import { strainDatabaseService } from '../../services/strainDatabaseService';

interface StrainFilterPanelProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: StrainFilter) => void;
  currentFilter: StrainFilter;
  searchQuery: string;
}

export default function StrainFilterPanel({
  onSearch,
  onFilterChange,
  currentFilter,
  searchQuery
}: StrainFilterPanelProps) {
  const [categories, setCategories] = useState<any>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localFilter, setLocalFilter] = useState<StrainFilter>(currentFilter);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalFilter(currentFilter);
  }, [currentFilter]);

  const loadCategories = async () => {
    try {
      const cats = await strainDatabaseService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error);
    }
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof StrainFilter, value: any) => {
    const newFilter = { ...localFilter } as any;
    
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete newFilter[key];
    } else {
      newFilter[key] = value;
    }
    
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleRangeChange = (key: 'thcRange' | 'cbdRange' | 'floweringTime' | 'yield', field: 'min' | 'max', value: number) => {
    const newFilter = { ...localFilter };
    const range = newFilter[key] || { min: 0, max: 100 };
    
    range[field] = value;
    newFilter[key] = range;
    
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const clearAllFilters = () => {
    setLocalFilter({});
    setLocalSearchQuery('');
    onFilterChange({});
    onSearch('');
  };

  const hasActiveFilters = Object.keys(currentFilter).length > 0 || searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter & Suche</h3>
        
        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suche
          </label>
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Strain-Name, Breeder, Effekte..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full mb-4 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Alle Filter löschen
          </button>
        )}
      </div>

      {/* Genetics Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Genetik</h4>
        <div className="space-y-2">
          {['indica', 'sativa', 'hybrid'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="genetics"
                value={type}
                checked={localFilter.genetics === type}
                onChange={(e) => handleFilterChange('genetics', e.target.value)}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* THC Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">THC-Gehalt (%)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilter.thcRange?.min || ''}
            onChange={(e) => handleRangeChange('thcRange', 'min', Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilter.thcRange?.max || ''}
            onChange={(e) => handleRangeChange('thcRange', 'max', Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {/* CBD Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">CBD-Gehalt (%)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilter.cbdRange?.min || ''}
            onChange={(e) => handleRangeChange('cbdRange', 'min', Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilter.cbdRange?.max || ''}
            onChange={(e) => handleRangeChange('cbdRange', 'max', Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Flowering Time */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Blütezeit (Tage)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilter.floweringTime?.min || ''}
            onChange={(e) => handleRangeChange('floweringTime', 'min', Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilter.floweringTime?.max || ''}
            onChange={(e) => handleRangeChange('floweringTime', 'max', Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Yield */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Ertrag (g/m²)</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilter.yield?.min || ''}
            onChange={(e) => handleRangeChange('yield', 'min', Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilter.yield?.max || ''}
            onChange={(e) => handleRangeChange('yield', 'max', Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Schwierigkeitsgrad</h4>
        <div className="space-y-2">
          {[
            { value: 'beginner', label: 'Anfänger' },
            { value: 'intermediate', label: 'Fortgeschritten' },
            { value: 'advanced', label: 'Experte' }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value={value}
                checked={localFilter.difficulty === value}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Climate */}
      {categories?.climates && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Klima</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {categories.climates.map((climate: string) => (
              <label key={climate} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilter.climate?.includes(climate) || false}
                  onChange={(e) => {
                    const current = localFilter.climate || [];
                    const newClimate = e.target.checked
                      ? [...current, climate]
                      : current.filter(c => c !== climate);
                    handleFilterChange('climate', newClimate.length > 0 ? newClimate : undefined);
                  }}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 capitalize">{climate}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Effects */}
      {categories?.effects && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Effekte</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {categories.effects.slice(0, 15).map((effect: string) => (
              <label key={effect} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilter.effects?.includes(effect) || false}
                  onChange={(e) => {
                    const current = localFilter.effects || [];
                    const newEffects = e.target.checked
                      ? [...current, effect]
                      : current.filter(e => e !== effect);
                    handleFilterChange('effects', newEffects.length > 0 ? newEffects : undefined);
                  }}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{effect}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Aromas */}
      {categories?.aromas && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Aromen</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {categories.aromas.slice(0, 15).map((aroma: string) => (
              <label key={aroma} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilter.aroma?.includes(aroma) || false}
                  onChange={(e) => {
                    const current = localFilter.aroma || [];
                    const newAromas = e.target.checked
                      ? [...current, aroma]
                      : current.filter(a => a !== aroma);
                    handleFilterChange('aroma', newAromas.length > 0 ? newAromas : undefined);
                  }}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{aroma}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Preisbereich</h4>
        <div className="space-y-2">
          {[
            { value: 'budget', label: 'Günstig' },
            { value: 'mid', label: 'Mittel' },
            { value: 'premium', label: 'Premium' }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilter.priceRange?.includes(value) || false}
                onChange={(e) => {
                  const current = localFilter.priceRange || [];
                  const newPriceRange = e.target.checked
                    ? [...current, value]
                    : current.filter(p => p !== value);
                  handleFilterChange('priceRange', newPriceRange.length > 0 ? newPriceRange : undefined);
                }}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Verfügbarkeit</h4>
        <div className="space-y-2">
          {[
            { value: 'common', label: 'Verfügbar' },
            { value: 'rare', label: 'Selten' },
            { value: 'limited', label: 'Limitiert' }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilter.availability?.includes(value) || false}
                onChange={(e) => {
                  const current = localFilter.availability || [];
                  const newAvailability = e.target.checked
                    ? [...current, value]
                    : current.filter(a => a !== value);
                  handleFilterChange('availability', newAvailability.length > 0 ? newAvailability : undefined);
                }}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
