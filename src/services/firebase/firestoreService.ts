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
    data: T,
    userId: string
  ): Promise<string> {
    try {
      if (!userId) throw new Error('Benutzer-ID erforderlich');

      const db = await this.getFirestoreDB();
      const docData = {
        ...data,
        userId,
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
    userId: string,
    options?: {
      orderByField?: string;
      orderDirection?: 'asc' | 'desc';
      limitCount?: number;
    }
  ): Promise<T[]> {
    try {
      if (!userId) throw new Error('Benutzer-ID erforderlich');

      const db = await this.getFirestoreDB();
      let q = query(
        collection(db, collectionName),
        where('userId', '==', userId)
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
    userId: string,
    callback: (documents: T[]) => void,
    options?: {
      orderByField?: string;
      orderDirection?: 'asc' | 'desc';
      limitCount?: number;
    }
  ): Promise<() => void> {
    if (!userId) {
      throw new Error('Benutzer-ID erforderlich');
    }

    const db = await this.getFirestoreDB();
    let q = query(
      collection(db, collectionName),
      where('userId', '==', userId)
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
  static async getPlants(userId: string): Promise<any[]> {
    return this.getUserDocuments('plants', userId, { orderByField: 'createdAt' });
  }

  static async getMeasurements(userId: string): Promise<any[]> {
    return this.getUserDocuments('measurements', userId, { 
      orderByField: 'createdAt', 
      orderDirection: 'desc',
      limitCount: 100 
    });
  }

  static async getNotes(userId: string): Promise<any[]> {
    return this.getUserDocuments('notes', userId, { orderByField: 'createdAt' });
  }

  static async getDashboardData(userId: string): Promise<any[]> {
    return this.getUserDocuments('dashboard', userId, { orderByField: 'createdAt' });
  }

  // Batch-Operationen
  static async batchCreate<T extends Omit<FirestoreDocument, 'id' | 'createdAt' | 'updatedAt'>>(
    collectionName: string,
    dataArray: T[],
    userId: string
  ): Promise<string[]> {
    try {
      if (!userId) throw new Error('Benutzer-ID erforderlich');

      const db = await this.getFirestoreDB();
      const ids: string[] = [];
      
      for (const data of dataArray) {
        const docData = {
          ...data,
          userId,
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
