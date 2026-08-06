import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { COLLECTIONS, listDocs, createDoc, updateDocById, deleteDocById } from '../../firebase/firestore';
import type { TeamMember } from '../../types';
import { mockTeam } from '../../data/mockData';
import FileUploader from '../../components/ui/FileUploader';

const emptyForm = { name: '', role: '', department: '', bio: '', skills: '', linkedinUrl: '', photoUrl: '' };

export default function ManageTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const docs = await listDocs<TeamMember>(COLLECTIONS.team);
      setMembers(docs.length ? docs : (mockTeam as TeamMember[]));
    } catch {
      setMembers(mockTeam as TeamMember[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(member: TeamMember) {
    setEditing(member);
    setForm({
      name: member.name,
      role: member.role,
      department: member.department,
      bio: member.bio,
      skills: member.skills.join(', '),
      linkedinUrl: member.linkedinUrl ?? '',
      photoUrl: member.photoUrl ?? '',
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      role: form.role,
      department: form.department,
      bio: form.bio,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      linkedinUrl: form.linkedinUrl || undefined,
      photoUrl: form.photoUrl,
    };
    try {
      if (editing) {
        await updateDocById(COLLECTIONS.team, editing.id, payload);
        setMembers((prev) =>
          prev.map((m) => (m.id === editing.id ? { ...m, ...payload } : m))
        );
      } else {
        const result = await createDoc(COLLECTIONS.team, { ...payload, order: members.length + 1 });
        const newId = (result as { id: string })?.id ?? `local-${Date.now()}`;
        setMembers((prev) => [
          ...prev,
          { ...payload, id: newId, order: members.length + 1 } as TeamMember,
        ]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed. Check connection.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this team member?')) return;
    try {
      await deleteDocById(COLLECTIONS.team, id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-2">Content management</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Team</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> Add member
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-ink-dim">
            <tr>
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Role</th>
              <th className="px-5 py-3 font-normal">Department</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-6 text-ink-dim" colSpan={4}>Loading\u2026</td></tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-none">
                  <td className="px-5 py-4 text-ink">{m.name}</td>
                  <td className="px-5 py-4 text-ink-dim">{m.role}</td>
                  <td className="px-5 py-4 text-ink-dim">{m.department}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(m)} className="text-ink-dim hover:text-circuit"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(m.id)} className="text-ink-dim hover:text-alert"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit member' : 'Add member'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="admin-input" />
          <input required placeholder="Role (e.g. Lead Roboticist)" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="admin-input" />
          <input required placeholder="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className="admin-input" />
          <textarea required rows={3} placeholder="Short bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="admin-input" />
          <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} className="admin-input" />
          <input placeholder="LinkedIn URL (optional)" value={form.linkedinUrl} onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))} className="admin-input" />
          <FileUploader
            label="Profile Photo"
            accept="image/*"
            storagePath="team"
            value={form.photoUrl}
            onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
            isImage={true}
          />
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center text-sm">{saving ? 'Saving…' : editing ? 'Save changes' : 'Add member'}</button>
        </form>
      </Modal>
    </div>
  );
}
