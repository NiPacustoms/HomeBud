import { initializeApp } from "firebase/app";

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

// Firebase-App nur serverseitig initialisieren
let app: any = null;

const initializeFirebase = () => {
  if (typeof window === 'undefined') {
    if (!app) {
      app = initializeApp(firebaseConfig);
    }
    return { app };
  }
  return { app: null };
};

// Export-Funktionen für sicheren Zugriff
export const getFirebaseApp = () => {
  const { app } = initializeFirebase();
  return app;
};

// Legacy-Export für Kompatibilität (nur serverseitig)
export const firebaseApp = typeof window === 'undefined' ? getFirebaseApp() : null;

export default typeof window !== 'undefined' ? null : getFirebaseApp();
