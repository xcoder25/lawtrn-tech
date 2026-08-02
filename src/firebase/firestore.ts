import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './config';
import { mockProjects, mockResearch, mockPosts, mockTeam, mockEvents, mockCourses } from '../data/mockData';

export const COLLECTIONS = {
  users: 'users',
  admins: 'admins',
  projects: 'projects',
  research: 'research',
  posts: 'posts',
  courses: 'courses',
  events: 'events',
  team: 'team',
  subscribers: 'subscribers',
  announcements: 'announcements',
  contacts: 'contacts',
} as const;

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Add credentials to .env.local.');
  }
  return db;
}

export async function listDocs<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> {
  if (!isFirebaseConfigured || !db) {
    const storageKey = `lawtronic_mock_db_${collectionName}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    let initialData: any[] = [];
    if (collectionName === COLLECTIONS.projects) initialData = mockProjects;
    else if (collectionName === COLLECTIONS.research) initialData = mockResearch;
    else if (collectionName === COLLECTIONS.posts) initialData = mockPosts;
    else if (collectionName === COLLECTIONS.team) initialData = mockTeam;
    else if (collectionName === COLLECTIONS.events) initialData = mockEvents;
    else if (collectionName === COLLECTIONS.courses) initialData = mockCourses;
    
    localStorage.setItem(storageKey, JSON.stringify(initialData));
    return initialData as any;
  }
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function getDocById<T>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  if (!isFirebaseConfigured || !db) {
    const list = await listDocs<any>(collectionName);
    const item = list.find((d: any) => d.id === id);
    return item || null;
  }
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as T) };
}

export async function createDoc<T extends object>(collectionName: string, data: T) {
  if (!isFirebaseConfigured || !db) {
    const storageKey = `lawtronic_mock_db_${collectionName}`;
    const list = await listDocs<any>(collectionName);
    const newDoc = {
      id: `mock-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    list.push(newDoc);
    localStorage.setItem(storageKey, JSON.stringify(list));
    return { id: newDoc.id } as any;
  }
  const database = requireDb();
  return addDoc(collection(database, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocById<T extends object>(
  collectionName: string,
  id: string,
  data: Partial<T>
) {
  if (!isFirebaseConfigured || !db) {
    const storageKey = `lawtronic_mock_db_${collectionName}`;
    const list = await listDocs<any>(collectionName);
    const index = list.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...data,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      localStorage.setItem(storageKey, JSON.stringify(list));
    }
    return;
  }
  const database = requireDb();
  return updateDoc(doc(database, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocById(collectionName: string, id: string) {
  if (!isFirebaseConfigured || !db) {
    const storageKey = `lawtronic_mock_db_${collectionName}`;
    const list = await listDocs<any>(collectionName);
    const filtered = list.filter((item: any) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
    return;
  }
  const database = requireDb();
  return deleteDoc(doc(database, collectionName, id));
}

export async function uploadFile(_path: string, file: File): Promise<string> {
  if (!isFirebaseConfigured || !storage) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  const fileRef = ref(storage, _path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export { where, orderBy, fbLimit as limit };
