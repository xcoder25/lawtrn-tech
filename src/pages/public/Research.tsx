import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { mockResearch } from '../../data/mockData';
import type { ResearchPublication } from '../../types';

export default function Research() {
  const [items, setItems] = useState<ResearchPublication[]>(mockResearch);

  useEffect(() => {
    listDocs<ResearchPublication>(COLLECTIONS.research)
      .then((docs) => {
        const published = docs.filter((d) => d.published);
        if (published.length) setItems(published);
      })
      .catch(() => { });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
      <SectionHeader
        eyebrow="Research center"
        title=<span className="text-blue-chrome-animated"> Published research</span>
        description="Findings from our engineering work, written up and shared openly."
      />

      <div className="mx-auto max-w-3xl space-y-5">
        {items.map((pub) => (
          <div key={pub.id} className="card p-7 md:p-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
                {pub.category}
              </span>
              <span className="text-xs text-ink-muted">{pub.publishedAt}</span>
            </div>
            <h3 className="font-display text-xl font-medium text-ink">{pub.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">{pub.abstract}</p>
            <p className="mt-4 text-xs text-ink-muted">
              Contributors: {pub.contributors?.join(', ') || '—'}
            </p>
            <button className="btn-ghost mt-5 text-sm" disabled={!pub.documentUrl}>
              <Download size={14} />{' '}
              {pub.documentUrl ? 'Download PDF' : 'Document coming soon'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
