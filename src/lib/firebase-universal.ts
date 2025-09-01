import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase-Konfiguration aus Umgebungsvariablen
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID || '',
};

// Firebase-App universell initialisieren
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

const initializeFirebaseUniversal = () => {
  if (!app) {
    // Prüfe, ob bereits eine App existiert
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = apps[0];
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
  return { app, auth, db, storage };
};

// Export-Funktionen für sicheren Zugriff
export const getFirebaseApp = () => {
  const { app } = initializeFirebaseUniversal();
  return app;
};

export const getFirebaseAuth = () => {
  const { auth } = initializeFirebaseUniversal();
  return auth;
};

export const getFirebaseDb = () => {
  const { db } = initializeFirebaseUniversal();
  return db;
};

export const getFirebaseStorage = () => {
  const { storage } = initializeFirebaseUniversal();
  return storage;
};

export default initializeFirebaseUniversal;
