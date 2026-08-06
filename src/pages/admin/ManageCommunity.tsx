import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { COLLECTIONS, listDocs, createDoc, updateDocById, deleteDocById } from '../../firebase/firestore';
import type { CommunityEvent } from '../../types';
import { mockEvents } from '../../data/mockData';

const emptyForm = { title: '', type: 'Event' as CommunityEvent['type'], description: '', date: '', location: '', registrationOpen: true };

export default function ManageCommunity() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CommunityEvent | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const docs = await listDocs<CommunityEvent>(COLLECTIONS.events);
      setEvents(docs.length ? docs : (mockEvents as CommunityEvent[]));
    } catch {
      setEvents(mockEvents as CommunityEvent[]);
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

  function openEdit(event: CommunityEvent) {
    setEditing(event);
    setForm({ title: event.title, type: event.type, description: event.description, date: event.date, location: event.location, registrationOpen: event.registrationOpen });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateDocById(COLLECTIONS.events, editing.id, form);
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editing.id ? { ...ev, ...form } : ev))
        );
      } else {
        const result = await createDoc(COLLECTIONS.events, { ...form, registeredCount: 0 });
        const newId = (result as { id: string })?.id ?? `local-${Date.now()}`;
        setEvents((prev) => [
          ...prev,
          { ...form, id: newId, registeredCount: 0 } as CommunityEvent,
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
    if (!confirm('Delete this event?')) return;
    try {
      await deleteDocById(COLLECTIONS.events, id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-2">Content management</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Community</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New event
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-ink-dim">
            <tr>
              <th className="px-5 py-3 font-normal">Title</th>
              <th className="px-5 py-3 font-normal">Type</th>
              <th className="px-5 py-3 font-normal">Date</th>
              <th className="px-5 py-3 font-normal">Registered</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-6 text-ink-dim" colSpan={5}>Loading\u2026</td></tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} className="border-b border-line last:border-none">
                  <td className="px-5 py-4 text-ink">{ev.title}</td>
                  <td className="px-5 py-4 text-ink-dim">{ev.type}</td>
                  <td className="px-5 py-4 text-ink-dim">{ev.date}</td>
                  <td className="px-5 py-4 text-ink-dim">{ev.registeredCount}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(ev)} className="text-ink-dim hover:text-circuit"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(ev.id)} className="text-ink-dim hover:text-alert"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit event' : 'New event'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="admin-input" />
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CommunityEvent['type'] }))} className="admin-input">
            <option value="Event">Event</option>
            <option value="Workshop">Workshop</option>
            <option value="Volunteer">Volunteer</option>
          </select>
          <textarea required rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="admin-input" />
          <input required type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="admin-input" />
          <input required placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="admin-input" />
          <label className="flex items-center gap-2 text-sm text-ink-dim">
            <input type="checkbox" checked={form.registrationOpen} onChange={(e) => setForm((f) => ({ ...f, registrationOpen: e.target.checked }))} />
            Registration open
          </label>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center text-sm">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create event'}</button>
        </form>
      </Modal>
    </div>
  );
}
