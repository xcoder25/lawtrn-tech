import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { COLLECTIONS, listDocs, createDoc, updateDocById, deleteDocById } from '../../firebase/firestore';
import type { Course } from '../../types';
import { mockCourses } from '../../data/mockData';

const TRACKS: Course['track'][] = ['Robotics', 'AI', 'Programming', 'Electronics'];
const LEVELS: Course['level'][] = ['Beginner', 'Intermediate', 'Advanced'];

const emptyForm = { title: '', track: 'Robotics' as Course['track'], level: 'Beginner' as Course['level'], description: '', published: false };

export default function ManageLearningHub() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    try {
      const docs = await listDocs<Course>(COLLECTIONS.courses);
      setCourses(docs.length ? docs : (mockCourses as Course[]));
    } catch {
      setCourses(mockCourses as Course[]);
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

  function openEdit(course: Course) {
    setEditing(course);
    setForm({ title: course.title, track: course.track, level: course.level, description: course.description, published: course.published });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const slug = form.title.toLowerCase().trim().replace(/\s+/g, '-');
    try {
      if (editing) {
        await updateDocById(COLLECTIONS.courses, editing.id, { ...form, slug });
      } else {
        await createDoc(COLLECTIONS.courses, { ...form, slug, lessons: [] });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed. Check connection.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course?')) return;
    try {
      await deleteDocById(COLLECTIONS.courses, id);
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
          <h1 className="font-display text-3xl font-semibold text-ink">Learning Hub</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New course
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-ink-dim">
            <tr>
              <th className="px-5 py-3 font-normal">Title</th>
              <th className="px-5 py-3 font-normal">Track</th>
              <th className="px-5 py-3 font-normal">Level</th>
              <th className="px-5 py-3 font-normal">Published</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-6 text-ink-dim" colSpan={5}>Loading\u2026</td></tr>
            ) : (
              courses.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-none">
                  <td className="px-5 py-4 text-ink">{c.title}</td>
                  <td className="px-5 py-4 text-ink-dim">{c.track}</td>
                  <td className="px-5 py-4 text-ink-dim">{c.level}</td>
                  <td className="px-5 py-4 text-ink-dim">{c.published ? 'Yes' : 'Draft'}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(c)} className="text-ink-dim hover:text-circuit"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(c.id)} className="text-ink-dim hover:text-alert"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit course' : 'New course'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="admin-input" />
          <select value={form.track} onChange={(e) => setForm((f) => ({ ...f, track: e.target.value as Course['track'] }))} className="admin-input">
            {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as Course['level'] }))} className="admin-input">
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <textarea required rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="admin-input" />
          <p className="text-xs text-ink-dim">Add lessons and video uploads from the course's detail screen after creating it.</p>
          <label className="flex items-center gap-2 text-sm text-ink-dim">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
            Publish immediately
          </label>
          <button type="submit" className="btn-primary w-full justify-center text-sm">{editing ? 'Save changes' : 'Create course'}</button>
        </form>
      </Modal>
    </div>
  );
}
