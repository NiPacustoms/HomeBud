// Firebase-Amounts für undici-Kompatibilität
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./firebase-config";

// Firebase-App-Instanzen
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

// Firebase-App initialisieren
const initializeFirebase = () => {
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

// Firebase-App für Client-Seite initialisieren
const initializeFirebaseClient = () => {
  if (typeof window !== 'undefined') {
    return initializeFirebase();
  }
  return { app: null, auth: null, db: null, storage: null };
};

// Firebase-App für Server-Seite initialisieren
const initializeFirebaseServer = () => {
  if (typeof window === 'undefined') {
    return initializeFirebase();
  }
  return { app: null, auth: null, db: null, storage: null };
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

export const getFirebaseDb = () => {
  const { db } = initializeFirebase();
  return db;
};

export const getFirebaseStorage = () => {
  const { storage } = initializeFirebase();
  return storage;
};

// Client-seitige Funktionen
export const getFirebaseAppClient = () => {
  const { app } = initializeFirebaseClient();
  return app;
};

export const getFirebaseAuthClient = () => {
  const { auth } = initializeFirebaseClient();
  return auth;
};

export const getFirebaseDbClient = () => {
  const { db } = initializeFirebaseClient();
  return db;
};

export const getFirebaseStorageClient = () => {
  const { storage } = initializeFirebaseClient();
  return storage;
};

// Server-seitige Funktionen
export const getFirebaseAppServer = () => {
  const { app } = initializeFirebaseServer();
  return app;
};

export const getFirebaseAuthServer = () => {
  const { auth } = initializeFirebaseServer();
  return auth;
};

export const getFirebaseDbServer = () => {
  const { db } = initializeFirebaseServer();
  return db;
};

export const getFirebaseStorageServer = () => {
  const { storage } = initializeFirebaseServer();
  return storage;
};

export default initializeFirebase;
