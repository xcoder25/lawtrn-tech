import { useState, type FormEvent } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { createDoc, COLLECTIONS } from '../../firebase/firestore';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general' as 'general' | 'collaboration',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      await createDoc(COLLECTIONS.contacts, { ...form, read: false });
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '', type: 'general' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
      <div className="grid gap-14 md:grid-cols-2 md:gap-16">
        <div>
          <p className="eyebrow mb-3">Get in touch</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
            Let&apos;s build something.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-dim">
            Whether it&apos;s a partnership, a research collaboration, or a general question — this
            reaches our team directly.
          </p>

          <div className="mt-10 space-y-4 text-sm text-ink-dim">
            <p className="flex items-center gap-2.5">
              <Mail size={16} className="text-circuit" /> hello@lawtronic.tech
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin size={16} className="text-circuit" /> Port Harcourt, Rivers State, Nigeria
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 p-7 md:p-8">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: 'general' }))}
              className={`flex-1 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                form.type === 'general'
                  ? 'border-circuit/50 bg-circuit/5 text-circuit'
                  : 'border-line text-ink-dim hover:border-line-bright'
              }`}
            >
              General inquiry
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: 'collaboration' }))}
              className={`flex-1 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                form.type === 'collaboration'
                  ? 'border-circuit/50 bg-circuit/5 text-circuit'
                  : 'border-line text-ink-dim hover:border-line-bright'
              }`}
            >
              Collaboration
            </button>
          </div>

          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input-field"
          />
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input-field"
          />
          <input
            required
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            className="input-field"
          />
          <textarea
            required
            rows={5}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="input-field resize-none"
          />

          <button type="submit" disabled={status === 'sending'} className="btn-primary w-full text-sm">
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'sent' && (
            <p className="rounded-lg border border-signal/30 bg-signal/5 px-3 py-2 text-sm text-signal">
              Message sent. We&apos;ll reply soon.
            </p>
          )}
          {status === 'error' && (
            <p className="rounded-lg border border-alert/30 bg-alert/5 px-3 py-2 text-sm text-alert">
              Something went wrong. Please try again — or email us directly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
