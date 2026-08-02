import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  FlaskConical,
  Newspaper,
  Users,
  ArrowRight,
  Plus,
  MessageSquare,
  Calendar,
  GraduationCap,
  Mail,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import type { DashboardStats } from '../../types';

const STAT_CARDS: {
  key: keyof DashboardStats;
  label: string;
  icon: typeof FolderKanban;
  to: string;
  gradient: string;
}[] = [
  {
    key: 'totalProjects',
    label: 'Projects',
    icon: FolderKanban,
    to: '/admin/projects',
    gradient: 'from-circuit/20 to-circuit/5',
  },
  {
    key: 'totalResearch',
    label: 'Research',
    icon: FlaskConical,
    to: '/admin/research',
    gradient: 'from-signal/20 to-signal/5',
  },
  {
    key: 'totalPosts',
    label: 'Blog Posts',
    icon: Newspaper,
    to: '/admin/posts',
    gradient: 'from-circuit/20 to-circuit/5',
  },
  {
    key: 'totalTeamMembers',
    label: 'Team Members',
    icon: Users,
    to: '/admin/team',
    gradient: 'from-signal/20 to-signal/5',
  },
];

const QUICK_ACTIONS = [
  { to: '/admin/projects', label: 'New project', icon: FolderKanban, action: 'Create' },
  { to: '/admin/posts', label: 'Write a blog post', icon: Newspaper, action: 'Write' },
  { to: '/admin/research', label: 'Add research publication', icon: FlaskConical, action: 'Add' },
  { to: '/admin/learning', label: 'Publish a new course', icon: GraduationCap, action: 'Publish' },
  { to: '/admin/team', label: 'Add team member', icon: Users, action: 'Add' },
  { to: '/admin/community', label: 'Schedule event', icon: Calendar, action: 'Schedule' },
  { to: '/admin/contacts', label: 'Review contact submissions', icon: MessageSquare, action: 'Review' },
  { to: '/admin/newsletter', label: 'Send newsletter', icon: Mail, action: 'Send' },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [now] = useState(new Date());

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, research, posts, team] = await Promise.all([
          listDocs(COLLECTIONS.projects),
          listDocs(COLLECTIONS.research),
          listDocs(COLLECTIONS.posts),
          listDocs(COLLECTIONS.team),
        ]);
        setStats({
          totalVisitors: 0,
          totalCommunityMembers: 0,
          totalProjects: projects.length,
          totalResearch: research.length,
          totalPosts: posts.length,
          totalTeamMembers: team.length,
        });
      } catch {
        setStats({
          totalVisitors: 0,
          totalCommunityMembers: 0,
          totalProjects: 0,
          totalResearch: 0,
          totalPosts: 0,
          totalTeamMembers: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header Greeting */}
      <div className="rounded-xl border border-line bg-card-shine bg-panel p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-60" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">{dateStr}</p>
            <h1 className="font-display text-2xl font-semibold text-ink md:text-3xl">
              {greeting},{' '}
              <span className="text-blue-chrome-animated">
                {admin?.email?.split('@')[0] ?? 'Admin'}
              </span>
            </h1>
            <p className="mt-1 text-sm text-ink-dim">Welcome back to the Lawtronic control panel.</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-circuit/20 bg-circuit/5 px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-circuit">System online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <p className="eyebrow mb-4 flex items-center gap-2">
          <TrendingUp size={12} /> Content overview
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map(({ key, label, icon: Icon, to, gradient }) => (
            <Link
              key={key}
              to={to}
              className={`card-interactive group p-5 bg-gradient-to-br ${gradient}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider font-mono">{label}</p>
                  <p className="mt-2 font-display text-4xl font-bold text-ink">
                    {loading ? (
                      <span className="skeleton inline-block h-9 w-10 rounded" />
                    ) : (
                      stats?.[key] ?? 0
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-panel/50 p-2.5 text-ink-muted transition-all duration-300 group-hover:border-circuit/40 group-hover:text-circuit group-hover:shadow-glow-sm">
                  <Icon size={18} strokeWidth={1.75} />
                </div>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs text-ink-muted transition-colors group-hover:text-circuit">
                Manage <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="eyebrow mb-4 flex items-center gap-2">
          <Activity size={12} /> Quick actions
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon, action }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3 rounded-xl border border-line bg-panel/50 px-4 py-3.5 text-sm transition-all duration-200 hover:border-circuit/40 hover:bg-circuit/5 hover:shadow-glow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-panel2 text-ink-muted transition-all group-hover:bg-circuit/10 group-hover:text-circuit">
                <Icon size={15} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-wider text-circuit opacity-0 group-hover:opacity-100 transition-opacity -mb-0.5">
                  {action}
                </p>
                <p className="text-ink-dim truncate text-xs group-hover:text-ink transition-colors">{label}</p>
              </div>
              <Plus size={13} className="ml-auto shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-circuit" />
            </Link>
          ))}
        </div>
      </div>

      {/* System Info Footer */}
      <div className="rounded-xl border border-line bg-panel2/50 px-5 py-4 flex flex-wrap items-center gap-4 text-[11px] font-mono text-ink-muted">
        <span>PLATFORM: <span className="text-ink">Lawtronic CMS v1.0</span></span>
        <span className="text-line-bright">|</span>
        <span>DB: <span className="text-signal">Firebase Firestore</span></span>
        <span className="text-line-bright">|</span>
        <span>STORAGE: <span className="text-signal">Firebase Storage</span></span>
        <span className="text-line-bright">|</span>
        <span>REGION: <span className="text-ink">us-central1</span></span>
      </div>
    </div>
  );
}
