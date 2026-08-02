import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDkKrwQJLp8XMEhMOq4v_jr_Ju8-bAOlFU",
  authDomain: "studio-9635462929-d7b8b.firebaseapp.com",
  projectId: "studio-9635462929-d7b8b",
  storageBucket: "studio-9635462929-d7b8b.firebasestorage.app",
  messagingSenderId: "389621491469",
  appId: "1:389621491469:web:7f5d804da306c0b48cf244",
};

/** True when all required Firebase env vars are present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else if (import.meta.env.DEV) {
  console.warn(
    '[Lawtronic] Firebase env vars missing — running in demo mode with mock data. Copy .env.example to .env.local and fill in your Firebase config.'
  );
}

export { app, auth, db, storage };

export const analyticsPromise: Promise<Analytics | null> = isFirebaseConfigured
  ? isSupported().then((ok) => (ok && app ? getAnalytics(app) : null))
  : Promise.resolve(null);
