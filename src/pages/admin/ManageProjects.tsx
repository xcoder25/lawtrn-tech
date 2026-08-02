import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, Circle, ImageIcon, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import {
  COLLECTIONS,
  listDocs,
  createDoc,
  updateDocById,
  deleteDocById,
} from '../../firebase/firestore';
import type { Project, ProjectStatus, TeamMember } from '../../types';
import { mockProjects, mockTeam } from '../../data/mockData';

const STATUSES: ProjectStatus[] = [
  'Idea',
  'Research',
  'Prototype',
  'Development',
  'Testing',
  'Completed',
];

const COVER_IMAGE_OPTIONS = [
  { label: 'Agri-Sense Field Robot', value: '/assets/projects/agri-sense.jpg' },
  { label: 'Lawtronic Vision Kit', value: '/assets/projects/vision-kit.jpg' },
  { label: 'Grid-Watch Node', value: '/assets/projects/grid-watch.jpg' },
  { label: 'Custom URL / None', value: '' },
];

type MilestoneForm = { id: string; label: string; done: boolean };

const emptyForm = {
  title: '',
  summary: '',
  description: '',
  category: '',
  status: 'Idea' as ProjectStatus,
  featured: false,
  coverImage: '',
  teamIds: [] as string[],
  milestones: [] as MilestoneForm[],
};

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTeam, setAllTeam] = useState<TeamMember[]>(mockTeam);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [docs, team] = await Promise.all([
        listDocs<Project>(COLLECTIONS.projects),
        listDocs<TeamMember>(COLLECTIONS.team),
      ]);
      setProjects(docs.length ? docs : (mockProjects as Project[]));
      if (team.length) setAllTeam(team);
    } catch {
      setProjects(mockProjects as Project[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setNewMilestone('');
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setForm({
      title: project.title,
      summary: project.summary,
      description: project.description ?? '',
      category: project.category,
      status: project.status,
      featured: project.featured,
      coverImage: project.coverImage ?? '',
      teamIds: project.teamIds ?? [],
      milestones: (project.milestones ?? []).map((m) => ({
        id: m.id,
        label: m.label,
        done: m.done,
      })),
    });
    setNewMilestone('');
    setModalOpen(true);
  }

  function addMilestone() {
    const label = newMilestone.trim();
    if (!label) return;
    setForm((f) => ({
      ...f,
      milestones: [
        ...f.milestones,
        { id: `m${Date.now()}`, label, done: false },
      ],
    }));
    setNewMilestone('');
  }

  function removeMilestone(id: string) {
    setForm((f) => ({
      ...f,
      milestones: f.milestones.filter((m) => m.id !== id),
    }));
  }

  function toggleMilestone(id: string) {
    setForm((f) => ({
      ...f,
      milestones: f.milestones.map((m) =>
        m.id === id ? { ...m, done: !m.done } : m
      ),
    }));
  }

  function toggleTeamMember(memberId: string) {
    setForm((f) => ({
      ...f,
      teamIds: f.teamIds.includes(memberId)
        ? f.teamIds.filter((id) => id !== memberId)
        : [...f.teamIds, memberId],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      const payload = {
        title: form.title,
        summary: form.summary,
        description: form.description,
        category: form.category,
        status: form.status,
        featured: form.featured,
        coverImage: form.coverImage,
        teamIds: form.teamIds,
        milestones: form.milestones,
        slug,
      };
      if (editing) {
        await updateDocById(COLLECTIONS.projects, editing.id, payload);
      } else {
        await createDoc(COLLECTIONS.projects, {
          ...payload,
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
        });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed. Check Firebase connection.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      await deleteDocById(COLLECTIONS.projects, id);
      load();
    } catch {
      alert('Delete failed. Check Firebase rules and connection.');
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Content management</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-ink-muted">{projects.length} total project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New project
        </button>
      </div>

      {/* Project Cards Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-56 rounded-xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started."
          action={
            <button onClick={openCreate} className="btn-primary text-sm">
              <Plus size={14} /> New project
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="card group flex flex-col overflow-hidden p-0"
            >
              {/* Cover image thumbnail */}
              <div className="relative h-36 overflow-hidden bg-panel2 border-b border-line">
                {p.coverImage ? (
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon size={28} className="text-ink-muted" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <StatusBadge status={p.status} />
                </div>
                {p.featured && (
                  <div className="absolute right-2 top-2">
                    <span className="rounded-full bg-circuit/20 border border-circuit/40 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-circuit">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-circuit mb-1">
                  {p.category}
                </p>
                <h3 className="font-display font-semibold text-ink line-clamp-1">{p.title}</h3>
                <p className="mt-1.5 text-xs text-ink-dim line-clamp-2 flex-1">{p.summary}</p>

                {/* Milestones mini-progress */}
                {p.milestones && p.milestones.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-ink-muted">
                      <span>Milestones</span>
                      <span>{p.milestones.filter((m) => m.done).length}/{p.milestones.length}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-panel2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-circuit to-circuit-bright transition-all duration-500"
                        style={{
                          width: `${Math.round(
                            (p.milestones.filter((m) => m.done).length / p.milestones.length) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end gap-1.5 border-t border-line pt-3">
                  <button
                    onClick={() => openEdit(p)}
                    className="rounded-md px-3 py-1.5 text-xs text-ink-dim transition-colors hover:bg-circuit/10 hover:text-circuit flex items-center gap-1.5"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-md px-3 py-1.5 text-xs text-ink-dim transition-colors hover:bg-alert/10 hover:text-alert flex items-center gap-1.5"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit: ${editing.title}` : 'Create new project'}
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Basic Info */}
          <div>
            <p className="eyebrow mb-3">Basic information</p>
            <div className="space-y-3">
              <input
                required
                placeholder="Project title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="admin-input"
              />
              <textarea
                required
                rows={2}
                placeholder="Short summary (shown in project cards)"
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                className="admin-input resize-none"
              />
              <textarea
                rows={4}
                placeholder="Full description (optional, supports HTML)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="admin-input resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Category (e.g. Robotics)"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="admin-input"
                />
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as ProjectStatus }))
                  }
                  className="admin-input"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2.5 text-sm text-ink-dim cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-line accent-circuit h-4 w-4"
                />
                Feature this project on the homepage
              </label>
            </div>
          </div>

          {/* Section: Cover Image */}
          <div className="border-t border-line pt-5">
            <p className="eyebrow mb-3">Cover image</p>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {COVER_IMAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, coverImage: opt.value }))}
                    className={`relative overflow-hidden rounded-lg border text-left text-xs transition-all ${
                      form.coverImage === opt.value
                        ? 'border-circuit shadow-glow-sm'
                        : 'border-line hover:border-line-bright'
                    }`}
                  >
                    {opt.value ? (
                      <img src={opt.value} alt={opt.label} className="h-16 w-full object-cover" />
                    ) : (
                      <div className="flex h-16 items-center justify-center bg-panel2 text-ink-muted">
                        <ImageIcon size={18} />
                      </div>
                    )}
                    <div className="bg-panel/90 px-2 py-1 text-[10px] font-medium text-ink-dim">
                      {opt.label}
                    </div>
                    {form.coverImage === opt.value && (
                      <div className="absolute right-1 top-1 rounded-full bg-circuit p-0.5">
                        <CheckCircle2 size={12} className="text-void" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <input
                placeholder="Or paste a custom image URL…"
                value={form.coverImage}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                className="admin-input text-xs"
              />
              {form.coverImage && (
                <div className="relative h-24 overflow-hidden rounded-lg border border-line">
                  <img
                    src={form.coverImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section: Team */}
          <div className="border-t border-line pt-5">
            <p className="eyebrow mb-3">Team assignment</p>
            <div className="grid grid-cols-2 gap-2">
              {allTeam.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleTeamMember(member.id)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                    form.teamIds.includes(member.id)
                      ? 'border-circuit bg-circuit/5 text-ink shadow-glow-sm'
                      : 'border-line text-ink-dim hover:border-line-bright hover:bg-panel2/50'
                  }`}
                >
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel2 overflow-hidden border border-line">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-display text-xs font-bold text-circuit">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    )}
                    {form.teamIds.includes(member.id) && (
                      <div className="absolute inset-0 rounded-full border-2 border-circuit" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-xs truncate">{member.name}</p>
                    <p className="text-[10px] text-ink-muted truncate">{member.role}</p>
                  </div>
                </button>
              ))}
            </div>
            {form.teamIds.length > 0 && (
              <p className="mt-2 text-xs text-ink-muted">
                {form.teamIds.length} member{form.teamIds.length !== 1 ? 's' : ''} assigned
              </p>
            )}
          </div>

          {/* Section: Milestones */}
          <div className="border-t border-line pt-5">
            <p className="eyebrow mb-3">Milestones</p>
            <div className="space-y-2">
              {form.milestones.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                    m.done ? 'border-signal/30 bg-signal/5' : 'border-line bg-panel2/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleMilestone(m.id)}
                    className="shrink-0 text-ink-muted hover:text-signal transition-colors"
                  >
                    {m.done ? (
                      <CheckCircle2 size={16} className="text-signal" />
                    ) : (
                      <Circle size={16} />
                    )}
                  </button>
                  <span className={`flex-1 text-sm ${m.done ? 'text-ink line-through opacity-60' : 'text-ink'}`}>
                    {m.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMilestone(m.id)}
                    className="shrink-0 rounded p-0.5 text-ink-muted hover:text-alert transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  placeholder="Add milestone…"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addMilestone(); }
                  }}
                  className="admin-input flex-1 text-sm"
                />
                <button
                  type="button"
                  onClick={addMilestone}
                  className="rounded-lg border border-line bg-panel2 px-3 text-ink-dim hover:border-circuit/50 hover:text-circuit transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-line pt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-ghost flex-1 text-sm"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 text-sm">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
