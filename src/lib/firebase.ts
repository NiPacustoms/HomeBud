// Mock Firebase Services für Build-Kompatibilität
// Entfernt alle Firebase-Imports für SSR-Kompatibilität

// Mock Firebase-Konfiguration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Mock Firebase Services
const mockApp = {
  name: 'mock-app',
  options: firebaseConfig
};

const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async () => ({ user: { uid: 'mock' } }),
  createUserWithEmailAndPassword: async () => ({ user: { uid: 'mock' } }),
  signOut: async () => {},
  onAuthStateChanged: () => () => {}
};

const mockDB = {
  app: mockApp,
  collection: () => ({
    doc: () => ({
      get: async () => ({ exists: false, data: () => null }),
      set: async () => {},
      update: async () => {},
      delete: async () => {}
    })
  })
};

const mockStorage = {
  app: mockApp,
  ref: () => ({
    put: async () => ({ ref: { getDownloadURL: async () => 'mock-url' } })
  })
};

const mockAnalytics = null;

// Export-Funktionen für sicheren Zugriff
export const getFirebaseApp = () => {
  return mockApp;
};

export const getFirebaseAuth = () => {
  return mockAuth;
};

export const getFirebaseDB = () => {
  return mockDB;
};

export const getFirebaseStorage = () => {
  return mockStorage;
};

export const getFirebaseAnalytics = () => {
  return mockAnalytics;
};

// Legacy-Exports für Kompatibilität
export const auth = mockAuth;
export const db = mockDB;
export const storage = mockStorage;
export const analytics = mockAnalytics;

export default mockApp;
