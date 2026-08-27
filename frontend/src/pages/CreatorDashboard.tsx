import { useEffect, useState } from 'react';
import { createPlatformApiClient, type CreatorStats, type YouTubeStatus } from '../platform-client';
import { createYouTubeOAuthUrl, publicRuntimeConfig } from '../config/runtime';

const api = createPlatformApiClient();
const chart = [34, 48, 42, 68, 57, 82, 65, 94, 76, 100];

function NetworkOrb() {
  return <div className="relative mx-auto h-[310px] w-[310px] sm:h-[420px] sm:w-[420px]">
    <div className="absolute inset-10 rounded-full bg-violet-600/20 blur-3xl" />
    <div className="absolute inset-12 rounded-full border border-cyan-300/30 bg-[radial-gradient(circle_at_35%_25%,rgba(99,102,241,.8),rgba(8,20,58,.9)_55%,rgba(2,7,20,.98))] shadow-[0_0_90px_rgba(63,94,251,.35)]" />
    <div className="absolute inset-20 rounded-full opacity-70 [background-image:radial-gradient(circle,rgba(103,232,249,.8)_1px,transparent_1px)] [background-size:9px_9px] [mask-image:radial-gradient(circle,#000,transparent_72%)]" />
    <div className="absolute inset-4 rounded-full border border-cyan-300/20 [transform:rotateX(64deg)_rotateZ(-18deg)]" />
    <div className="absolute inset-0 rounded-full border border-violet-300/20 [transform:rotateY(63deg)_rotateZ(20deg)]" />
    <div className="absolute inset-0 flex items-center justify-center text-7xl font-black tracking-[-.2em] text-white/90">A<span className="text-cyan-300">I</span></div>
    {['left-3 top-20', 'right-0 top-28', 'bottom-12 left-8', 'bottom-20 right-4'].map((position, index) => <span key={position} className={`absolute ${position} flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-slate-950/90 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,.35)]`}>{['▶', '▣', '♬', '✦'][index]}</span>)}
  </div>;
}

export function CreatorDashboard() {
  const [stats, setStats] = useState<CreatorStats>();
  const [notice, setNotice] = useState('');
  const [prompt, setPrompt] = useState('');
  const [youtubeStatus, setYoutubeStatus] = useState<YouTubeStatus>();
  const [authenticationRequired, setAuthenticationRequired] = useState(false);

  useEffect(() => {
    void api.getYouTubeStatus()
      .then(setYoutubeStatus)
      .catch(() => setYoutubeStatus(undefined));

    void Promise.all([api.getCreatorStats(), api.getRevenue(), api.getVideos()])
      .then(([creatorStats]) => {
        setStats(creatorStats);
      })
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
  const initials = publicRuntimeConfig.userDisplayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const creatorRoute = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

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

  return <div className="min-h-screen overflow-hidden bg-[#070b16] text-white">
    <nav className="border-b border-white/10 bg-[#070b16]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-5 lg:px-10">
      <a href={import.meta.env.BASE_URL} className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/30 text-xl font-black text-cyan-200">AI</span><span><strong className="block text-sm tracking-wide">AIArbiTechnology</strong><small className="block text-[9px] uppercase tracking-[.3em] text-slate-400">Creator Dashboard</small></span></a>
      <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex"><a href="#overview" className="text-white">Overview</a><a href={creatorRoute('/analytics')} className="hover:text-white">Analytics</a><a href={creatorRoute('/goals')} className="hover:text-white">Goals</a><a href={creatorRoute('/assistant')} className="hover:text-white">AI Assistant</a><a href={creatorRoute('/wallet')} className="hover:text-white">Wallet</a><a href={creatorRoute('/settings')} className="hover:text-white">Settings</a></div>
      <div className="flex items-center gap-3"><span className="hidden text-sm text-slate-300 sm:inline">◎ EN⌄</span><a href={import.meta.env.BASE_URL} className="rounded-lg border border-white/15 px-4 py-2 text-sm">Ecosystem</a>{publicRuntimeConfig.userAvatarUrl ? <img src={publicRuntimeConfig.userAvatarUrl} alt={`${publicRuntimeConfig.userDisplayName} avatar`} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" /> : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-xs font-bold" aria-label={`${publicRuntimeConfig.userDisplayName} avatar`}>{initials}</span>}</div>
    </div></nav>
    <main id="overview" className="!p-0">
      <section className="relative mx-auto grid max-w-[1380px] items-center gap-4 px-6 pb-8 pt-12 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:pb-10 lg:pt-16">
        <div className="pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-violet-700/15 blur-[120px]" />
        <div className="relative z-10"><p className="mb-5 text-xs font-bold uppercase tracking-[.32em] text-cyan-300">Your creator command center</p><h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl"><span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-white bg-clip-text text-transparent">Create.</span> Grow.<br />Earn globally.</h1><p className="mt-6 max-w-lg text-base leading-7 text-slate-400">Analytics, revenue, videos, and AI production tools connected in one future-ready workspace.</p><div className="mt-8 flex gap-3"><a href="#analytics" className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-bold shadow-[0_0_26px_rgba(56,189,248,.25)]">View analytics →</a><a href="#director" className="rounded-lg border border-cyan-300/30 px-5 py-3 text-sm font-semibold text-cyan-200">Create with AI</a></div></div>
        <NetworkOrb />
      </section>
      <section className="mx-auto grid max-w-[1380px] grid-cols-2 gap-3 px-6 pb-8 sm:grid-cols-4 lg:px-10">{authenticationRequired ? <p className="col-span-full rounded-xl border border-cyan-300/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-100" role="status">Sign in to load your private creator analytics.</p> : (stats?.kpis ?? []).slice(0, 4).map((metric) => <div key={metric.label} className="border-r border-white/10 px-4 py-3 last:border-0"><p className="text-2xl font-black text-white">{metric.value}</p><p className="mt-1 text-xs text-slate-500">{metric.label}</p><p className="mt-2 text-xs text-emerald-300">+{metric.delta}% growth</p></div>)}</section>
      <section id="analytics" className="mx-6 rounded-2xl border border-white/10 bg-[#101827]/80 p-5 shadow-[0_20px_80px_rgba(0,0,0,.2)] lg:mx-auto lg:max-w-[1380px] lg:p-7"><div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold">Creator analytics</h2><p className="mt-1 text-sm text-slate-500">Your channel momentum · Last 30 days</p></div><div className="text-right"><span className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400">{youtubeStatus?.status === 'CONFIGURED' ? 'YouTube API connected' : 'YouTube fallback mode'}</span>{oauthUrl && !youtubeStatus?.uploadConfigured && <a href={oauthUrl} className="mt-3 block text-xs font-bold text-cyan-300">Connect YouTube OAuth →</a>}</div></div><div className="mt-7 flex h-36 items-end gap-2 border-b border-white/10">{chart.map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-300 opacity-80" style={{ height: `${height}%` }} />)}</div></section>
      <section id="videos" className="mx-auto mt-6 grid max-w-[1380px] gap-6 px-6 pb-12 lg:grid-cols-[1.2fr_.8fr] lg:px-10"><div className="rounded-2xl border border-white/10 bg-[#101827]/80 p-6"><div className="flex items-center justify-between"><h2 className="font-bold">Video intelligence</h2><span className="text-xs text-cyan-300">From Global API</span></div><div className="mt-5 grid gap-3">{authenticationRequired ? <p className="text-sm text-slate-500">Sign in to load your private video intelligence.</p> : (stats?.kpis ?? []).length === 0 ? <p className="text-sm text-slate-500">Loading creator videos...</p> : ['Your latest upload performance', 'Audience retention opportunity', 'Next recommended publishing slot'].map((item) => <div key={item} className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-3"><span className="flex h-11 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/60 to-cyan-500/30">▶</span><div><p className="text-sm font-semibold">{item}</p><p className="mt-1 text-xs text-slate-500">Optimized by YouTube OS intelligence</p></div></div>)}</div></div>
        <div id="director" className="rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/15 to-cyan-500/[.04] p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">✦</span><div><h2 className="font-bold">AI Director</h2><p className="text-xs text-slate-500">Global production intelligence</p></div></div><p className="mt-5 text-sm leading-6 text-slate-300">Describe your next story. The AI Director prepares the hook, scenes, and publishing plan.</p><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="I want to create a video about..." className="mt-5 h-24 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400" /><button onClick={() => void planVideo()} className="mt-3 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold hover:bg-violet-500">Generate production plan ✦</button>{notice && <p className="mt-3 text-center text-xs text-emerald-300">{notice}</p>}</div>
      </section>
    </main>
    <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-500">One ecosystem. Unlimited platforms. <a className="text-cyan-300" href={`mailto:${publicRuntimeConfig.supportEmail}`}>Support and data rights</a>.</footer>
  </div>;
}
