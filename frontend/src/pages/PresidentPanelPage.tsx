import { AIStatusList } from '../components/president/AIStatusList';
import { ChannelList } from '../components/president/ChannelList';
import { HealthCard } from '../components/president/HealthCard';
import { RevenueCard } from '../components/president/RevenueCard';
import { RiskList } from '../components/president/RiskList';
import type { PresidentDashboard } from '../president/types';

const mockDashboard: PresidentDashboard = {
  health: [{ id: 'health-api', name: 'API', status: 'HEALTHY', message: 'All platform services are responding normally.' }, { id: 'health-database', name: 'Database', status: 'HEALTHY', message: 'Connection pool is within target.' }, { id: 'health-ai', name: 'AI Core', status: 'DEGRADED', message: 'Model queue is elevated.' }, { id: 'health-youtube', name: 'YouTube', status: 'CRITICAL', message: 'Publishing connector needs review.' }],
  revenue: { total: 184_200, monthly: 28_450, trend: 12, currency: 'USD' },
  channels: Array.from({ length: 10 }, (_, index) => ({ id: `channel-${index + 1}`, title: `Creator Channel ${index + 1}`, subscribers: (120_000 - index * 8_500).toLocaleString('en-US'), growth: 4 + (index % 6), monetized: index < 8 })),
  aiStatus: ['Content planning', 'Script review', 'Quality scoring', 'Audience analysis', 'Monetization advice'].map((name, index) => ({ id: `ai-${index + 1}`, name, state: index === 3 ? 'IDLE' as const : index === 4 ? 'ERROR' as const : 'ACTIVE' as const, lastActive: `2026-08-13T${String(12 - index).padStart(2, '0')}:00:00.000Z`, message: `Mock ${name.toLowerCase()} service.` })),
  risks: [{ id: 'risk-1', severity: 'HIGH', title: 'Security review due', description: 'Complete the scheduled access review.', category: 'Security' }, { id: 'risk-2', severity: 'HIGH', title: 'Revenue concentration', description: 'A limited channel group accounts for most monthly revenue.', category: 'Monetization' }, { id: 'risk-3', severity: 'MEDIUM', title: 'Copyright review', description: 'Review assets waiting for rights confirmation.', category: 'Compliance' }, { id: 'risk-4', severity: 'MEDIUM', title: 'Channel compliance', description: 'One creator channel needs a policy acknowledgement.', category: 'Compliance' }, { id: 'risk-5', severity: 'LOW', title: 'AI queue latency', description: 'Monitor the queue during peak hours.', category: 'Operations' }],
};

const directors = [
  ['Strategy Director', '98%', '18.05.2025 11:30'],
  ['Content Director', '97%', '18.05.2025 11:25'],
  ['Script Director', '96%', '18.05.2025 11:20'],
  ['Video Director', '95%', '18.05.2025 11:18'],
  ['Music Director', '97%', '18.05.2025 11:10'],
  ['Thumbnail Director', '96%', '18.05.2025 11:02'],
  ['SEO Director', '95%', '18.05.2025 10:55'],
  ['Analytics Director', '97%', '18.05.2025 10:48'],
  ['Publishing Director', '97%', '18.05.2025 10:38'],
  ['Growth Director', '96%', '18.05.2025 10:22'],
  ['Monetization Director', '97%', '18.05.2025 10:12'],
  ['Success Director', '97%', '18.05.2025 10:05'],
];

const alerts = [
  ['A', 'CTR dropped on 5 channels', '5 channels · 12 min'],
  ['!', 'CTR fell below 8%', '15 channels · 22 min'],
  ['✦', 'AI Director warning · ThumbnailDirector', '28 min'],
  ['★', 'New record · 1 channel hit 100K subscribers', '1 hour'],
  ['API', 'Analytics API usage at 85%', '2 hours'],
];

export function PresidentPanelPage({ initialData }: { initialData?: PresidentDashboard }) {
  const dashboard = initialData ?? mockDashboard;
  return (
    <section className="os-dash president-page" aria-labelledby="president-title">
      {!initialData && <p className="sr-only">Loading president panel…</p>}
      <div className="os-welcome-row">
        <div>
          <p className="eyebrow">Executive overview · Mock data only</p>
          <h2 id="president-title">President Dashboard</h2>
          <p className="os-muted">AIArbiTech YouTube OS · Platform health, revenue, channels, AI operations, and executive risks.</p>
          <span className="sr-only">President Panel</span>
        </div>
        <time className="os-date">19 May 2025 12:30:45</time>
      </div>

      <div className="os-stat-strip">
        {[
          ['Total users', '128,540', '+2,450 (24h)'],
          ['Active users', '45,782', '+1,230 (24h)'],
          ['New registrations', '3,245', '+320 (24h)'],
          ['Premium subscribers', '12,584', '+540 (24h)'],
          ['Monetized channels', '2,154', '+132 (24h)'],
          ['In monetization', '8,742', '+412 (24h)'],
        ].map(([label, value, delta]) => (
          <article key={label} className="os-card os-mini-stat">
            <small>{label}</small>
            <strong>{value}</strong>
            <em>{delta}</em>
          </article>
        ))}
      </div>

      <div className="os-grid-top os-grid-president">
        <section className="os-card">
          <h3>Monetization Progress (Global)</h3>
          <div className="os-global-progress">
            <div className="os-donut"><strong>73%</strong><small>AI Monetization Score</small></div>
            <div>
              <p>Subscribers <strong>812,540 / 1,000,000</strong></p>
              <div className="os-bar"><span style={{ width: '81%' }} /></div>
              <p>Watch Hours <strong>3,560,120 / 4,000,000</strong></p>
              <div className="os-bar os-bar--green"><span style={{ width: '89%' }} /></div>
            </div>
          </div>
        </section>
        <section className="os-card os-card--chart">
          <header className="os-card-head"><h3>AI Growth Overview (24h)</h3><span className="os-chip">24 hours</span></header>
          <div className="os-metric-row os-metric-row--compact">
            {[['Subscribers', '+1,820'], ['Views', '+245,780'], ['Watch Time', '+12,450'], ['CTR', '8.7%'], ['Retention', '56.3%']].map(([label, value]) => (
              <div key={label}><small>{label}</small><strong>{value}</strong></div>
            ))}
          </div>
          <svg viewBox="0 0 640 120" className="os-chart" aria-hidden>
            <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points="0,80 80,70 160,72 240,58 320,50 400,46 480,40 560,36 640,28" />
            <polyline fill="none" stroke="#34d399" strokeWidth="2" points="0,90 80,85 160,78 240,70 320,68 400,60 480,55 560,48 640,42" />
            <polyline fill="none" stroke="#a78bfa" strokeWidth="2" points="0,95 80,92 160,88 240,84 320,80 400,74 480,70 560,66 640,60" />
          </svg>
        </section>
        <section className="os-card">
          <header className="os-card-head"><h3>Executive Alerts</h3><span>Live</span></header>
          <ul className="os-alerts">
            {alerts.map(([tag, title, meta]) => (
              <li key={title}><span>{tag}</span><div><strong>{title}</strong><small>{meta}</small></div></li>
            ))}
          </ul>
        </section>
      </div>

      <div className="os-grid-mid os-grid-president-mid">
        <section className="os-card">
          <header className="os-card-head"><h3>AI Director Center</h3></header>
          <table className="os-table">
            <thead><tr><th>AI Director</th><th>Status</th><th>Health</th><th>Last audit</th></tr></thead>
            <tbody>
              {directors.map(([name, health, audit]) => (
                <tr key={name}><td>{name}</td><td className="ok">Active</td><td>{health}</td><td>{audit}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="os-card">
          <h3>Content Center (Global)</h3>
          <div className="os-content-stats">
            {[['Videos created', '1,245'], ['Music Studio tracks', '436'], ['Video Mode videos', '809'], ['Originality Score', '98.6%']].map(([label, value]) => (
              <div key={label}><small>{label}</small><strong>{value}</strong></div>
            ))}
          </div>
        </section>
        <section className="os-card">
          <h3>Tariff Statistics</h3>
          <ul className="os-tariffs">
            {[['Free', '45,620 (35.5%)'], ['Basic', '32,540 (25.3%)'], ['Standard', '24,180 (18.8%)'], ['Premium', '18,240 (14.2%)'], ['Enterprise', '7,960 (6.2%)']].map(([label, value]) => (
              <li key={label}><span>{label}</span><strong>{value}</strong></li>
            ))}
          </ul>
        </section>
      </div>

      <div className="success-grid os-exec-grid">
        <HealthCard metrics={dashboard.health} />
        <RevenueCard revenue={dashboard.revenue} />
        <ChannelList channels={dashboard.channels} />
        <AIStatusList aiStatus={dashboard.aiStatus} />
        <RiskList risks={dashboard.risks} />
      </div>
      <span className="foundation-badge">president:access</span>
    </section>
  );
}
