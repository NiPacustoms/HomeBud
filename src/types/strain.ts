export interface Strain {
  id: string;
  name: string;
  breeder?: string;
  genetics: {
    type: 'indica' | 'sativa' | 'hybrid';
    indicaPercentage?: number;
    sativaPercentage?: number;
    parentStrains?: string[];
  };
  cannabinoids: {
    thc: {
      min: number;
      max: number;
      average: number;
    };
    cbd: {
      min: number;
      max: number;
      average: number;
    };
    cbg?: {
      min: number;
      max: number;
      average: number;
    };
  };
  growing: {
    floweringTime: {
      min: number; // in Tagen
      max: number;
      average: number;
    };
    yield: {
      indoor: {
        min: number; // g/m²
        max: number;
        average: number;
      };
      outdoor: {
        min: number; // g/Pflanze
        max: number;
        average: number;
      };
    };
    height: {
      indoor: {
        min: number; // cm
        max: number;
        average: number;
      };
      outdoor: {
        min: number; // cm
        max: number;
        average: number;
      };
    };
    growthPattern: 'bushy' | 'tall' | 'compact' | 'spreading';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  environment: {
    climate: 'tropical' | 'temperate' | 'arid' | 'cold' | 'any';
    humidity: {
      vegetative: {
        min: number;
        max: number;
      };
      flowering: {
        min: number;
        max: number;
      };
    };
    temperature: {
      vegetative: {
        min: number;
        max: number;
      };
      flowering: {
        min: number;
        max: number;
      };
    };
    lightRequirements: 'low' | 'medium' | 'high';
    soilType: 'soil' | 'coco' | 'hydroponic' | 'aeroponic';
    nutrients: 'low' | 'medium' | 'high';
  };
  characteristics: {
    aroma: string[];
    flavor: string[];
    effects: {
      primary: string[];
      secondary: string[];
      negative?: string[];
    };
    medicalBenefits?: string[];
    recreationalEffects?: string[];
  };
  care: {
    watering: {
      frequency: 'low' | 'medium' | 'high';
      tips: string[];
    };
    training: {
      recommended: string[];
      tips: string[];
    };
    pestResistance: 'low' | 'medium' | 'high';
    diseaseResistance: 'low' | 'medium' | 'high';
    moldResistance: 'low' | 'medium' | 'high';
  };
  metadata: {
    tags: string[];
    awards?: string[];
    popularity: number; // 1-10
    availability: 'common' | 'rare' | 'limited';
    priceRange: 'budget' | 'mid' | 'premium';
    imageUrl?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface StrainFilter {
  genetics?: 'indica' | 'sativa' | 'hybrid';
  thcRange?: { min: number; max: number };
  cbdRange?: { min: number; max: number };
  floweringTime?: { min: number; max: number };
  yield?: { min: number; max: number };
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  climate?: string[];
  effects?: string[];
  aroma?: string[];
  priceRange?: string[];
  availability?: string[];
}

export interface StrainRecommendation {
  strain: Strain;
  score: number;
  reasons: string[];
  matchPercentage: number;
}

export interface UserPreferences {
  location: {
    climate: string;
    growingSeason: number; // Monate
    averageTemperature: number;
    averageHumidity: number;
  };
  experience: 'beginner' | 'intermediate' | 'advanced';
  growingSpace: 'indoor' | 'outdoor' | 'greenhouse';
  desiredEffects: string[];
  avoidEffects?: string[];
  maxHeight?: number;
  maxFloweringTime?: number;
  yieldPriority: 'low' | 'medium' | 'high';
  difficultyPreference: 'easy' | 'moderate' | 'challenging';
}

export interface StrainDatabase {
  strains: Strain[];
  categories: {
    genetics: string[];
    effects: string[];
    aromas: string[];
    climates: string[];
    difficulties: string[];
  };
  totalCount: number;
  lastUpdated: Date;
  version: string;
}
