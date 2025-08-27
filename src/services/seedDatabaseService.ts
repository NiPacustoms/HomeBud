import { Seed, SeedDatabase } from '../types/seed';

export class SeedDatabaseService {
  private static instance: SeedDatabaseService;
  private seedDatabase: SeedDatabase | null = null;
  private isInitialized = false;

  static getInstance(): SeedDatabaseService {
    if (!SeedDatabaseService.instance) {
      SeedDatabaseService.instance = new SeedDatabaseService();
    }
    return SeedDatabaseService.instance;
  }

  async initializeDatabase(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Lade die Datenbank aus dem public/data Ordner
      const response = await fetch('/data/seed-database.json');
      if (!response.ok) {
        throw new Error('Datenbank konnte nicht geladen werden');
      }
      
      this.seedDatabase = await response.json();
      this.isInitialized = true;
    } catch (error) {
      console.error('Fehler beim Laden der Samendatenbank:', error);
      // Fallback: Leere Datenbank
      this.seedDatabase = {
        seeds: [],
        categories: [],
        totalCount: 0,
        lastUpdated: new Date()
      };
    }
  }

  async getAllSeeds(): Promise<Seed[]> {
    await this.initializeDatabase();
    return this.seedDatabase?.seeds || [];
  }

  async getSeedsByPage(page: number, pageSize: number = 50): Promise<Seed[]> {
    const allSeeds = await this.getAllSeeds();
    const start = page * pageSize;
    return allSeeds.slice(start, start + pageSize);
  }

  async getTotalPages(pageSize: number = 50): Promise<number> {
    const allSeeds = await this.getAllSeeds();
    return Math.ceil(allSeeds.length / pageSize);
  }

  async getSeedsByCategory(category: string): Promise<Seed[]> {
    const seeds = await this.getAllSeeds();
    return seeds.filter(seed => seed.category === category);
  }

  async searchSeeds(query: string): Promise<Seed[]> {
    const seeds = await this.getAllSeeds();
    const lowerQuery = query.toLowerCase();
    
    return seeds.filter(seed => 
      seed.name.toLowerCase().includes(lowerQuery) ||
      seed.botanicalName?.toLowerCase().includes(lowerQuery) ||
      seed.variety?.toLowerCase().includes(lowerQuery) ||
      seed.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getSeedById(id: string): Promise<Seed | null> {
    const seeds = await this.getAllSeeds();
    return seeds.find(seed => seed.id === id) || null;
  }

  async getCategories(): Promise<string[]> {
    await this.initializeDatabase();
    return this.seedDatabase?.categories || [];
  }

  async getDatabaseStats(): Promise<{ totalCount: number; lastUpdated: Date }> {
    await this.initializeDatabase();
    return {
      totalCount: this.seedDatabase?.totalCount || 0,
      lastUpdated: this.seedDatabase?.lastUpdated || new Date()
    };
  }
}

// Exportiere eine Instanz für einfache Verwendung
export const seedDatabaseService = SeedDatabaseService.getInstance();
