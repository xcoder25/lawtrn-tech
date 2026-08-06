import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { mockProjects } from '../../data/mockData';
import type { Project, ProjectStatus } from '../../types';

const STATUSES: ProjectStatus[] = [
  'Idea',
  'Research',
  'Prototype',
  'Development',
  'Testing',
  'Completed',
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | 'All'>('All');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    listDocs<Project>(COLLECTIONS.projects)
      .then((docs) => docs.length && setProjects(docs))
      .catch(() => { });
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'All' || p.status === status;
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
      <div className="mb-12">
        <p className="eyebrow mb-3">Project index</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          <span className="text-blue-chrome-animated"> Everything we&apos;re building</span>
        </h1>
        <p className="mt-3 max-w-xl text-ink-dim">
          From early research to completed deployments — tracked openly, at every stage.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="input-field pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-ink-dim outline-none focus:border-circuit/70"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus | 'All')}
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-ink-dim outline-none focus:border-circuit/70"
          >
            <option value="All">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-ink-dim">No projects match those filters yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="card-interactive group flex flex-col overflow-hidden p-0"
            >
              {project.coverImage && (
                <div className="aspect-[16/10] overflow-hidden relative border-b border-line">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
                  <div className="scan-line hidden group-hover:block" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-circuit">
                    {project.category}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-circuit-bright">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-dim line-clamp-3">{project.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
