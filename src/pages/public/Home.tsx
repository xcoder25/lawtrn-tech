import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Bot, CircuitBoard, GraduationCap, FlaskConical, Zap, ChevronRight } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { mockProjects, mockPosts } from '../../data/mockData';
import type { Project, Post } from '../../types';

const FOCUS_AREAS = [
  { label: 'Robotics', detail: 'Field-deployable autonomous systems', icon: Bot },
  { label: 'Artificial Intelligence', detail: 'Applied models for real constraints', icon: Cpu },
  { label: 'Electronics', detail: 'Custom boards, sensors, and firmware', icon: CircuitBoard },
  { label: 'Automation', detail: 'Industrial and infrastructure systems', icon: Zap },
  { label: 'STEM Education', detail: 'Curriculum and kits for classrooms', icon: GraduationCap },
  { label: 'Research & Development', detail: 'Published, peer-referenced work', icon: FlaskConical },
];

const IMPACT_STATS = [
  { value: '12+', label: 'Active Projects' },
  { value: '30+', label: 'Learners Trained' },
  { value: '8', label: 'Research Papers' },
  { value: '5', label: 'Partner Institutions' },
];

/** Animated circuit emblem */
function HeroCircuit() {
  return (
    <div className="relative h-[340px] w-[340px] md:h-[420px] md:w-[420px] pointer-events-none select-none">
      <div className="absolute inset-0 rounded-full bg-logo-glow blur-2xl opacity-50" />
      <svg className="relative h-full w-full animate-float" viewBox="0 0 420 420" fill="none" aria-hidden>
        <circle cx="210" cy="210" r="150" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray="942" className="animate-draw-ring" opacity="0.7" />
        <path d="M80 210 A130 130 0 0 1 210 80" stroke="#1A9FFF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="400" className="animate-trace" opacity="0.9" />
        <path d="M340 210 A130 130 0 0 1 210 340" stroke="#C5CDD8" strokeWidth="2" strokeLinecap="round" strokeDasharray="400" className="animate-trace" style={{ animationDelay: '0.35s' }} opacity="0.5" />
        <path d="M30 180 L90 180 L110 160 L150 160" stroke="#1A9FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" className="animate-trace" style={{ animationDelay: '0.15s' }} />
        <path d="M30 210 L100 210 L120 230 L160 230" stroke="#4DB8FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" className="animate-trace" style={{ animationDelay: '0.3s' }} />
        <path d="M30 240 L85 240 L105 260 L145 260" stroke="#1A9FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="180" className="animate-trace" style={{ animationDelay: '0.45s' }} opacity="0.7" />
        {[[30,180],[90,180],[150,160],[30,210],[100,210],[160,230],[30,240],[145,260]].map(([cx,cy],i) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#1A9FFF" className="animate-glow" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
        <text x="210" y="225" textAnchor="middle" fill="url(#ltGrad)" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="72" opacity="0.9">LT</text>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A9FFF" /><stop offset="50%" stopColor="#4DB8FF" /><stop offset="100%" stopColor="#C5CDD8" />
          </linearGradient>
          <linearGradient id="ltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A9FFF" /><stop offset="55%" stopColor="#4DB8FF" /><stop offset="100%" stopColor="#C5CDD8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  useEffect(() => {
    listDocs<Project>(COLLECTIONS.projects)
      .then((docs) => docs.length && setProjects(docs))
      .catch(() => {});
    listDocs<Post>(COLLECTIONS.posts)
      .then((docs) => docs.length && setPosts(docs.filter((p) => p.published)))
      .catch(() => {});
  }, []);

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="grid-bg relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-28 md:py-36 md:px-6">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <p
                className="eyebrow mb-4 opacity-0 animate-fade-up sm:mb-5"
                style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
              >
                Lawtronic Technologies Ltd — Port Harcourt, Nigeria
              </p>
              <h1
                className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-ink opacity-0 animate-fade-up sm:text-4xl md:text-5xl lg:text-[3.4rem]"
                style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
              >
                We engineer robotics, AI &amp; automation systems{' '}
                <span className="text-blue-chrome-animated">Africa builds on next.</span>
              </h1>
              <p
                className="mt-5 text-base leading-relaxed text-ink-dim opacity-0 animate-fade-up sm:text-lg md:max-w-xl mx-auto lg:mx-0"
                style={{ animationDelay: '220ms', animationFillMode: 'forwards' }}
              >
                We research real-world problems and ship working hardware and software — while
                training the innovators who&apos;ll take it further.
              </p>
              <div
                className="mt-8 flex flex-wrap justify-center gap-3 opacity-0 animate-fade-up lg:justify-start"
                style={{ animationDelay: '340ms', animationFillMode: 'forwards' }}
              >
                <Link to="/projects" className="btn-primary">
                  See our projects <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-ghost">
                  Propose a collaboration
                </Link>
              </div>
            </div>

            {/* Circuit visual */}
            <div className="flex shrink-0 items-center justify-center opacity-0 animate-fade-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <HeroCircuit />
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ─────────────────────────────────────────── */}
      <section className="border-b border-line bg-panel/50">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-14">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 stagger">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-bold text-circuit sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-ink-dim sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow mb-3">Our mission</p>
            <h2 className="font-display text-2xl font-semibold leading-snug text-ink md:text-3xl">
              Research real problems. Ship real solutions. Train the next builders.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-ink-dim md:pt-8">
            We work across robotics, artificial intelligence, software, electronics, and automation
            — researching real-world problems across Africa and beyond, developing innovative
            solutions, and empowering the next generation of innovators through hands-on STEM
            education.
          </p>
        </div>
      </section>

      <div className="circuit-divider" />

      {/* ── FOCUS AREAS ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
        <SectionHeader
          eyebrow="Technology focus"
          title="Where we build"
          description="Six connected disciplines, one systems approach."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 stagger">
          {FOCUS_AREAS.map((area) => {
            const Icon = area.icon;
            return (
              <div key={area.label} className="card-interactive group p-5 sm:p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-circuit/10 text-circuit transition-all duration-300 group-hover:bg-circuit/20 group-hover:shadow-glow-sm">
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-base font-semibold text-ink sm:text-lg">{area.label}</h3>
                <p className="mt-1.5 text-sm text-ink-dim">{area.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="circuit-divider" />

      {/* ── FEATURED PROJECTS ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Featured work</p>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Projects in motion</h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm text-circuit transition-colors hover:text-circuit-bright"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 stagger">
          {featured.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="card-interactive group flex flex-col overflow-hidden p-0"
            >
              {project.coverImage ? (
                <div className="aspect-[16/10] overflow-hidden relative border-b border-line">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
                  <div className="scan-line hidden group-hover:block" />
                </div>
              ) : (
                <div className="aspect-[16/10] flex items-center justify-center border-b border-line bg-panel2">
                  <span className="font-display text-2xl font-bold text-circuit/30">LT</span>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-circuit">
                    {project.category}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="font-display text-base font-semibold text-ink transition-colors group-hover:text-circuit-bright sm:text-lg">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-dim line-clamp-2">{project.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-circuit group-hover:text-circuit-bright transition-colors">
                  View project <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="circuit-divider" />

      {/* ── BLOG + COMMUNITY ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow mb-5">Latest from the blog</p>
            <div className="space-y-0">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group block border-b border-line px-1 py-4 transition-colors last:border-none hover:bg-panel/40 rounded-lg"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-circuit mb-1">{post.type}</p>
                  <h3 className="font-display text-sm font-semibold text-ink transition-colors group-hover:text-circuit sm:text-base">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-ink-dim line-clamp-2 sm:text-sm">{post.excerpt}</p>
                </Link>
              ))}
              <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm text-circuit hover:text-circuit-bright transition-colors">
                All posts <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-5">Community</p>
            <div className="card relative overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-circuit/10 blur-3xl" />
              <p className="relative text-sm leading-relaxed text-ink-dim sm:text-base">
                Join workshops, volunteer as a mentor, or collaborate on an active project — our
                community page tracks every open way to get involved.
              </p>
              <Link to="/community" className="btn-ghost relative mt-5 text-sm inline-flex">
                Explore the community <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line bg-panel">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 text-center md:px-6 md:py-24">
          <img
            src="/logo.jpg"
            alt=""
            className="mx-auto mb-6 h-14 w-14 rounded-full object-cover shadow-glow animate-float sm:h-16 sm:w-16"
          />
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl text-balance">
            Have a problem worth engineering a solution for?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted sm:text-[11px]">
            Innovate · Automate · Elevate
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/contact" className="btn-primary w-full sm:w-auto">
              Start a conversation
            </Link>
            <Link to="/learning" className="btn-ghost w-full sm:w-auto">
              Explore the Learning Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
