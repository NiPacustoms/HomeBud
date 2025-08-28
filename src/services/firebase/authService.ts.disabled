// Mock Auth Service für Build-Kompatibilität
// Entfernt alle Firebase-Imports für SSR-Kompatibilität

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class AuthService {
  // Mock Email/Password Registrierung
  static async register(email: string, password: string, displayName?: string): Promise<AuthUser> {
    // Mock implementation für Build
    return {
      uid: 'mock-register-uid',
      email,
      displayName: displayName || 'Mock User',
      photoURL: null
    };
  }

  // Mock Email/Password Login
  static async login(email: string, password: string): Promise<AuthUser> {
    // Mock implementation für Build
    return {
      uid: 'mock-login-uid',
      email,
      displayName: 'Mock User',
      photoURL: null
    };
  }

  // Mock Google Login
  static async loginWithGoogle(): Promise<AuthUser> {
    // Mock implementation für Build
    return {
      uid: 'mock-google-uid',
      email: 'mock@google.com',
      displayName: 'Mock Google User',
      photoURL: null
    };
  }

  // Mock Logout
  static async logout(): Promise<void> {
    // Mock implementation für Build
    return Promise.resolve();
  }

  // Mock Passwort zurücksetzen
  static async resetPassword(email: string): Promise<void> {
    // Mock implementation für Build
    return Promise.resolve();
  }

  // Mock Auth State Listener
  static onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    // Mock implementation für Build - keine Firebase-Abhängigkeit
    return () => {
      // Cleanup function
    };
  }

  // Mock Aktueller Benutzer
  static async getCurrentUser(): Promise<AuthUser | null> {
    // Mock implementation für Build
    return null;
  }
}
