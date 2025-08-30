import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  getFirestore,
} from 'firebase/firestore';
import { AuthService } from './authService';

export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export class FirestoreService {
  // Dynamische Firestore-Instanz
  private static async getFirestoreDB() {
    if (typeof window === 'undefined') {
      throw new Error('Firestore ist nur im Browser verfügbar');
    }
    
    const { app } = await import('@/services/firebase/app');
    return getFirestore(app);
  }

  // Generische CRUD-Operationen
  static async create<T extends Omit<FirestoreDocument, 'id' | 'createdAt' | 'updatedAt'>>(
    collectionName: string,
    data: T
  ): Promise<string> {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) throw new Error('Benutzer nicht angemeldet');

      const db = await this.getFirestoreDB();
      const docData = {
        ...data,
        userId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, collectionName), docData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Fehler beim Erstellen: ${error}`);
    }
  }

  static async get<T extends FirestoreDocument>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    try {
      const db = await this.getFirestoreDB();
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      throw new Error(`Fehler beim Abrufen: ${error}`);
    }
  }

  static async update<T extends Partial<FirestoreDocument>>(
    collectionName: string,
    id: string,
    data: T
  ): Promise<void> {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) throw new Error('Benutzer nicht angemeldet');

      const db = await this.getFirestoreDB();
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      throw new Error(`Fehler beim Aktualisieren: ${error}`);
    }
  }

  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      const db = await this.getFirestoreDB();
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(`Fehler beim Löschen: ${error}`);
    }
  }

  // Benutzer-spezifische Abfragen
  static async getUserDocuments<T extends FirestoreDocument>(
    collectionName: string,
    options?: {
      orderByField?: string;
      orderDirection?: 'asc' | 'desc';
      limitCount?: number;
    }
  ): Promise<T[]> {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) throw new Error('Benutzer nicht angemeldet');

      const db = await this.getFirestoreDB();
      let q = query(
        collection(db, collectionName),
        where('userId', '==', user.uid)
      );

      if (options?.orderByField) {
        q = query(q, orderBy(options.orderByField, options.orderDirection || 'desc'));
      }

      if (options?.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      throw new Error(`Fehler beim Abrufen der Benutzerdaten: ${error}`);
    }
  }

  // Echtzeit-Updates
  static async subscribeToUserDocuments<T extends FirestoreDocument>(
    collectionName: string,
    callback: (documents: T[]) => void,
    options?: {
      orderByField?: string;
      orderDirection?: 'asc' | 'desc';
      limitCount?: number;
    }
  ): Promise<() => void> {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      throw new Error('Benutzer nicht angemeldet');
    }

    const db = await this.getFirestoreDB();
    let q = query(
      collection(db, collectionName),
      where('userId', '==', user.uid)
    );

    if (options?.orderByField) {
      q = query(q, orderBy(options.orderByField, options.orderDirection || 'desc'));
    }

    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    return onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      callback(documents);
    });
  }

  // Spezifische Services für HomeBud-Daten
  static async getPlants(): Promise<any[]> {
    return this.getUserDocuments('plants', { orderByField: 'createdAt' });
  }

  static async getMeasurements(): Promise<any[]> {
    return this.getUserDocuments('measurements', { 
      orderByField: 'createdAt', 
      orderDirection: 'desc',
      limitCount: 100 
    });
  }

  static async getNotes(): Promise<any[]> {
    return this.getUserDocuments('notes', { orderByField: 'createdAt' });
  }

  static async getDashboardData(): Promise<any[]> {
    return this.getUserDocuments('dashboard', { orderByField: 'createdAt' });
  }

  // Batch-Operationen
  static async batchCreate<T extends Omit<FirestoreDocument, 'id' | 'createdAt' | 'updatedAt'>>(
    collectionName: string,
    dataArray: T[]
  ): Promise<string[]> {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) throw new Error('Benutzer nicht angemeldet');

      const db = await this.getFirestoreDB();
      const ids: string[] = [];
      
      for (const data of dataArray) {
        const docData = {
          ...data,
          userId: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, collectionName), docData);
        ids.push(docRef.id);
      }

      return ids;
    } catch (error) {
      throw new Error(`Fehler bei Batch-Erstellung: ${error}`);
    }
  }
}
