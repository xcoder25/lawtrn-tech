import { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { mockEvents } from '../../data/mockData';
import type { CommunityEvent } from '../../types';

export default function Community() {
  const [events, setEvents] = useState<CommunityEvent[]>(mockEvents);

  useEffect(() => {
    listDocs<CommunityEvent>(COLLECTIONS.events)
      .then((docs) => docs.length && setEvents(docs))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
      <SectionHeader
        eyebrow="Community"
        title="Events, workshops & volunteering"
        description="Every open way to build alongside us."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="card-interactive p-6">
            <span className="font-mono text-[10px] uppercase tracking-wider text-circuit">
              {event.type}
            </span>
            <h3 className="mt-2 font-display text-lg font-medium text-ink">{event.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">{event.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} /> {event.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} /> {event.location}
              </span>
            </div>
            <button className="btn-primary mt-5 text-sm" disabled={!event.registrationOpen}>
              {event.registrationOpen
                ? `Register (${event.registeredCount} joined)`
                : 'Registration closed'}
            </button>
          </div>
        ))}
      </div>

      <div className="circuit-divider my-16" />

      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-3">Collaborator spotlight</p>
        <h3 className="font-display text-2xl font-semibold text-ink">
          Know someone doing great work?
        </h3>
        <p className="mt-3 text-ink-dim">
          We regularly feature collaborators, mentors, and volunteers making an impact across our
          programs. Nominate someone through the contact page.
        </p>
      </div>
    </div>
  );
}
