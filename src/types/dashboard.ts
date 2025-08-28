export interface DashboardTile {
  id: string;
  label: string;
  moduleId: string;
  enabled: boolean;
  size: 'small' | 'medium' | 'large' | 'full-width';
  position: number;
  color?: string;
  showValue?: boolean;
  showChart?: boolean;
  refreshInterval?: number;
  customSettings?: Record<string, any>;
  lastUpdated?: Date;
  dataSource?: string;
  permissions?: string[];
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  tiles: DashboardTile[];
  gridTemplate?: string;
  breakpoints?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface DashboardTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadows: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  spacing: 'compact' | 'comfortable' | 'spacious';
}

export interface DashboardPreferences {
  theme: string;
  autoRefresh: boolean;
  refreshInterval: number;
  showNotifications: boolean;
  compactMode: boolean;
  showGrid: boolean;
  animations: boolean;
  dataRetention: number; // in days
}

export interface DashboardModule {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: string;
  version: string;
  dependencies?: string[];
  permissions: string[];
  tiles: DashboardTile[];
  isEnabled: boolean;
  settings?: Record<string, any>;
}

export interface DashboardData {
  tiles: DashboardTile[];
  layouts: DashboardLayout[];
  themes: DashboardTheme[];
  preferences: DashboardPreferences;
  modules: DashboardModule[];
  lastSync: Date;
}

export type DashboardViewMode = 'grid' | 'list' | 'compact' | 'detailed';
export type DashboardSize = 'small' | 'medium' | 'large' | 'full-width';
export type RefreshInterval = 0 | 30 | 60 | 300 | 600 | 1800 | 3600 | 7200;
export type ThemeMode = 'light' | 'dark' | 'auto' | 'custom';
