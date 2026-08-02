import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { loginAdmin } from '../../firebase/auth';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setAdmin } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const profile = await loginAdmin(email, password);
      setAdmin(profile);
      onClose();
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Administrator sign in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm rounded-xl border border-line bg-panel p-8 shadow-elevated animate-fade-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-ink-dim transition-colors hover:bg-panel2 hover:text-ink"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt=""
            className="h-11 w-11 rounded-full object-cover shadow-glow-sm"
          />
          <div>
            <p className="eyebrow">Restricted access</p>
            <h2 className="font-display text-lg font-semibold text-ink">Administrator sign in</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium text-ink-dim">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-ink-dim">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-alert/30 bg-alert/5 px-3 py-2 text-sm text-alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-sm">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-muted">
          Access is limited to approved Lawtronic administrators.
        </p>
      </div>
    </div>
  );
}
