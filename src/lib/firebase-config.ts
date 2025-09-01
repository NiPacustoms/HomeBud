// Zentrale Firebase-Konfiguration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID || '',
};

// Firebase-Konfiguration für verschiedene Umgebungen
export const getFirebaseConfig = (environment: 'client' | 'server' | 'universal' = 'universal') => {
  switch (environment) {
    case 'client':
      return {
        ...firebaseConfig,
        // Client-spezifische Konfiguration
      };
    case 'server':
      return {
        ...firebaseConfig,
        // Server-spezifische Konfiguration
      };
    case 'universal':
    default:
      return firebaseConfig;
  }
};

// Firebase-Konfiguration für Firebase App Hosting
export const getFirebaseAppHostingConfig = () => {
  return {
    ...firebaseConfig,
    // Firebase App Hosting spezifische Konfiguration
  };
};

export default firebaseConfig;
