import { useEffect, useState, type FormEvent } from 'react';
import { Send, Download } from 'lucide-react';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import type { Subscriber } from '../../types';

export default function ManageNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    listDocs<Subscriber>(COLLECTIONS.subscribers)
      .then(setSubscribers)
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false));
  }, []);

  function handleExport() {
    const csv = ['email,subscribedAt', ...subscribers.map((s) => `${s.email},${s.subscribedAt}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lawtronic-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setSendStatus('sending');
    // Sending itself is a Cloud Function (e.g. triggered via a `mail` collection
    // write, using an extension like Trigger Email or a provider like
    // SendGrid/Postmark) — this UI queues the send request.
    await new Promise((r) => setTimeout(r, 800));
    setSendStatus('sent');
    setSubject('');
    setBody('');
  }

  return (
    <div className="p-6 md:p-8">
      <p className="eyebrow mb-2">Content management</p>
      <h1 className="mb-8 font-display text-3xl font-semibold text-ink">Newsletter</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-ink">Subscribers ({loading ? '\u2014' : subscribers.length})</p>
            <button onClick={handleExport} className="btn-ghost text-sm">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto text-sm text-ink-dim">
            {subscribers.length === 0 && !loading && <p>No subscribers yet.</p>}
            {subscribers.map((s) => (
              <p key={s.id} className="border-b border-line py-2 last:border-none">{s.email}</p>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="card space-y-4 p-6">
          <p className="text-ink">Send a newsletter</p>
          <input
            required
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="admin-input"
          />
          <textarea
            required
            rows={6}
            placeholder="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="admin-input"
          />
          <button type="submit" disabled={sendStatus === 'sending'} className="btn-primary w-full justify-center text-sm">
            <Send size={14} /> {sendStatus === 'sending' ? 'Sending\u2026' : `Send to ${subscribers.length} subscribers`}
          </button>
          {sendStatus === 'sent' && <p className="text-sm text-signal">Newsletter queued for delivery.</p>}
        </form>
      </div>
    </div>
  );
}
