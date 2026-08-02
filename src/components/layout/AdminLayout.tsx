import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FlaskConical,
  Newspaper,
  GraduationCap,
  Users,
  CalendarDays,
  Mail,
  BarChart3,
  LogOut,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react';
import { logoutAdmin } from '../../firebase/auth';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/research', label: 'Research', icon: FlaskConical },
  { to: '/admin/posts', label: 'Blog & News', icon: Newspaper },
  { to: '/admin/learning', label: 'Learning Hub', icon: GraduationCap },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/community', label: 'Community', icon: CalendarDays },
  { to: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { admin, setAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutAdmin();
    setAdmin(null);
    navigate('/');
  }

  return (
    <>
      <div className="border-b border-line px-5 py-5">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpg" alt="" className="h-8 w-8 rounded-full object-cover shadow-glow-sm" />
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              LAW<span className="text-circuit">TRONIC</span>
            </p>
            <p className="text-xs text-ink-muted">Admin dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-circuit/10 text-circuit shadow-glow-sm'
                  : 'text-ink-dim hover:bg-panel2 hover:text-ink'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line px-4 py-4">
        <p className="truncate text-xs text-ink-dim">{admin?.email}</p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-circuit">
          {admin?.role?.replace('_', ' ')}
        </p>
        <button
          onClick={handleLogout}
          className="mt-3 flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-alert"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-void">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-panel md:flex">
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-line bg-panel animate-fade-in">
            <button
              className="absolute right-3 top-4 rounded-md p-1.5 text-ink-dim hover:text-ink"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-ink hover:bg-panel2"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <p className="font-display text-sm font-semibold text-ink">
            LAW<span className="text-circuit">TRONIC</span>
            <span className="ml-2 text-xs font-normal text-ink-muted">Admin</span>
          </p>
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
