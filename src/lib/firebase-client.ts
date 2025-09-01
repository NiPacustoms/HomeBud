import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase-Konfiguration aus Umgebungsvariablen
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Firebase-App nur client-seitig initialisieren
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

const initializeFirebaseClient = () => {
  if (typeof window !== 'undefined') {
    if (!app) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      
      // Emulator-Verbindung für Entwicklung
      if (process.env.NODE_ENV === 'development') {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099');
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectStorageEmulator(storage, 'localhost', 9199);
        } catch (error) {
          console.log('Emulator bereits verbunden oder nicht verfügbar');
        }
      }
    }
    return { app, auth, db, storage };
  }
  return { app: null, auth: null, db: null, storage: null };
};

// Export-Funktionen für sicheren Zugriff
export const getFirebaseApp = () => {
  const { app } = initializeFirebaseClient();
  return app;
};

export const getFirebaseAuth = () => {
  const { auth } = initializeFirebaseClient();
  return auth;
};

export const getFirebaseDb = () => {
  const { db } = initializeFirebaseClient();
  return db;
};

export const getFirebaseStorage = () => {
  const { storage } = initializeFirebaseClient();
  return storage;
};

export default initializeFirebaseClient;
