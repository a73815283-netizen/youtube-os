import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ensureAutoTranslations, supportedLanguages, type SupportedLanguage } from '../i18n';
import { publicRuntimeConfig } from '../config/runtime';

const youtubeOsHref = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;
const platforms = [
  { name: 'YouTube OS', description: 'AI-powered YouTube automation and optimization platform.', accent: 'red', icon: '▶', href: youtubeOsHref },
  { name: 'AI Arbitrage', description: 'Autonomous arbitrage systems for global digital markets.', accent: 'violet', icon: '↗', href: '#platforms' },
  { name: 'AI Market Pulse Scalper', description: 'Real-time market scanning and scalping AI platform.', accent: 'emerald', icon: '▮', href: '#platforms' },
  { name: 'AI Video Creator Studio', description: 'AI video generation and content creation suite.', accent: 'blue', icon: '🎬', href: '#platforms' },
  { name: 'AIArbiTech TV Global Media', description: 'Global media network and broadcasting platform.', accent: 'amber', icon: '📺', href: '#platforms' },
];

const stats = [
  ['5+', 'Core Platforms', '◈'],
  ['Global', 'Worldwide Access', '◎'],
  ['Secure', 'Enterprise Grade', '⬡'],
  ['AI-Powered', 'Next Generation', '✦'],
];

const features = [
  ['⬡', 'Enterprise Security', 'Military-grade security and data protection', 'blue'],
  ['⌘', 'Blockchain Verified', 'Transparent, immutable, and verifiable', 'violet'],
  ['AI', 'AI-Powered Core', 'Advanced AI models and automation', 'cyan'],
  ['◎', 'Global Infrastructure', 'High performance worldwide', 'emerald'],
  ['♧', 'User First', 'Designed for creators, traders, and businesses', 'blue'],
];

const platformThemes: Record<string, string> = {
  red: 'border-red-400/20 from-red-500/10 hover:border-red-300/60 text-red-300 border-red-300/40 bg-red-500/20 text-red-200 hover:bg-red-400/10',
  violet: 'border-violet-400/20 from-violet-500/10 hover:border-violet-300/60 text-violet-300 border-violet-300/40 bg-violet-500/20 text-violet-200 hover:bg-violet-400/10',
  emerald: 'border-emerald-400/20 from-emerald-500/10 hover:border-emerald-300/60 text-emerald-300 border-emerald-300/40 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-400/10',
  blue: 'border-blue-400/20 from-blue-500/10 hover:border-blue-300/60 text-blue-300 border-blue-300/40 bg-blue-500/20 text-blue-200 hover:bg-blue-400/10',
  amber: 'border-amber-400/20 from-amber-500/10 hover:border-amber-300/60 text-amber-300 border-amber-300/40 bg-amber-500/20 text-amber-200 hover:bg-amber-400/10',
  pink: 'border-pink-400/20 from-pink-500/10 hover:border-pink-300/60 text-pink-300 border-pink-300/40 bg-pink-500/20 text-pink-200 hover:bg-pink-400/10',
};

const featureColors: Record<string, string> = {
  blue: 'text-blue-300',
  violet: 'text-violet-300',
  cyan: 'text-cyan-300',
  emerald: 'text-emerald-300',
};

function Globe() {
  return (
    <div className="relative mx-auto h-[390px] w-[390px] max-w-full sm:h-[500px] sm:w-[500px]">
      <div className="absolute inset-16 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute inset-20 rounded-full border border-blue-300/30 bg-[radial-gradient(circle_at_35%_25%,rgba(99,102,241,.8),rgba(12,28,78,.85)_52%,rgba(3,8,25,.98))] shadow-[0_0_100px_rgba(63,94,251,.35)]" />
      <div className="absolute inset-28 rounded-full opacity-70 [background-image:radial-gradient(circle,rgba(103,232,249,.8)_1px,transparent_1px)] [background-size:9px_9px] [mask-image:radial-gradient(circle,#000,transparent_72%)]" />
      <div className="absolute inset-10 rounded-full border border-cyan-300/30 [transform:rotateX(64deg)_rotateZ(-18deg)]" />
      <div className="absolute inset-5 rounded-full border border-violet-300/20 [transform:rotateY(63deg)_rotateZ(20deg)]" />
      <div className="absolute inset-0 rounded-full border border-blue-300/10 [transform:rotateX(70deg)_rotateZ(45deg)]" />
      {[
        ['left-20 top-24', 'text-red-300', '▶'], ['right-14 top-28', 'text-amber-300', '▣'],
        ['bottom-24 left-16', 'text-cyan-300', '♬'], ['bottom-14 right-20', 'text-violet-300', '⌘'],
      ].map(([position, color, icon]) => (
        <span key={position} className={`absolute ${position} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-slate-950/80 text-lg shadow-[0_0_25px_rgba(34,211,238,.35)] ${color}`}>{icon}</span>
      ))}
      <div className="absolute inset-0 flex items-center justify-center text-7xl font-black tracking-[-.2em] text-white/90">A<span className="text-cyan-300">I</span></div>
    </div>
  );
}

export function GlobalEcosystemHomePage() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const current = i18n.resolvedLanguage ?? i18n.language ?? 'en';
    return (supportedLanguages.includes(current as SupportedLanguage) ? current : 'en') as SupportedLanguage;
  });

  useEffect(() => {
    void ensureAutoTranslations(language);
    void i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b16]/80 text-white">
      <nav className="border-b border-white/10 bg-[#070b16]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-5 lg:px-10">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/30 text-xl font-black text-cyan-200">AI</span>
            <span className="leading-tight"><strong className="block text-sm tracking-wide">AIArbiTechnology</strong><small className="block text-[9px] uppercase tracking-[.3em] text-slate-400">Global Ecosystem</small></span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex"><a href="#ecosystem" className="text-white">Ecosystem</a><a href="#platforms" className="hover:text-white">Platforms</a><a href="#solutions" className="hover:text-white">Solutions</a><a href="#footer" className="hover:text-white">Developers</a><a href="#footer" className="hover:text-white">Company</a><a href="#footer" className="hover:text-white">Resources</a></div>
          <div className="flex items-center gap-3">
            <label className="hidden items-center gap-2 rounded-lg border border-white/15 px-2 py-1 text-sm text-slate-300 sm:flex">
              <span>{t('nav.language')}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
                className="rounded bg-[#0f172a] px-2 py-1 text-xs text-slate-100"
              >
                {supportedLanguages.map((code) => (
                  <option key={code} value={code}>{code.toUpperCase()}</option>
                ))}
              </select>
            </label>
            <button className="hidden rounded-lg border border-white/15 px-4 py-2 text-sm sm:block">Sign In</button>
            <a href="#platforms" className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2 text-sm font-bold shadow-[0_0_24px_rgba(99,102,241,.35)]">Enter Ecosystem</a>
          </div>
        </div>
      </nav>

      <main id="ecosystem" className="!p-0">
        <section className="relative mx-auto grid max-w-[1380px] items-center gap-6 px-6 pb-10 pt-14 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:pb-16 lg:pt-20">
          <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-violet-700/15 blur-[120px]" />
          <div className="relative z-10">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.32em] text-cyan-300">The future, connected</p>
            <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-[-.04em] sm:text-7xl"><span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">AI-Powered.</span> <span className="text-white">Global.</span><br /><span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Unlimited</span> <span className="text-white">Possibilities.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">AIArbiTechnology Global Ecosystem connects powerful platforms, advanced AI services, and global users in one secure, transparent, future-ready environment.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#platforms" className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 font-bold shadow-[0_0_30px_rgba(56,189,248,.25)] transition hover:-translate-y-0.5">Explore Ecosystem <span className="ml-3">→</span></a><a href="#platforms" className="rounded-xl border border-blue-400/30 bg-blue-400/5 px-6 py-3.5 font-bold text-slate-200 transition hover:bg-blue-400/10">View Platforms</a></div>
            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-3">
              {stats.map(([value, label, icon]) => <div key={label}><div className="mb-2 text-xl text-cyan-300">{icon}</div><p className="font-bold">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{label}</p></div>)}
            </div>
          </div>
          <Globe />
        </section>

        <section className="mx-auto max-w-[1380px] px-6 pb-12 lg:px-10">
          <div className="flex items-center justify-between rounded-2xl border border-blue-300/10 bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-6 py-5 shadow-[0_0_50px_rgba(37,99,235,.08)]"><div><p className="font-bold text-white">Welcome to the Future of AIArbitrage</p><p className="mt-1 text-sm text-slate-400">One ecosystem. Unlimited platforms. Global impact.</p></div><a href="#platforms" className="hidden rounded-lg border border-white/15 px-5 py-2 text-sm font-bold sm:block">Learn More <span className="ml-3">›</span></a></div>
        </section>

        <section id="platforms" className="mx-auto max-w-[1380px] px-6 pb-20 lg:px-10">
          <div className="mb-7 flex items-end justify-between"><div><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Core Platforms</h2></div><a href="#platforms" className="hidden text-sm text-slate-300 sm:block">View All Platforms →</a></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {platforms.map((platform) => (
              <article key={platform.name} className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br to-slate-950/70 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(59,130,246,.15)] ${platformThemes[platform.accent]}`}>
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-[0_0_22px_rgba(59,130,246,.18)] ${platformThemes[platform.accent]}`}>{platform.icon}</div>
                <h3 className="text-lg font-bold">{platform.name}</h3><p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{platform.description}</p>
                <a href={platform.href} className={`mt-5 inline-flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-bold transition ${platformThemes[platform.accent]}`}>Enter Platform</a>
              </article>
            ))}
          </div>
        </section>

        <section id="solutions" className="border-y border-white/10 bg-slate-950/50"><div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-x divide-white/10 px-6 py-7 sm:grid-cols-5 lg:px-10">{features.map(([icon, title, description, color]) => <div key={title} className="px-4 first:pl-0 last:pr-0"><div className={`mb-3 text-2xl ${featureColors[color ?? 'blue']}`}>{icon}</div><p className="text-sm font-bold">{title}</p><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p></div>)}</div></section>
      </main>

      <footer id="footer" className="border-t border-white/10 bg-[#050812]">
        <div className="mx-auto grid max-w-[1380px] gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/30 font-black text-cyan-200">AI</span>
              <div><strong className="block text-sm">AIArbiTechnology</strong><small className="text-[9px] uppercase tracking-[.3em] text-slate-500">Global Ecosystem</small></div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">One ecosystem. Unlimited platforms. One shared future.</p>
            {publicRuntimeConfig.social.length > 0 && <div className="mt-6 flex gap-2">{publicRuntimeConfig.social.map(({ icon, label, url }) => <a key={label} href={url} aria-label={label} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[.04] text-xs font-bold text-slate-300 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-cyan-200">{icon}</a>)}</div>}
          </div>
          <div><h3 className="text-sm font-bold text-white">Platforms</h3><div className="mt-4 grid gap-3 text-sm text-slate-400"><a href="#platforms" className="hover:text-cyan-300">YouTube OS</a><a href="#platforms" className="hover:text-cyan-300">AI Arbitrage</a><a href="#platforms" className="hover:text-cyan-300">AI Market Pulse Scalper</a><a href="#platforms" className="hover:text-cyan-300">AI Video Creator Studio</a><a href="#platforms" className="hover:text-cyan-300">AIArbiTech TV Global Media</a></div></div>
          <div><h3 className="text-sm font-bold text-white">Company</h3><div className="mt-4 grid gap-3 text-sm text-slate-400"><a href="#ecosystem" className="hover:text-cyan-300">About</a><a href={`mailto:${publicRuntimeConfig.supportEmail}`} className="hover:text-cyan-300">Contact</a><a href={`mailto:${publicRuntimeConfig.supportEmail}?subject=Privacy%20or%20data%20rights%20request`} className="hover:text-cyan-300">Privacy and data rights</a></div></div>
          <div><h3 className="text-sm font-bold text-white">Stay connected</h3><p className="mt-4 text-sm leading-6 text-slate-400">Discover what is next across the AIArbiTechnology ecosystem.</p><a href="#platforms" className="mt-5 inline-flex rounded-lg border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-200 hover:bg-cyan-300/10">Explore platforms →</a></div>
        </div>
        <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1380px] flex-col gap-2 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10"><p>© {new Date().getFullYear()} AIArbiTechnology. All rights reserved.</p><p>Privacy Policy · Terms of Service · Security · Contact Us · Help Center</p></div></div>
      </footer>
    </div>
  );
}
