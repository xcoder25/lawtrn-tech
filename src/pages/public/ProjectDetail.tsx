import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { mockProjects, mockTeam } from '../../data/mockData';
import type { Project, TeamMember } from '../../types';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(
    mockProjects.find((p) => p.slug === slug) ?? null
  );
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);

  useEffect(() => {
    listDocs<Project>(COLLECTIONS.projects)
      .then((docs) => {
        const found = docs.find((p) => p.slug === slug);
        if (found) setProject(found);
        else if (!mockProjects.find((p) => p.slug === slug)) setProject(null);
      })
      .catch(() => {});
    listDocs<TeamMember>(COLLECTIONS.team)
      .then((docs) => docs.length && setTeam(docs))
      .catch(() => {});
  }, [slug]);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-2xl text-ink">Project not found</h1>
        <p className="mt-2 text-ink-dim">It may have been moved or unpublished.</p>
        <Link to="/projects" className="btn-ghost mt-6 inline-flex text-sm">
          Back to projects
        </Link>
      </div>
    );
  }

  const members = team.filter((t) => project.teamIds?.includes(t.id));

  return (
    <div className="mx-auto max-w-4xl px-5 py-20 md:px-6 md:py-24">
      <Link
        to="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-circuit"
      >
        <ArrowLeft size={14} /> All projects
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-circuit font-semibold">
          {project.category}
        </span>
        <StatusBadge status={project.status} />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-dim">{project.summary}</p>

      {project.coverImage && (
        <div className="relative mt-8 overflow-hidden rounded-xl border border-line shadow-elevated aspect-[21/9]">
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
          <div className="scan-line" />
        </div>
      )}

      <div className="circuit-divider my-12" />

      <div className="grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="eyebrow mb-5">Milestones</p>
          <ul className="space-y-3">
            {(project.milestones ?? []).map((m) => (
              <li key={m.id} className="flex items-center gap-3 text-sm">
                {m.done ? (
                  <CheckCircle2 size={16} className="shrink-0 text-signal" />
                ) : (
                  <Circle size={16} className="shrink-0 text-ink-muted" />
                )}
                <span className={m.done ? 'text-ink' : 'text-ink-dim'}>{m.label}</span>
              </li>
            ))}
            {(!project.milestones || project.milestones.length === 0) && (
              <li className="text-sm text-ink-dim">Milestones will appear as work progresses.</li>
            )}
          </ul>
          {project.description && (
            <div className="mt-10">
              <p className="eyebrow mb-4">Details</p>
              <div
                className="prose prose-invert max-w-none text-sm leading-relaxed text-ink-dim"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow mb-5">Team on this project</p>
          <div className="space-y-4">
            {members.map((member) => (
              <Link key={member.id} to="/team" className="block text-sm">
                <p className="font-medium text-ink transition-colors hover:text-circuit">
                  {member.name}
                </p>
                <p className="text-ink-dim">{member.role}</p>
              </Link>
            ))}
            {members.length === 0 && <p className="text-sm text-ink-dim">To be announced.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
