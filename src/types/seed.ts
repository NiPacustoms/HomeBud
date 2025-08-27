export interface Seed {
  id: string;
  name: string;
  botanicalName?: string;
  variety?: string;
  category?: string;
  germinationTime?: number; // in Tagen
  growingTime?: number; // in Tagen
  optimalTemperature?: {
    min: number;
    max: number;
  };
  optimalHumidity?: {
    min: number;
    max: number;
  };
  lightRequirements?: 'low' | 'medium' | 'high';
  waterRequirements?: 'low' | 'medium' | 'high';
  soilType?: string;
  pH?: {
    min: number;
    max: number;
  };
  spacing?: number; // cm zwischen Pflanzen
  depth?: number; // Pflanztiefe in cm
  harvestTime?: string;
  yield?: string;
  notes?: string;
  imageUrl?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SeedDatabase {
  seeds: Seed[];
  categories: string[];
  totalCount: number;
  lastUpdated: Date;
}
