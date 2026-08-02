import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-void">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-circuit border-t-transparent" />
        <p className="text-sm text-ink-dim">Verifying access…</p>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
