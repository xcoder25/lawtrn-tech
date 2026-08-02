import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { COLLECTIONS, listDocs, createDoc, updateDocById, deleteDocById } from '../../firebase/firestore';
import type { ResearchPublication } from '../../types';
import { mockResearch } from '../../data/mockData';

const emptyForm = { title: '', category: '', abstract: '', contributors: '', published: false };

export default function ManageResearch() {
  const [items, setItems] = useState<ResearchPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ResearchPublication | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    try {
      const docs = await listDocs<ResearchPublication>(COLLECTIONS.research);
      setItems(docs.length ? docs : (mockResearch as ResearchPublication[]));
    } catch {
      setItems(mockResearch as ResearchPublication[]);
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

  function openEdit(item: ResearchPublication) {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category,
      abstract: item.abstract,
      contributors: item.contributors.join(', '),
      published: item.published,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const slug = form.title.toLowerCase().trim().replace(/\s+/g, '-');
    const payload = {
      title: form.title,
      category: form.category,
      abstract: form.abstract,
      contributors: form.contributors.split(',').map((c) => c.trim()).filter(Boolean),
      published: form.published,
    };
    try {
      if (editing) {
        await updateDocById(COLLECTIONS.research, editing.id, { ...payload, slug });
      } else {
        await createDoc(COLLECTIONS.research, {
          ...payload,
          slug,
          references: [],
          publishedAt: new Date().toISOString(),
        });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed. Check connection.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this publication?')) return;
    try {
      await deleteDocById(COLLECTIONS.research, id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-2">Content management</p>
          <h1 className="font-display text-3xl font-semibold text-ink">Research</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New publication
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-ink-dim">
            <tr>
              <th className="px-5 py-3 font-normal">Title</th>
              <th className="px-5 py-3 font-normal">Category</th>
              <th className="px-5 py-3 font-normal">Published</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-6 text-ink-dim" colSpan={4}>Loading\u2026</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-none">
                  <td className="px-5 py-4 text-ink">{item.title}</td>
                  <td className="px-5 py-4 text-ink-dim">{item.category}</td>
                  <td className="px-5 py-4 text-ink-dim">{item.published ? 'Yes' : 'Draft'}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(item)} className="text-ink-dim hover:text-circuit"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-ink-dim hover:text-alert"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit publication' : 'New publication'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="admin-input"
          />
          <input
            required
            placeholder="Category (e.g. Agritech)"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="admin-input"
          />
          <textarea
            required
            rows={4}
            placeholder="Abstract"
            value={form.abstract}
            onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))}
            className="admin-input"
          />
          <input
            placeholder="Contributors (comma separated)"
            value={form.contributors}
            onChange={(e) => setForm((f) => ({ ...f, contributors: e.target.value }))}
            className="admin-input"
          />
          <p className="text-xs text-ink-dim">
            Attach the PDF after saving — file upload writes to Firebase Storage and stores the
            resulting URL on this record.
          </p>
          <label className="flex items-center gap-2 text-sm text-ink-dim">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Publish immediately
          </label>
          <button type="submit" className="btn-primary w-full justify-center text-sm">
            {editing ? 'Save changes' : 'Create publication'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
