import { Link } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { createDoc, COLLECTIONS } from '../../firebase/firestore';

const FOOTER_LINKS = [
  {
    heading: 'Explore',
    links: [
      { to: '/projects', label: 'Projects' },
      { to: '/research', label: 'Research' },
      { to: '/learning', label: 'Learning Hub' },
      { to: '/community', label: 'Community' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/team', label: 'Team' },
      { to: '/blog', label: 'Blog & News' },
      { to: '/contact', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    try {
      await createDoc(COLLECTIONS.subscribers, {
        email,
        subscribedAt: new Date().toISOString(),
      });
      setStatus('sent');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-6 md:py-16">

        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="Lawtronic" className="h-9 w-9 rounded-full object-cover shadow-glow-sm" />
              <p className="font-display text-base font-semibold text-ink">
                LAW<span className="text-circuit">TRONIC</span>
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">
              Robotics, AI, and automation solutions engineered in Africa, for the systems Africa
              needs next.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Innovate · Automate · Elevate
            </p>
          </div>

          {/* Nav columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow mb-4">{col.heading}</p>
              <ul className="space-y-2.5 text-sm text-ink-dim">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition-colors hover:text-circuit">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="eyebrow mb-4">Stay updated</p>
            {status === 'sent' ? (
              <p className="text-sm text-signal">You&apos;re subscribed. Welcome aboard! 🎉</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field flex-1 min-w-0"
                />
                <button type="submit" className="btn-primary shrink-0 text-sm">
                  Join
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="mt-2 text-xs text-alert">Something went wrong. Try again.</p>
            )}
          </div>
        </div>

        <div className="circuit-divider my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 text-xs text-ink-muted sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Lawtronic Technologies Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-circuit">
              LinkedIn
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-circuit">
              X / Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-circuit">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
