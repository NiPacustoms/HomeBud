import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase-Konfiguration aus Umgebungsvariablen
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase-App nur im Browser initialisieren
let firebaseApp: any = null;
let firebaseAuth: any = null;
let firebaseDB: any = null;
let firebaseStorage: any = null;
let firebaseAnalytics: any = null;

// Lazy initialization für SSR-Kompatibilität
const initializeFirebase = () => {
  if (typeof window === 'undefined') {
    return { app: null, auth: null, db: null, storage: null, analytics: null };
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    firebaseDB = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    
    // Analytics nur im Browser und wenn unterstützt initialisieren
    firebaseAnalytics = isSupported().then(yes => yes ? getAnalytics(firebaseApp) : null);

    // Development-Emulatoren (nur in Entwicklung)
    if (process.env.NODE_ENV === 'development') {
      connectAuthEmulator(firebaseAuth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(firebaseDB, 'localhost', 8080);
      connectStorageEmulator(firebaseStorage, 'localhost', 9199);
    }
  }

  return { 
    app: firebaseApp, 
    auth: firebaseAuth, 
    db: firebaseDB, 
    storage: firebaseStorage, 
    analytics: firebaseAnalytics 
  };
};

// Export-Funktionen für sicheren Zugriff
export const getFirebaseApp = () => {
  const { app } = initializeFirebase();
  return app;
};

export const getFirebaseAuth = () => {
  const { auth } = initializeFirebase();
  return auth;
};

export const getFirebaseDB = () => {
  const { db } = initializeFirebase();
  return db;
};

export const getFirebaseStorage = () => {
  const { storage } = initializeFirebase();
  return storage;
};

export const getFirebaseAnalytics = () => {
  const { analytics } = initializeFirebase();
  return analytics;
};

// Legacy-Exports für Kompatibilität (nur im Browser)
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null;
export const db = typeof window !== 'undefined' ? getFirebaseDB() : null;
export const storage = typeof window !== 'undefined' ? getFirebaseStorage() : null;
export const analytics = typeof window !== 'undefined' ? getFirebaseAnalytics() : null;

export default typeof window !== 'undefined' ? getFirebaseApp() : null;
