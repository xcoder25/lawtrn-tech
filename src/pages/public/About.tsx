import SectionHeader from '../../components/ui/SectionHeader';

const VALUES = [
  {
    title: 'Build for real constraints',
    detail: 'Cost, power, and connectivity limits are design inputs, not excuses.',
  },
  {
    title: 'Publish the work',
    detail: 'Research is written up and shared, not left in a lab notebook.',
  },
  {
    title: 'Teach as we build',
    detail: 'Every project is a chance to train the next engineer on the team.',
  },
  {
    title: 'Ship, then iterate',
    detail: 'A working prototype in the field beats a perfect one on paper.',
  },
];

const ROADMAP = [
  { year: '2026', label: 'Launch Lawtronic Vision Kit to 10 pilot schools' },
  { year: '2027', label: 'Open the Robotics Competition Platform' },
  { year: '2028', label: 'Regional R&D partnerships across West Africa' },
];

export default function About() {
  return (
    <div>
      <section className="grid-bg border-b border-line px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4">About Lawtronic</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl text-balance">
            <span className="text-blue-chrome-animated">A technology company built around one habit: research it, then build it.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink-dim">
            Lawtronic Technologies started as a small robotics and electronics workshop and has
            grown into a full research-and-product studio spanning robotics, AI, software,
            electronics, and automation — with STEM education woven through every project.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-8">
            <p className="eyebrow mb-3">Vision</p>
            <p className="text-base leading-relaxed text-ink">
              A future where Africa&apos;s hardest infrastructure and education problems are solved
              by African-built technology.
            </p>
          </div>
          <div className="card p-8">
            <p className="eyebrow mb-3">Mission</p>
            <p className="text-base leading-relaxed text-ink">
              Research real-world problems, develop innovative solutions, build impactful products,
              empower future innovators, and contribute to technological advancement across Africa
              and beyond.
            </p>
          </div>
        </div>
      </section>

      <div className="circuit-divider" />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
        <SectionHeader eyebrow="What we hold to" title=<span className="text-blue-chrome-animated"> Core values</span> />
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="card-interactive p-6">
              <h3 className="font-display text-lg font-medium text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{v.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="circuit-divider" />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
        <SectionHeader eyebrow="Where we're headed" title=<span className="text-blue-chrome-animated"> Roadmap</span> />
        <div className="mx-auto max-w-2xl space-y-0">
          {ROADMAP.map((item, i) => (
            <div
              key={item.year}
              className={`flex gap-6 border-line pb-8 ${i < ROADMAP.length - 1 ? 'border-b mb-8' : ''}`}
            >
              <span className="w-14 shrink-0 font-mono text-sm text-circuit">{item.year}</span>
              <p className="text-ink-dim">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
