import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { COLLECTIONS, listDocs, createDoc, updateDocById, deleteDocById } from '../../firebase/firestore';
import type { Post } from '../../types';
import { mockPosts } from '../../data/mockData';

const emptyForm = { title: '', type: 'blog' as Post['type'], excerpt: '', content: '', published: false };

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    try {
      const docs = await listDocs<Post>(COLLECTIONS.posts);
      setPosts(docs.length ? docs : (mockPosts as Post[]));
    } catch {
      setPosts(mockPosts as Post[]);
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

  function openEdit(post: Post) {
    setEditing(post);
    setForm({ title: post.title, type: post.type, excerpt: post.excerpt, content: post.content, published: post.published });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const slug = form.title.toLowerCase().trim().replace(/\s+/g, '-');
    try {
      if (editing) {
        await updateDocById(COLLECTIONS.posts, editing.id, { ...form, slug });
      } else {
        await createDoc(COLLECTIONS.posts, {
          ...form,
          slug,
          coverImage: '',
          authorId: '',
          tags: [],
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
    if (!confirm('Delete this post?')) return;
    try {
      await deleteDocById(COLLECTIONS.posts, id);
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
          <h1 className="font-display text-3xl font-semibold text-ink">Blog & News</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New post
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-ink-dim">
            <tr>
              <th className="px-5 py-3 font-normal">Title</th>
              <th className="px-5 py-3 font-normal">Type</th>
              <th className="px-5 py-3 font-normal">Published</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-6 text-ink-dim" colSpan={4}>Loading\u2026</td></tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-none">
                  <td className="px-5 py-4 text-ink">{p.title}</td>
                  <td className="px-5 py-4 text-ink-dim capitalize">{p.type}</td>
                  <td className="px-5 py-4 text-ink-dim">{p.published ? 'Yes' : 'Draft'}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(p)} className="text-ink-dim hover:text-circuit"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-ink-dim hover:text-alert"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit post' : 'New post'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="admin-input"
          />
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Post['type'] }))}
            className="admin-input"
          >
            <option value="blog">Blog</option>
            <option value="news">News</option>
            <option value="announcement">Announcement</option>
          </select>
          <textarea
            required
            rows={2}
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            className="admin-input"
          />
          <textarea
            rows={6}
            placeholder="Full content (rich text editor renders here in production — see README)"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="admin-input"
          />
          <label className="flex items-center gap-2 text-sm text-ink-dim">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Publish immediately
          </label>
          <button type="submit" className="btn-primary w-full justify-center text-sm">
            {editing ? 'Save changes' : 'Create post'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
