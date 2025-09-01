import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase-Konfiguration aus Umgebungsvariablen
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
};

// Firebase-App nur serverseitig initialisieren
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

const initializeFirebaseServer = () => {
  if (typeof window === 'undefined') {
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
  }
  return { app: null, auth: null, db: null, storage: null };
};

// Export-Funktionen für sicheren Zugriff
export const getFirebaseApp = () => {
  const { app } = initializeFirebaseServer();
  return app;
};

export const getFirebaseAuth = () => {
  const { auth } = initializeFirebaseServer();
  return auth;
};

export const getFirebaseDb = () => {
  const { db } = initializeFirebaseServer();
  return db;
};

export const getFirebaseStorage = () => {
  const { storage } = initializeFirebaseServer();
  return storage;
};

export default initializeFirebaseServer;
