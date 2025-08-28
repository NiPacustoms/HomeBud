import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DashboardService from '@/services/dashboardService';
import {
  DashboardData,
  DashboardTile,
  DashboardLayout,
  DashboardPreferences,
  DashboardTheme,
} from '@/types/dashboard';

export interface UseDashboardReturn {
  loading: boolean;
  error: string | null;
  data: DashboardData | null;
  tiles: DashboardTile[];
  preferences: DashboardPreferences | null;
  layouts: DashboardLayout[];
  themes: DashboardTheme[];
  reload: () => Promise<void>;
  saveTiles: (tiles: DashboardTile[]) => Promise<void>;
  updateTileOrder: (tiles: DashboardTile[]) => Promise<void>;
  saveLayout: (layout: DashboardLayout) => Promise<void>;
  updatePreferences: (prefs: Partial<DashboardPreferences>) => Promise<void>;
  resetToDefault: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<void>;
  toggleModule: (moduleId: string, enabled: boolean) => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
}

export function useDashboard(): UseDashboardReturn {
  const serviceRef = useRef<DashboardService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  useEffect(() => {
    serviceRef.current = DashboardService.getInstance();
    let unsub: (() => void) | null = null;

    const init = async () => {
      try {
        setLoading(true);
        const loaded = await serviceRef.current!.loadDashboardData();
        setData(loaded);
        setCanUndo(serviceRef.current!.canUndo());
        setCanRedo(serviceRef.current!.canRedo());
        unsub = serviceRef.current!.subscribe((d) => {
          setData(d);
          setCanUndo(serviceRef.current!.canUndo());
          setCanRedo(serviceRef.current!.canRedo());
        });
      } catch (e: any) {
        setError(e?.message || 'Unbekannter Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => { if (unsub) unsub(); };
  }, []);

  const reload = useCallback(async () => {
    if (!serviceRef.current) return;
    setLoading(true);
    try {
      const loaded = await serviceRef.current.loadDashboardData();
      setData(loaded);
      setCanUndo(serviceRef.current.canUndo());
      setCanRedo(serviceRef.current.canRedo());
    } catch (e: any) {
      setError(e?.message || 'Unbekannter Fehler beim Neu-Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTiles = useCallback(async (tiles: DashboardTile[]) => {
    if (!serviceRef.current) return;
    await serviceRef.current.saveDashboardData({ tiles });
  }, []);

  const updateTileOrder = useCallback(async (tiles: DashboardTile[]) => {
    if (!serviceRef.current) return;
    await serviceRef.current.updateTileOrder(tiles);
  }, []);

  const saveLayout = useCallback(async (layout: DashboardLayout) => {
    if (!serviceRef.current) return;
    await serviceRef.current.saveLayout(layout);
  }, []);

  const updatePreferences = useCallback(async (prefs: Partial<DashboardPreferences>) => {
    if (!serviceRef.current) return;
    await serviceRef.current.updatePreferences(prefs);
  }, []);

  const resetToDefault = useCallback(async () => {
    if (!serviceRef.current) return;
    await serviceRef.current.resetToDefault();
  }, []);

  const exportData = useCallback(async () => {
    if (!serviceRef.current) return '{}';
    return serviceRef.current.exportData();
  }, []);

  const importData = useCallback(async (json: string) => {
    if (!serviceRef.current) return;
    await serviceRef.current.importData(json);
  }, []);

  const toggleModule = useCallback(async (moduleId: string, enabled: boolean) => {
    if (!serviceRef.current) return;
    await serviceRef.current.toggleModule(moduleId, enabled);
  }, []);

  const undo = useCallback(async () => {
    if (!serviceRef.current) return;
    await serviceRef.current.undo();
  }, []);

  const redo = useCallback(async () => {
    if (!serviceRef.current) return;
    await serviceRef.current.redo();
  }, []);

  const tiles = useMemo(() => data?.tiles ?? [], [data]);
  const preferences = useMemo(() => data?.preferences ?? null, [data]);
  const layouts = useMemo(() => data?.layouts ?? [], [data]);
  const themes = useMemo(() => data?.themes ?? [], [data]);

  return {
    loading,
    error,
    data,
    tiles,
    preferences,
    layouts,
    themes,
    reload,
    saveTiles,
    updateTileOrder,
    saveLayout,
    updatePreferences,
    resetToDefault,
    exportData,
    importData,
    toggleModule,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

export default useDashboard;
