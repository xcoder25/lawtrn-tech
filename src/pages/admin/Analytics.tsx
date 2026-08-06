import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const trafficData = [
  { day: 'Mon', visitors: 240 },
  { day: 'Tue', visitors: 310 },
  { day: 'Wed', visitors: 290 },
  { day: 'Thu', visitors: 380 },
  { day: 'Fri', visitors: 420 },
  { day: 'Sat', visitors: 260 },
  { day: 'Sun', visitors: 210 },
];

const topPages = [
  { page: '/projects', views: 1240 },
  { page: '/', views: 980 },
  { page: '/learning', views: 640 },
  { page: '/research', views: 410 },
  { page: '/blog', views: 350 },
];

/** Read a CSS variable value from the root element at render time */
function cssVar(name: string): string {
  return `rgb(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`;
}

export default function Analytics() {
  const gridStroke     = cssVar('--color-line-bright-rgb');
  const axisStroke     = cssVar('--color-ink-muted-rgb');
  const tooltipBg      = cssVar('--color-panel-rgb');
  const tooltipBorder  = cssVar('--color-line-rgb');
  const tooltipLabel   = cssVar('--color-ink-rgb');
  const barVisitors    = cssVar('--color-circuit-rgb');
  const barViews       = cssVar('--color-signal-rgb');

  return (
    <div className="p-6 md:p-8">
      <p className="eyebrow mb-2">Insights</p>
      <h1 className="mb-8 font-display text-3xl font-semibold text-ink">Analytics</h1>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <p className="mb-5 text-sm text-ink-dim">Visitors this week</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" stroke={axisStroke} fontSize={12} tickLine={false} />
              <YAxis stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: 8,
                  fontSize: 13,
                  color: tooltipLabel,
                }}
                labelStyle={{ color: tooltipLabel }}
              />
              <Bar dataKey="visitors" fill={barVisitors} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <p className="mb-5 text-sm text-ink-dim">Most viewed pages</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topPages} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis type="number" stroke={axisStroke} fontSize={12} tickLine={false} />
              <YAxis
                dataKey="page"
                type="category"
                stroke={axisStroke}
                fontSize={12}
                width={90}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: 8,
                  fontSize: 13,
                  color: tooltipLabel,
                }}
                labelStyle={{ color: tooltipLabel }}
              />
              <Bar dataKey="views" fill={barViews} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-5 card p-6">
        <p className="mb-2 text-sm font-medium text-ink">Traffic sources</p>
        <p className="text-sm leading-relaxed text-ink-dim">
          Connect Google Analytics 4 (via the Firebase console) to populate source/medium
          breakdowns here once the site is live. Firebase Analytics is already initialized in{' '}
          <code className="text-circuit">src/firebase/config.ts</code>.
        </p>
      </div>
    </div>
  );
}
