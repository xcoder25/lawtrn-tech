import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges, fetchAdminProfile, type AdminProfile } from '../firebase/auth';
import { isFirebaseConfigured } from '../firebase/config';

interface AuthContextValue {
  firebaseUser: User | null;
  admin: AdminProfile | null;
  loading: boolean;
  setAdmin: (admin: AdminProfile | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  admin: null,
  loading: true,
  setAdmin: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [admin, setAdminState] = useState<AdminProfile | null>(() => {
    if (!isFirebaseConfigured) {
      const stored = sessionStorage.getItem('lawtronic_mock_admin');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const setAdmin = (newAdmin: AdminProfile | null) => {
    setAdminState(newAdmin);
    if (!isFirebaseConfigured) {
      if (newAdmin) {
        sessionStorage.setItem('lawtronic_mock_admin', JSON.stringify(newAdmin));
      } else {
        sessionStorage.removeItem('lawtronic_mock_admin');
      }
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const profile = await fetchAdminProfile(user).catch(() => null);
        setAdminState(profile);
      } else {
        setAdminState(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, admin, loading, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
