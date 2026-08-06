import { useEffect, useState } from 'react';
import { Linkedin } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import { COLLECTIONS, listDocs } from '../../firebase/firestore';
import { mockTeam } from '../../data/mockData';
import type { TeamMember } from '../../types';

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeam);

  useEffect(() => {
    listDocs<TeamMember>(COLLECTIONS.team)
      .then((docs) => docs.length && setMembers(docs))
      .catch(() => {});
  }, []);

  const sorted = [...members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
      <SectionHeader eyebrow="The people" title="Team" />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {sorted.map((member) => (
          <div key={member.id} className="card-interactive p-6">
            <div className="mb-5 flex h-36 w-full items-center justify-center overflow-hidden rounded-lg bg-panel2 relative group/photo">
              {member.photoUrl ? (
                <>
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="scan-line hidden group-hover:block" />
                </>
              ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-panel2 to-panel3 overflow-hidden select-none">
                  {/* Radar/grid background elements */}
                  <div className="absolute h-24 w-24 rounded-full border border-circuit/10 animate-ping opacity-25" />
                  <div className="absolute h-16 w-16 rounded-full border border-circuit/20" />
                  <div className="absolute inset-0 bg-circuit-grid opacity-15" />
                  <div className="scan-line" />
                  {/* Initials */}
                  <span className="relative font-display text-3xl font-bold text-circuit [text-shadow:0_0_8px_currentColor]">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-display text-lg font-medium text-ink">{member.name}</h3>
            <p className="text-sm text-circuit">{member.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">{member.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(member.skills ?? []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-line px-2 py-0.5 text-[11px] text-ink-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors hover:text-circuit"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
