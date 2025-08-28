import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class AuthService {
  // Email/Password Registrierung
  static async register(email: string, password: string, displayName?: string): Promise<AuthUser> {
    try {
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Google Login
  static async loginWithGoogle(): Promise<AuthUser> {
    try {
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
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Passwort zurücksetzen
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Auth State Listener
  static onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.mapFirebaseUser(user) : null);
    });
  }

  // Aktueller Benutzer
  static getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.mapFirebaseUser(user) : null;
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
