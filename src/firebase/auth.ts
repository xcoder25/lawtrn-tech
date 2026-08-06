import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';

export interface AdminProfile {
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor' | 'moderator';
  department?: string;
  approved: boolean;
}

export async function loginAdmin(email: string, password: string): Promise<AdminProfile> {
  const isDemoCredentials = email === 'admin@lawtronic.tech' && (password === 'admin' || password === 'LawtronicAdmin2026!');
  
  if (!isFirebaseConfigured || !auth || !db) {
    if (isDemoCredentials) {
      return {
        uid: 'mock-admin-uid',
        email: 'admin@lawtronic.tech',
        name: 'Demo Admin',
        role: 'super_admin',
        approved: true,
      };
    }
    throw new Error('Demo Mode: Please sign in with email admin@lawtronic.tech and password LawtronicAdmin2026!');
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await fetchAdminProfile(credential.user);
    if (!profile) {
      await firebaseSignOut(auth);
      throw new Error('This account is not registered as a Lawtronic administrator.');
    }
    if (!profile.approved) {
      await firebaseSignOut(auth);
      throw new Error('Your administrator account is pending approval.');
    }
    return profile;
  } catch (error: any) {
    // If Firebase Auth configuration is missing on the remote server, fallback to demo mode
    if (error && (error.code === 'auth/configuration-not-found' || error.message?.includes('configuration-not-found'))) {
      if (isDemoCredentials) {
        console.warn('Firebase Auth is not configured on the remote server. Falling back to Demo Admin mode.');
        return {
          uid: 'mock-admin-uid',
          email: 'admin@lawtronic.tech',
          name: 'Demo Admin (Fallback)',
          role: 'super_admin',
          approved: true,
        };
      }
    }
    throw error;
  }
}

export async function fetchAdminProfile(user: User): Promise<AdminProfile | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'admins', user.uid));
  if (!snap.exists()) return null;
  return { uid: user.uid, ...(snap.data() as Omit<AdminProfile, 'uid'>) };
}

export function logoutAdmin() {
  if (!auth) return Promise.resolve();
  return firebaseSignOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
