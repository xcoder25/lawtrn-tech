import { useEffect, useState } from 'react';
import { Trash2, Mail, Check } from 'lucide-react';
import { COLLECTIONS, listDocs, updateDocById, deleteDocById } from '../../firebase/firestore';
import type { ContactSubmission } from '../../types';
import EmptyState from '../../components/ui/EmptyState';

export default function ManageContacts() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  async function load() {
    setLoading(true);
    try {
      const docs = await listDocs<ContactSubmission>(COLLECTIONS.contacts);
      setItems(docs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(item: ContactSubmission) {
    if (item.read) return;
    try {
      await updateDocById(COLLECTIONS.contacts, item.id, { read: true });
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to mark as read.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this submission?')) return;
    try {
      await deleteDocById(COLLECTIONS.contacts, id);
      if (selected?.id === id) setSelected(null);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  const unread = items.filter((i) => !i.read).length;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <p className="eyebrow mb-2">Inbox</p>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Contacts
          {unread > 0 && (
            <span className="ml-3 inline-flex items-center rounded-full bg-circuit/15 px-2.5 py-0.5 font-mono text-sm text-circuit">
              {unread} new
            </span>
          )}
        </h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="card overflow-hidden lg:col-span-2">
          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Mail size={32} />}
              title="No messages yet"
              description="Contact form submissions will appear here."
            />
          ) : (
            <ul className="max-h-[70vh] divide-y divide-line overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setSelected(item);
                      markRead(item);
                    }}
                    className={`w-full px-4 py-3.5 text-left transition-colors hover:bg-panel2 ${
                      selected?.id === item.id ? 'bg-panel2' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`truncate text-sm ${
                          item.read ? 'text-ink-dim' : 'font-medium text-ink'
                        }`}
                      >
                        {item.name}
                      </p>
                      {!item.read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-circuit" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-ink-muted">{item.subject}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-muted">
                      {item.type}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6 lg:col-span-3">
          {selected ? (
            <div>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-medium text-ink">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-ink-dim">
                    From {selected.name} &lt;{selected.email}&gt;
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-circuit">
                    {selected.type}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="rounded-md p-2 text-ink-dim transition-colors hover:bg-alert/10 hover:text-alert"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="rounded-lg border border-line bg-void p-5 text-sm leading-relaxed text-ink-dim whitespace-pre-wrap">
                {selected.message}
              </div>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="btn-primary mt-6 text-sm"
              >
                <Mail size={14} /> Reply by email
              </a>
              {selected.read && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                  <Check size={12} /> Marked as read
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Mail size={32} />}
              title="Select a message"
              description="Choose a submission from the list to read it."
            />
          )}
        </div>
      </div>
    </div>
  );
}
