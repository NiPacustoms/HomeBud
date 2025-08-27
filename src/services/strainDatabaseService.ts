import { 
  Strain, 
  StrainFilter, 
  StrainRecommendation, 
  UserPreferences, 
  StrainDatabase 
} from '../types/strain';

export class StrainDatabaseService {
  private static instance: StrainDatabaseService;
  private strainDatabase: StrainDatabase | null = null;
  private isInitialized = false;

  static getInstance(): StrainDatabaseService {
    if (!StrainDatabaseService.instance) {
      StrainDatabaseService.instance = new StrainDatabaseService();
    }
    return StrainDatabaseService.instance;
  }

  async initializeDatabase(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Lade die Strain-Datenbank aus dem public/data Ordner
      const response = await fetch('/data/strain-database.json');
      if (!response.ok) {
        throw new Error('Strain-Datenbank konnte nicht geladen werden');
      }
      
      this.strainDatabase = await response.json();
      this.isInitialized = true;
    } catch (error) {
      console.error('Fehler beim Laden der Strain-Datenbank:', error);
      // Fallback: Leere Datenbank
      this.strainDatabase = {
        strains: [],
        categories: {
          genetics: [],
          effects: [],
          aromas: [],
          climates: [],
          difficulties: []
        },
        totalCount: 0,
        lastUpdated: new Date(),
        version: '1.0.0'
      };
    }
  }

  // Grundlegende Datenbank-Operationen
  async getAllStrains(): Promise<Strain[]> {
    await this.initializeDatabase();
    return this.strainDatabase?.strains || [];
  }

  async getStrainById(id: string): Promise<Strain | null> {
    const strains = await this.getAllStrains();
    return strains.find(strain => strain.id === id) || null;
  }

  async getStrainsByPage(page: number, pageSize: number = 20): Promise<Strain[]> {
    const allStrains = await this.getAllStrains();
    const start = page * pageSize;
    return allStrains.slice(start, start + pageSize);
  }

  async getTotalPages(pageSize: number = 20): Promise<number> {
    const allStrains = await this.getAllStrains();
    return Math.ceil(allStrains.length / pageSize);
  }

  // Erweiterte Suchfunktionen
  async searchStrains(query: string): Promise<Strain[]> {
    const strains = await this.getAllStrains();
    const lowerQuery = query.toLowerCase();
    
    return strains.filter(strain => 
      strain.name.toLowerCase().includes(lowerQuery) ||
      strain.breeder?.toLowerCase().includes(lowerQuery) ||
      strain.characteristics.aroma.some(aroma => 
        aroma.toLowerCase().includes(lowerQuery)
      ) ||
      strain.characteristics.flavor.some(flavor => 
        flavor.toLowerCase().includes(lowerQuery)
      ) ||
      strain.characteristics.effects.primary.some(effect => 
        effect.toLowerCase().includes(lowerQuery)
      ) ||
      strain.metadata.tags.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      )
    );
  }

  async filterStrains(filter: StrainFilter): Promise<Strain[]> {
    const strains = await this.getAllStrains();
    
    return strains.filter(strain => {
      // Genetik-Filter
      if (filter.genetics && strain.genetics.type !== filter.genetics) {
        return false;
      }

      // THC-Bereich
      if (filter.thcRange) {
        const avgThc = strain.cannabinoids.thc.average;
        if (avgThc < filter.thcRange.min || avgThc > filter.thcRange.max) {
          return false;
        }
      }

      // CBD-Bereich
      if (filter.cbdRange) {
        const avgCbd = strain.cannabinoids.cbd.average;
        if (avgCbd < filter.cbdRange.min || avgCbd > filter.cbdRange.max) {
          return false;
        }
      }

      // Blütezeit
      if (filter.floweringTime) {
        const avgFlowering = strain.growing.floweringTime.average;
        if (avgFlowering < filter.floweringTime.min || avgFlowering > filter.floweringTime.max) {
          return false;
        }
      }

      // Ertrag
      if (filter.yield) {
        const avgYield = (strain.growing.yield.indoor.average + strain.growing.yield.outdoor.average) / 2;
        if (avgYield < filter.yield.min || avgYield > filter.yield.max) {
          return false;
        }
      }

      // Schwierigkeitsgrad
      if (filter.difficulty && strain.growing.difficulty !== filter.difficulty) {
        return false;
      }

      // Klima
      if (filter.climate && filter.climate.length > 0) {
        if (!filter.climate.includes(strain.environment.climate)) {
          return false;
        }
      }

      // Effekte
      if (filter.effects && filter.effects.length > 0) {
        const strainEffects = [
          ...strain.characteristics.effects.primary,
          ...strain.characteristics.effects.secondary
        ];
        if (!filter.effects.some(effect => strainEffects.includes(effect))) {
          return false;
        }
      }

      // Aromen
      if (filter.aroma && filter.aroma.length > 0) {
        if (!filter.aroma.some(aroma => strain.characteristics.aroma.includes(aroma))) {
          return false;
        }
      }

      // Preisbereich
      if (filter.priceRange && filter.priceRange.length > 0) {
        if (!filter.priceRange.includes(strain.metadata.priceRange)) {
          return false;
        }
      }

      // Verfügbarkeit
      if (filter.availability && filter.availability.length > 0) {
        if (!filter.availability.includes(strain.metadata.availability)) {
          return false;
        }
      }

      return true;
    });
  }

  // KI-gestützte Empfehlungslogik
  async getRecommendations(preferences: UserPreferences): Promise<StrainRecommendation[]> {
    const strains = await this.getAllStrains();
    const recommendations: StrainRecommendation[] = [];

    for (const strain of strains) {
      const score = this.calculateMatchScore(strain, preferences);
      const reasons = this.getMatchReasons(strain, preferences);
      const matchPercentage = Math.round(score * 100);

      if (score > 0.3) { // Mindestscore für Empfehlungen
        recommendations.push({
          strain,
          score,
          reasons,
          matchPercentage
        });
      }
    }

    // Sortiere nach Score (höchste zuerst)
    return recommendations.sort((a, b) => b.score - a.score);
  }

  private calculateMatchScore(strain: Strain, preferences: UserPreferences): number {
    let score = 0;
    let totalWeight = 0;

    // Klima-Kompatibilität (Gewicht: 0.25)
    const climateScore = this.calculateClimateScore(strain, preferences);
    score += climateScore * 0.25;
    totalWeight += 0.25;

    // Erfahrungslevel (Gewicht: 0.2)
    const experienceScore = this.calculateExperienceScore(strain, preferences);
    score += experienceScore * 0.2;
    totalWeight += 0.2;

    // Gewünschte Effekte (Gewicht: 0.25)
    const effectsScore = this.calculateEffectsScore(strain, preferences);
    score += effectsScore * 0.25;
    totalWeight += 0.25;

    // Höhenbeschränkung (Gewicht: 0.15)
    const heightScore = this.calculateHeightScore(strain, preferences);
    score += heightScore * 0.15;
    totalWeight += 0.15;

    // Blütezeit (Gewicht: 0.15)
    const floweringScore = this.calculateFloweringScore(strain, preferences);
    score += floweringScore * 0.15;
    totalWeight += 0.15;

    return score / totalWeight;
  }

  private calculateClimateScore(strain: Strain, preferences: UserPreferences): number {
    const strainClimate = strain.environment.climate;
    const userClimate = preferences.location.climate;

    if (strainClimate === 'any') return 1.0;
    if (strainClimate === userClimate) return 1.0;
    
    // Klima-Kompatibilitätsmatrix
    const compatibilityMatrix: Record<string, string[]> = {
      'temperate': ['temperate', 'cold'],
      'tropical': ['tropical', 'temperate'],
      'arid': ['arid', 'temperate'],
      'cold': ['cold', 'temperate']
    };

    if (compatibilityMatrix[strainClimate]?.includes(userClimate)) {
      return 0.7;
    }

    return 0.3;
  }

  private calculateExperienceScore(strain: Strain, preferences: UserPreferences): number {
    const strainDifficulty = strain.growing.difficulty;
    const userExperience = preferences.experience;

    const difficultyMap = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };

    const strainLevel = difficultyMap[strainDifficulty];
    const userLevel = difficultyMap[userExperience];

    if (strainLevel <= userLevel) return 1.0;
    if (strainLevel === userLevel + 1) return 0.7;
    return 0.3;
  }

  private calculateEffectsScore(strain: Strain, preferences: UserPreferences): number {
    const strainEffects = [
      ...strain.characteristics.effects.primary,
      ...strain.characteristics.effects.secondary
    ];
    const desiredEffects = preferences.desiredEffects;
    const avoidEffects = preferences.avoidEffects || [];

    let score = 0;
    let totalEffects = desiredEffects.length;

    // Positive Effekte
    for (const effect of desiredEffects) {
      if (strainEffects.includes(effect)) {
        score += 1;
      }
    }

    // Negative Effekte (Abzug)
    for (const effect of avoidEffects) {
      if (strainEffects.includes(effect)) {
        score -= 0.5;
      }
    }

    return Math.max(0, score / totalEffects);
  }

  private calculateHeightScore(strain: Strain, preferences: UserPreferences): number {
    if (!preferences.maxHeight) return 1.0;

    const maxHeight = preferences.maxHeight;
    const strainHeight = strain.growing.height.indoor.average;

    if (strainHeight <= maxHeight) return 1.0;
    if (strainHeight <= maxHeight * 1.2) return 0.7;
    return 0.3;
  }

  private calculateFloweringScore(strain: Strain, preferences: UserPreferences): number {
    if (!preferences.maxFloweringTime) return 1.0;

    const maxFlowering = preferences.maxFloweringTime;
    const strainFlowering = strain.growing.floweringTime.average;

    if (strainFlowering <= maxFlowering) return 1.0;
    if (strainFlowering <= maxFlowering * 1.3) return 0.7;
    return 0.3;
  }

  private getMatchReasons(strain: Strain, preferences: UserPreferences): string[] {
    const reasons: string[] = [];

    // Klima-Grund
    const climateScore = this.calculateClimateScore(strain, preferences);
    if (climateScore >= 0.8) {
      reasons.push(`Perfekt für ${preferences.location.climate} Klima`);
    } else if (climateScore >= 0.6) {
      reasons.push(`Gut geeignet für ${preferences.location.climate} Klima`);
    }

    // Erfahrungslevel
    const experienceScore = this.calculateExperienceScore(strain, preferences);
    if (experienceScore >= 0.8) {
      reasons.push(`Ideal für ${preferences.experience} Anbauer`);
    }

    // Effekte
    const strainEffects = [
      ...strain.characteristics.effects.primary,
      ...strain.characteristics.effects.secondary
    ];
    const matchingEffects = preferences.desiredEffects.filter(effect => 
      strainEffects.includes(effect)
    );
    if (matchingEffects.length > 0) {
      reasons.push(`Bietet gewünschte Effekte: ${matchingEffects.join(', ')}`);
    }

    // Höhe
    if (preferences.maxHeight && strain.growing.height.indoor.average <= preferences.maxHeight) {
      reasons.push(`Passende Höhe für verfügbaren Platz`);
    }

    // Blütezeit
    if (preferences.maxFloweringTime && strain.growing.floweringTime.average <= preferences.maxFloweringTime) {
      reasons.push(`Schnelle Blütezeit`);
    }

    return reasons;
  }

  // Kategorien und Statistiken
  async getCategories(): Promise<StrainDatabase['categories']> {
    await this.initializeDatabase();
    return this.strainDatabase?.categories || {
      genetics: [],
      effects: [],
      aromas: [],
      climates: [],
      difficulties: []
    };
  }

  async getDatabaseStats(): Promise<{ totalCount: number; lastUpdated: Date; version: string }> {
    await this.initializeDatabase();
    return {
      totalCount: this.strainDatabase?.totalCount || 0,
      lastUpdated: this.strainDatabase?.lastUpdated || new Date(),
      version: this.strainDatabase?.version || '1.0.0'
    };
  }

  // Vergleichsfunktionen
  async compareStrains(strainIds: string[]): Promise<Strain[]> {
    const strains: Strain[] = [];
    
    for (const id of strainIds) {
      const strain = await this.getStrainById(id);
      if (strain) {
        strains.push(strain);
      }
    }

    return strains;
  }

  // Beliebte Strains
  async getPopularStrains(limit: number = 10): Promise<Strain[]> {
    const strains = await this.getAllStrains();
    return strains
      .sort((a, b) => b.metadata.popularity - a.metadata.popularity)
      .slice(0, limit);
  }

  // Neue Strains
  async getRecentStrains(limit: number = 10): Promise<Strain[]> {
    const strains = await this.getAllStrains();
    return strains
      .sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime())
      .slice(0, limit);
  }
}

// Exportiere eine Instanz für einfache Verwendung
export const strainDatabaseService = StrainDatabaseService.getInstance();
