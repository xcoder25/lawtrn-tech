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

export default function Analytics() {
  return (
    <div className="p-6 md:p-8">
      <p className="eyebrow mb-2">Insights</p>
      <h1 className="mb-8 font-display text-3xl font-semibold text-ink">Analytics</h1>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <p className="mb-5 text-sm text-ink-dim">Visitors this week</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2738" />
              <XAxis dataKey="day" stroke="#8B93A7" fontSize={12} tickLine={false} />
              <YAxis stroke="#8B93A7" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0C1019',
                  border: '1px solid #1E2738',
                  borderRadius: 8,
                  fontSize: 13,
                }}
                labelStyle={{ color: '#E8EBF2' }}
              />
              <Bar dataKey="visitors" fill="#F2B705" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <p className="mb-5 text-sm text-ink-dim">Most viewed pages</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topPages} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2738" />
              <XAxis type="number" stroke="#8B93A7" fontSize={12} tickLine={false} />
              <YAxis
                dataKey="page"
                type="category"
                stroke="#8B93A7"
                fontSize={12}
                width={90}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#0C1019',
                  border: '1px solid #1E2738',
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="views" fill="#2DD4BF" radius={[0, 4, 4, 0]} />
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
