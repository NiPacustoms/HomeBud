// Dynamische Imports für Server-Side Rendering Kompatibilität
let firebaseAuth: any = null;
let authInstance: any = null;

// Lazy loading für Client-seitige Firebase Auth
const getFirebaseAuth = async () => {
  if (!firebaseAuth) {
    const { 
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      GoogleAuthProvider,
      signInWithPopup,
      sendPasswordResetEmail,
      updateProfile,
    } = await import('firebase/auth');
    firebaseAuth = {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      GoogleAuthProvider,
      signInWithPopup,
      sendPasswordResetEmail,
      updateProfile,
    };
  }
  return firebaseAuth;
};

const getAuthInstance = async () => {
  if (!authInstance) {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    authInstance = getFirebaseAuth();
  }
  return authInstance;
};

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Type für Firebase User
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class AuthService {
  // Email/Password Registrierung
  static async register(email: string, password: string, displayName?: string): Promise<AuthUser> {
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await getFirebaseAuth();
      const auth = await getAuthInstance();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Profil aktualisieren falls DisplayName angegeben
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      return this.mapFirebaseUser(user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Email/Password Login
  static async login(email: string, password: string): Promise<AuthUser> {
    try {
      const { signInWithEmailAndPassword } = await getFirebaseAuth();
      const auth = await getAuthInstance();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Google Login
  static async loginWithGoogle(): Promise<AuthUser> {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await getFirebaseAuth();
      const auth = await getAuthInstance();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      const { signOut } = await getFirebaseAuth();
      const auth = await getAuthInstance();
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Passwort zurücksetzen
  static async resetPassword(email: string): Promise<void> {
    try {
      const { sendPasswordResetEmail } = await getFirebaseAuth();
      const auth = await getAuthInstance();
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Auth State Listener
  static onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    // Nur im Browser ausführen
    if (typeof window === 'undefined') {
      return () => {};
    }
    
    getFirebaseAuth().then(({ onAuthStateChanged }) => {
      getAuthInstance().then((auth) => {
        onAuthStateChanged(auth, (user) => {
          callback(user ? this.mapFirebaseUser(user) : null);
        });
      });
    });
    
    return () => {
      // Cleanup function
    };
  }

  // Aktueller Benutzer
  static async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const auth = await getAuthInstance();
      const user = auth.currentUser;
      return user ? this.mapFirebaseUser(user) : null;
    } catch (error) {
      return null;
    }
  }

  // Firebase User zu AuthUser mappen
  private static mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }

  // Auth-Fehler behandeln
  private static handleAuthError(error: any): Error {
    let message = 'Ein unbekannter Fehler ist aufgetreten';
    
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Benutzer nicht gefunden';
          break;
        case 'auth/wrong-password':
          message = 'Falsches Passwort';
          break;
        case 'auth/email-already-in-use':
          message = 'E-Mail-Adresse wird bereits verwendet';
          break;
        case 'auth/weak-password':
          message = 'Passwort ist zu schwach';
          break;
        case 'auth/invalid-email':
          message = 'Ungültige E-Mail-Adresse';
          break;
        case 'auth/too-many-requests':
          message = 'Zu viele Anfragen. Bitte versuchen Sie es später erneut';
          break;
        case 'auth/popup-closed-by-user':
          message = 'Anmeldung abgebrochen';
          break;
        default:
          message = error.message || message;
      }
    }

    return new Error(message);
  }
}
