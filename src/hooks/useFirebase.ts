import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthClient';
import { FirestoreService, FirestoreDocument } from '@/services/firebase/firestoreService';
import { FirebaseUser } from '@/types/firebase';

export interface UseFirebaseReturn {
  // Auth State
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;

  // Auth Methods
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  // Firestore Methods
  createDocument: <T>(collectionName: string, data: T) => Promise<string>;
  getDocument: <T extends FirestoreDocument>(collectionName: string, id: string) => Promise<T | null>;
  updateDocument: <T>(collectionName: string, id: string, data: T) => Promise<void>;
  deleteDocument: (collectionName: string, id: string) => Promise<void>;
  getUserDocuments: <T extends FirestoreDocument>(collectionName: string, options?: any) => Promise<T[]>;
  subscribeToDocuments: <T extends FirestoreDocument>(
    collectionName: string,
    callback: (documents: T[]) => void,
    options?: any
  ) => Promise<() => void>;

  // Convenience Methods
  getPlants: () => Promise<any[]>;
  getMeasurements: () => Promise<any[]>;
  getNotes: () => Promise<any[]>;
  getDashboardData: () => Promise<any[]>;
}

export const useFirebase = (): UseFirebaseReturn => {
  const { user, loading: authLoading, signIn, signInWithGoogle, signUp, signOut, resetPassword: authResetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Auth Methods
  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login fehlgeschlagen');
      throw err;
    }
  }, [signIn]);

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Login fehlgeschlagen');
      throw err;
    }
  }, [signInWithGoogle]);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      await signUp(email, password, displayName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen');
      throw err;
    }
  }, [signUp]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout fehlgeschlagen');
      throw err;
    }
  }, [signOut]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      await authResetPassword(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Passwort-Reset fehlgeschlagen');
      throw err;
    }
  }, [authResetPassword]);

  // Firestore Methods
  const createDocument = useCallback(async <T>(collectionName: string, data: T): Promise<string> => {
    try {
      setError(null);
      if (!user?.uid) throw new Error('Benutzer nicht angemeldet');
      return await FirestoreService.create(collectionName, data as any, user.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dokument-Erstellung fehlgeschlagen');
      throw err;
    }
  }, [user?.uid]);

  const getDocument = useCallback(async <T extends FirestoreDocument>(collectionName: string, id: string): Promise<T | null> => {
    try {
      setError(null);
      return await FirestoreService.get<T>(collectionName, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dokument-Abruf fehlgeschlagen');
      throw err;
    }
  }, []);

  const updateDocument = useCallback(async <T>(collectionName: string, id: string, data: T): Promise<void> => {
    try {
      setError(null);
      await FirestoreService.update(collectionName, id, data as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dokument-Update fehlgeschlagen');
      throw err;
    }
  }, []);

  const deleteDocument = useCallback(async (collectionName: string, id: string): Promise<void> => {
    try {
      setError(null);
      await FirestoreService.delete(collectionName, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dokument-Löschung fehlgeschlagen');
      throw err;
    }
  }, []);

  const getUserDocuments = useCallback(async <T extends FirestoreDocument>(collectionName: string, options?: any): Promise<T[]> => {
    try {
      setError(null);
      if (!user?.uid) throw new Error('Benutzer nicht angemeldet');
      return await FirestoreService.getUserDocuments<T>(collectionName, user.uid, options);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dokumente-Abruf fehlgeschlagen');
      throw err;
    }
  }, [user?.uid]);

  const subscribeToDocuments = useCallback(async <T extends FirestoreDocument>(
    collectionName: string,
    callback: (documents: T[]) => void,
    options?: any
  ): Promise<(() => void)> => {
    try {
      setError(null);
      if (!user?.uid) throw new Error('Benutzer nicht angemeldet');
      return await FirestoreService.subscribeToUserDocuments(collectionName, user.uid, callback, options);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription fehlgeschlagen');
      throw err;
    }
  }, [user?.uid]);

  // Convenience Methods
  const getPlants = useCallback(async (): Promise<any[]> => {
    return getUserDocuments('plants', { orderByField: 'createdAt' });
  }, [getUserDocuments]);

  const getMeasurements = useCallback(async (): Promise<any[]> => {
    return getUserDocuments('measurements', { 
      orderByField: 'createdAt', 
      orderDirection: 'desc',
      limitCount: 100 
    });
  }, [getUserDocuments]);

  const getNotes = useCallback(async (): Promise<any[]> => {
    return getUserDocuments('notes', { orderByField: 'createdAt' });
  }, [getUserDocuments]);

  const getDashboardData = useCallback(async (): Promise<any[]> => {
    return getUserDocuments('dashboard', { orderByField: 'createdAt' });
  }, [getUserDocuments]);

  return {
    // Auth State
    user,
    loading: authLoading,
    error,

    // Auth Methods
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,

    // Firestore Methods
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    getUserDocuments,
    subscribeToDocuments,

    // Convenience Methods
    getPlants,
    getMeasurements,
    getNotes,
    getDashboardData,
  };
};
