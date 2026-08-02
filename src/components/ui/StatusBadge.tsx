import type { ProjectStatus } from '../../types';

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Idea: 'text-ink-dim border-line bg-panel2',
  Research: 'text-signal border-signal/30 bg-signal/5',
  Prototype: 'text-circuit border-circuit/30 bg-circuit/5',
  Development: 'text-circuit-bright border-circuit/30 bg-circuit/5',
  Testing: 'text-alert border-alert/30 bg-alert/5',
  Completed: 'text-success border-success/30 bg-success/5',
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
