import { 
  DashboardTile, 
  DashboardLayout, 
  DashboardTheme, 
  DashboardPreferences, 
  DashboardModule,
  DashboardData
} from '@/types/dashboard';

class DashboardService {
  private static instance: DashboardService;
  private storageKey = 'homebud-dashboard-data';
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(data: DashboardData) => void> = new Set();
  private history: DashboardData[] = [];
  private future: DashboardData[] = [];

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  public canUndo(): boolean { return this.history.length > 0; }
  public canRedo(): boolean { return this.future.length > 0; }

  public async undo(): Promise<void> {
    if (!this.canUndo()) return;
    const current = await this.loadDashboardData();
    const previous = this.history.pop()!;
    this.future.push(current);
    localStorage.setItem(this.storageKey, JSON.stringify(previous));
    this.notifyListeners(previous);
  }

  public async redo(): Promise<void> {
    if (!this.canRedo()) return;
    const current = await this.loadDashboardData();
    const next = this.future.pop()!;
    this.history.push(current);
    localStorage.setItem(this.storageKey, JSON.stringify(next));
    this.notifyListeners(next);
  }

  private initializeService() {
    this.loadFromStorage();
    this.startAutoSync();
    this.setupStorageListener();
  }

  // Daten laden
  public async loadDashboardData(): Promise<DashboardData> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        return this.migrateDataIfNeeded(data);
      }
      return this.getDefaultData();
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
      return this.getDefaultData();
    }
  }

  private pushHistory(snapshot: DashboardData) {
    // Limit History auf 20 Einträge
    this.history.push(snapshot);
    if (this.history.length > 20) this.history.shift();
    // Bei neuer Änderung Future verwerfen
    this.future = [];
  }

  // Daten speichern
  public async saveDashboardData(data: Partial<DashboardData>): Promise<void> {
    try {
      const currentData = await this.loadDashboardData();
      // Snapshot vorm Ändern in History
      this.pushHistory(currentData);
      const updatedData = { ...currentData, ...data, lastSync: new Date() } as DashboardData;
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedData));
      this.notifyListeners(updatedData);
      
      await this.syncToServer(updatedData);
    } catch (error) {
      console.error('Fehler beim Speichern der Dashboard-Daten:', error);
      throw error;
    }
  }

  // Einzelne Kachel speichern
  public async saveTile(tile: DashboardTile): Promise<void> {
    const data = await this.loadDashboardData();
    const tileIndex = data.tiles.findIndex(t => t.id === tile.id);
    if (tileIndex >= 0) data.tiles[tileIndex] = { ...tile, lastUpdated: new Date() };
    else data.tiles.push({ ...tile, lastUpdated: new Date() });
    await this.saveDashboardData({ tiles: data.tiles });
  }

  // Kachel löschen
  public async deleteTile(tileId: string): Promise<void> {
    const data = await this.loadDashboardData();
    data.tiles = data.tiles.filter(t => t.id !== tileId);
    await this.saveDashboardData({ tiles: data.tiles });
  }

  // Layout speichern
  public async saveLayout(layout: DashboardLayout): Promise<void> {
    const data = await this.loadDashboardData();
    const layoutIndex = data.layouts.findIndex(l => l.id === layout.id);
    if (layoutIndex >= 0) data.layouts[layoutIndex] = { ...layout, updatedAt: new Date() };
    else data.layouts.push({ ...layout, createdAt: new Date(), updatedAt: new Date() });
    await this.saveDashboardData({ layouts: data.layouts });
  }

  // Theme speichern
  public async saveTheme(theme: DashboardTheme): Promise<void> {
    const data = await this.loadDashboardData();
    const themeIndex = data.themes.findIndex(t => t.id === theme.id);
    if (themeIndex >= 0) data.themes[themeIndex] = theme; else data.themes.push(theme);
    await this.saveDashboardData({ themes: data.themes });
  }

  // Einstellungen aktualisieren
  public async updatePreferences(preferences: Partial<DashboardPreferences>): Promise<void> {
    const data = await this.loadDashboardData();
    const updated = { ...data.preferences, ...preferences };
    await this.saveDashboardData({ preferences: updated });
  }

  // Modul aktivieren/deaktivieren
  public async toggleModule(moduleId: string, enabled: boolean): Promise<void> {
    const data = await this.loadDashboardData();
    const module = data.modules.find(m => m.id === moduleId);
    if (module) {
      module.isEnabled = enabled;
      data.tiles.forEach(tile => { if (tile.moduleId === moduleId) tile.enabled = enabled; });
      await this.saveDashboardData({ modules: data.modules, tiles: data.tiles });
    }
  }

  // Kachel-Reihenfolge aktualisieren
  public async updateTileOrder(tiles: DashboardTile[]): Promise<void> {
    const updatedTiles = tiles.map((tile, index) => ({ ...tile, position: index + 1, lastUpdated: new Date() }));
    await this.saveDashboardData({ tiles: updatedTiles });
  }

  // Daten zurücksetzen
  public async resetToDefault(): Promise<void> {
    const defaultData = this.getDefaultData();
    // Reset löscht History/Future
    this.history = [];
    this.future = [];
    await this.saveDashboardData(defaultData);
  }

  // Daten exportieren
  public async exportData(): Promise<string> {
    const data = await this.loadDashboardData();
    return JSON.stringify(data, null, 2);
  }

  // Daten importieren
  public async importData(jsonData: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonData);
      const validatedData = this.validateImportedData(importedData);
      await this.saveDashboardData(validatedData);
    } catch (error) {
      console.error('Fehler beim Importieren der Daten:', error);
      throw new Error('Ungültige Import-Daten');
    }
  }

  public subscribe(listener: (data: DashboardData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(data: DashboardData) {
    this.listeners.forEach(listener => {
      try { listener(data); } catch (error) { console.error('Listener Fehler:', error); }
    });
  }

  private startAutoSync() {
    if (this.syncInterval) clearInterval(this.syncInterval);
    this.syncInterval = setInterval(async () => {
      try {
        const data = await this.loadDashboardData();
        if (data.preferences.autoRefresh) await this.syncToServer(data);
      } catch (error) { console.error('Auto-Sync Fehler:', error); }
    }, 5 * 60 * 1000);
  }

  private async syncToServer(_data: DashboardData): Promise<void> {
    try {
      // Simulierter Sync
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error('Server-Sync fehlgeschlagen:', error);
    }
  }

  private setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey && event.newValue) {
        try { const data = JSON.parse(event.newValue); this.notifyListeners(data); }
        catch (error) { console.error('Storage-Änderung Fehler:', error); }
      }
    });
  }

  private validateImportedData(data: any): DashboardData {
    if (!data.tiles || !Array.isArray(data.tiles)) throw new Error('Ungültige Kachel-Daten');
    if (!data.preferences || typeof data.preferences !== 'object') throw new Error('Ungültige Einstellungen');
    return data as DashboardData;
  }

  private migrateDataIfNeeded(data: any): DashboardData {
    if (!data.version) {
      data.version = '1.0.0';
      data.lastSync = new Date();
    }
    return data as DashboardData;
  }

  private getDefaultData(): DashboardData {
    return {
      tiles: this.getDefaultTiles(),
      layouts: this.getDefaultLayouts(),
      themes: this.getDefaultThemes(),
      preferences: this.getDefaultPreferences(),
      modules: this.getDefaultModules(),
      lastSync: new Date()
    };
  }

  private getDefaultTiles(): DashboardTile[] {
    return [
      { id: 'temperature', label: 'Temperatur', moduleId: 'monitoring', enabled: true, size: 'medium', position: 1, showValue: true, showChart: true, refreshInterval: 30 },
      { id: 'humidity', label: 'Luftfeuchtigkeit', moduleId: 'monitoring', enabled: true, size: 'medium', position: 2, showValue: true, showChart: true, refreshInterval: 30 },
      { id: 'ph', label: 'pH-Wert', moduleId: 'monitoring', enabled: true, size: 'small', position: 3, showValue: true, showChart: false, refreshInterval: 60 },
      { id: 'ec', label: 'EC-Wert', moduleId: 'monitoring', enabled: true, size: 'small', position: 4, showValue: true, showChart: false, refreshInterval: 60 },
      { id: 'vpd-chart', label: 'VPD-Chart', moduleId: 'vpd', enabled: true, size: 'large', position: 5, showValue: true, showChart: true, refreshInterval: 60 },
      { id: 'grow-calendar', label: 'Anbau-Kalender', moduleId: 'planning', enabled: true, size: 'large', position: 6, showValue: false, showChart: false, refreshInterval: 3600 }
    ];
  }

  private getDefaultLayouts(): DashboardLayout[] {
    return [
      { id: 'default', name: 'Standard-Layout', description: 'Standard-Dashboard-Layout', tiles: this.getDefaultTiles(), gridTemplate: 'repeat(auto-fit, minmax(300px, 1fr))', breakpoints: { sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, createdAt: new Date(), updatedAt: new Date(), isDefault: true }
    ];
  }

  private getDefaultThemes(): DashboardTheme[] {
    return [
      { id: 'light', name: 'Hell', colors: { primary: '#10b981', secondary: '#3b82f6', accent: '#f59e0b', background: '#ffffff', surface: '#f9fafb', text: '#111827', textSecondary: '#6b7280' }, borderRadius: 'lg', shadows: 'md', spacing: 'comfortable' },
      { id: 'dark', name: 'Dunkel', colors: { primary: '#10b981', secondary: '#3b82f6', accent: '#f59e0b', background: '#111827', surface: '#1f2937', text: '#f9fafb', textSecondary: '#d1d5db' }, borderRadius: 'lg', shadows: 'lg', spacing: 'comfortable' }
    ];
  }

  private getDefaultPreferences(): DashboardPreferences {
    return { theme: 'light', autoRefresh: true, refreshInterval: 60, showNotifications: true, compactMode: false, showGrid: true, animations: true, dataRetention: 30 };
  }

  private getDefaultModules(): DashboardModule[] {
    return [
      { id: 'monitoring', name: 'Monitoring', icon: '📊', color: 'from-blue-500 to-cyan-600', description: 'Überwachung von Umweltparametern', category: 'core', version: '1.0.0', permissions: ['read', 'write'], tiles: [], isEnabled: true },
      { id: 'vpd', name: 'VPD', icon: '🌡️', color: 'from-teal-500 to-cyan-600', description: 'Vapor Pressure Deficit Berechnung', category: 'core', version: '1.0.0', permissions: ['read', 'write'], tiles: [], isEnabled: true }
    ];
  }

  public getTileById(tileId: string): DashboardTile | undefined { return this.getCurrentData()?.tiles.find(t => t.id === tileId); }
  public getModuleById(moduleId: string): DashboardModule | undefined { return this.getCurrentData()?.modules.find(m => m.id === moduleId); }
  public getCurrentData(): DashboardData | null {
    try { const stored = localStorage.getItem(this.storageKey); return stored ? JSON.parse(stored) : null; } catch { return null; }
  }

  public destroy() {
    if (this.syncInterval) clearInterval(this.syncInterval);
    this.listeners.clear();
    this.history = [];
    this.future = [];
  }

  private loadFromStorage() {
    this.loadDashboardData().catch(console.error);
  }
}

export default DashboardService;
