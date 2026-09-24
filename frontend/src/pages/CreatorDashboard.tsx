import { useEffect, useState } from 'react';
import { createPlatformApiClient, type CreatorStats, type YouTubeStatus } from '../platform-client';
import { createYouTubeOAuthUrl, publicRuntimeConfig } from '../config/runtime';

const api = createPlatformApiClient();

const growth = {
  views: [42, 48, 45, 62, 58, 70, 66, 78, 74, 88, 82, 96],
  watch: [28, 32, 30, 40, 44, 42, 50, 55, 52, 61, 58, 70],
  subs: [18, 22, 20, 28, 26, 34, 32, 40, 38, 46, 44, 52],
  ctr: [12, 16, 14, 18, 22, 20, 24, 28, 26, 30, 34, 32],
  ret: [22, 20, 26, 24, 30, 28, 34, 32, 38, 36, 42, 40],
};

const recs = [
  { tone: 'blue', title: 'Create a video on “Top 5 AI Tools”', body: 'High-trend topic with strong CTR potential.', action: 'Create' },
  { tone: 'violet', title: 'Start a Shorts posting sequence', body: 'Last 7 days of Shorts drove 46% of new views.', action: 'Create' },
  { tone: 'amber', title: 'Lift thumbnail CTR 8.7% → 10%+', body: 'AI generated 5 thumbnail variants for you.', action: 'Review' },
  { tone: 'rose', title: 'Optimize video description SEO', body: 'Two videos are missing SEO-ready copy.', action: 'Optimize' },
  { tone: 'emerald', title: 'Schedule Friday 18:00 upload', body: 'Best audience window for your niche.', action: 'Schedule' },
];

const tasks = [
  'Publish 1 long-form video',
  'Publish 2 Shorts',
  'Test thumbnail variants',
  'Complete SEO checklist',
  'Write a community post',
  'Review analytics report',
  'Plan next week’s calendar',
  'Track competitor trends',
  'Reply to pinned comments',
  'Prepare end-screen CTA',
];

const videos = [
  { title: 'Top 7 AI Tools That Will Change Your Life', views: '12.4K', ctr: '9.8%', ret: '58%', watch: '612h' },
  { title: 'How to Make Money with AI in 2025', views: '8.7K', ctr: '8.1%', ret: '54%', watch: '430h' },
  { title: 'AI Automation Full Guide (Step by Step)', views: '15.3K', ctr: '10.2%', ret: '61%', watch: '845h' },
];

const roadmap = [
  { label: 'Channel Launch', date: '10.03.2025', done: true },
  { label: 'First 100 Subs', date: '24.03.2025', done: true },
  { label: 'First 1K Subs', date: 'In progress', done: false, current: true },
  { label: 'Monetization Ready', date: '812 / 1,000', done: false },
  { label: 'Monetized', date: '3,560 / 4,000', done: false },
  { label: '$1K / mo', date: '—', done: false },
  { label: '$5K / mo', date: '—', done: false },
];

function LineChart() {
  const w = 640;
  const h = 180;
  const toPoints = (values: number[]) =>
    values.map((value, index) => `${(index / (values.length - 1)) * w},${h - (value / 100) * (h - 24) - 8}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="os-chart" aria-hidden>
      {[0, 1, 2, 3].map((line) => <line key={line} x1="0" y1={24 + line * 40} x2={w} y2={24 + line * 40} stroke="rgba(148,163,184,.12)" />)}
      <polyline fill="none" stroke="#38bdf8" strokeWidth="2.4" points={toPoints(growth.views)} />
      <polyline fill="none" stroke="#34d399" strokeWidth="2.2" points={toPoints(growth.watch)} />
      <polyline fill="none" stroke="#a78bfa" strokeWidth="2.2" points={toPoints(growth.subs)} />
      <polyline fill="none" stroke="#fbbf24" strokeWidth="2" points={toPoints(growth.ctr)} />
      <polyline fill="none" stroke="#fb7185" strokeWidth="2" points={toPoints(growth.ret)} />
    </svg>
  );
}

function Ring({ value, color }: { value: number; color: string }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 72 72" className="os-ring">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(148,163,184,.16)" strokeWidth="7" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} transform="rotate(-90 36 36)" />
    </svg>
  );
}

export function CreatorDashboard() {
  const [stats, setStats] = useState<CreatorStats>();
  const [notice, setNotice] = useState('');
  const [prompt, setPrompt] = useState('');
  const [youtubeStatus, setYoutubeStatus] = useState<YouTubeStatus>();
  const [authenticationRequired, setAuthenticationRequired] = useState(false);
  const name = publicRuntimeConfig.userDisplayName;

  useEffect(() => {
    void api.getYouTubeStatus().then(setYoutubeStatus).catch(() => setYoutubeStatus(undefined));
    void Promise.all([api.getCreatorStats(), api.getRevenue(), api.getVideos()])
      .then(([creatorStats]) => setStats(creatorStats))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Unable to load creator data.';
        if (message.includes('401')) {
          setAuthenticationRequired(true);
          return;
        }
        setNotice(message);
      });
  }, []);

  const [oauthState] = useState(() => crypto.randomUUID());
  const oauthUrl = createYouTubeOAuthUrl(oauthState);
  const kpi = stats?.kpis ?? [];

  const planVideo = async () => {
    if (!prompt.trim()) return;
    try {
      const plan = await api.createVideoPlan(prompt);
      setNotice(`AI Director ${plan.status.toLowerCase()} your production plan.`);
      setPrompt('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create a production plan.';
      setNotice(message.includes('401') ? 'Sign in to create a production plan.' : message);
    }
  };

  return (
    <div className="os-dash">
      <h1 className="sr-only">Creator Dashboard</h1>
      {authenticationRequired && <p className="os-banner" role="status">Sign in to load your private creator analytics.</p>}
      {notice && <p className="os-banner">{notice}</p>}

      <div className="os-welcome-row">
        <div>
          <h2>Welcome back, {name}! 👋</h2>
          <p>AI is actively growing your channel in the background.</p>
        </div>
        <div className="os-score-pill">
          <Ring value={87} color="#22d3ee" />
          <div><small>AI Score</small><strong>87 / 100</strong></div>
        </div>
        <div className="os-score-pill">
          <span className="os-task-icon">☑</span>
          <div><small>Today’s tasks</small><strong>8</strong></div>
        </div>
        <time className="os-date">6 May 2025</time>
      </div>

      <div className="os-grid-top">
        <section className="os-card os-card--wide">
          <header className="os-card-head">
            <h3>Monetization progress</h3>
            <span className="os-chip os-chip--good">On track</span>
          </header>
          <div className="os-mono-grid">
            <div>
              <p className="os-kpi-label">Subscribers</p>
              <p className="os-kpi-value">{kpi[0]?.value ?? '812'}<small> / 1,000</small></p>
              <div className="os-bar"><span style={{ width: '81%' }} /></div>
              <small>Remaining: 188 · 81%</small>
            </div>
            <div>
              <p className="os-kpi-label">Watch Hours</p>
              <p className="os-kpi-value">3,560<small> / 4,000</small></p>
              <div className="os-bar os-bar--green"><span style={{ width: '89%' }} /></div>
              <small>Remaining: 440 · 89%</small>
            </div>
            <div>
              <p className="os-kpi-label">Monetization ready</p>
              <p className="os-kpi-value">91%</p>
              <div className="os-bar os-bar--gold"><span style={{ width: '91%' }} /></div>
              <small>Keep this pace — you’re almost there.</small>
            </div>
          </div>
        </section>
        <section className="os-card">
          <h3>Next milestone estimate</h3>
          <p className="os-muted">At your current growth rate</p>
          <div className="os-eta">
            <div><small>1,000 subscribers</small><strong>≈ 12 days</strong></div>
            <div><small>4,000 watch hours</small><strong>≈ 18 days</strong></div>
          </div>
        </section>
      </div>

      <div className="os-grid-mid">
        <section className="os-card os-card--chart">
          <header className="os-card-head">
            <h3>AI Growth Overview <small>(last 28 days)</small></h3>
            <span className="os-chip">28 days</span>
          </header>
          <div className="os-metric-row">
            {[
              ['Views', kpi[1]?.value ?? '128.4K', '+24.5%'],
              ['Watch Time', '1.2K', '+32.7%'],
              ['Subscribers', '+342', '+21.3%'],
              ['CTR / thumbnail', '8.7%', '+1.2%'],
              ['Retention (avg.)', '56%', '+3.4%'],
            ].map(([label, value, delta]) => (
              <div key={label}><small>{label}</small><strong>{value}</strong><em>{delta}</em></div>
            ))}
          </div>
          <LineChart />
          <div className="os-legend">
            <span>Views</span><span>Watch Time</span><span>Subscribers</span><span>CTR</span><span>Retention</span>
          </div>
          <p className="os-muted">{youtubeStatus?.status === 'CONFIGURED' ? 'YouTube API connected' : 'YouTube fallback mode'}{oauthUrl && !youtubeStatus?.uploadConfigured ? ' · Connect OAuth in Channel Settings' : ''}</p>
        </section>
        <section className="os-card">
          <header className="os-card-head"><h3>AI recommendations</h3><a href="#director">See all</a></header>
          <ul className="os-recs">
            {recs.map((item) => (
              <li key={item.title} className={`os-rec os-rec--${item.tone}`}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
                <button type="button">{item.action}</button>
              </li>
            ))}
          </ul>
        </section>
        <section className="os-card">
          <header className="os-card-head"><h3>Today’s tasks</h3><span>8/10 done</span></header>
          <div className="os-bar os-bar--blue"><span style={{ width: '80%' }} /></div>
          <ul className="os-tasks">
            {tasks.map((task, index) => (
              <li key={task} className={index < 8 ? 'done' : ''}>
                <span>{index < 8 ? '✓' : '○'}</span>
                {task}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="os-grid-bottom">
        <section className="os-card">
          <header className="os-card-head"><h3>Latest videos</h3><a href="#videos">See all</a></header>
          <ul className="os-videos" id="videos">
            {videos.map((video) => (
              <li key={video.title}>
                <span className="os-thumb">▶</span>
                <div>
                  <strong>{video.title}</strong>
                  <small>Views {video.views} · CTR {video.ctr} · Retention {video.ret} · {video.watch}</small>
                </div>
              </li>
            ))}
          </ul>
          <button type="button" className="os-ghost-btn">+ Create new video</button>
        </section>
        <section className="os-card">
          <header className="os-card-head"><h3>AI Success Roadmap</h3><a href="#roadmap">See all</a></header>
          <ol className="os-roadmap" id="roadmap">
            {roadmap.map((step) => (
              <li key={step.label} className={step.done ? 'done' : step.current ? 'current' : ''}>
                <span />
                <strong>{step.label}</strong>
                <small>{step.date}</small>
              </li>
            ))}
          </ol>
        </section>
        <section className="os-card os-chat" id="director">
          <header className="os-card-head"><h3>Hi, {name}!</h3></header>
          <p className="os-muted">Ask anything about growth, CTR, or monetization.</p>
          <div className="os-chips">
            <button type="button" onClick={() => setPrompt('Which topic is trending?')}>Which topic is trending?</button>
            <button type="button" onClick={() => setPrompt('How do I improve CTR?')}>How do I improve CTR?</button>
            <button type="button" onClick={() => setPrompt('What should I do for monetization?')}>What should I do for monetization?</button>
          </div>
          <div className="os-chat-input">
            <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask me a question" />
            <button type="button" onClick={() => void planVideo()}>➤</button>
          </div>
        </section>
      </div>
    </div>
  );
}
