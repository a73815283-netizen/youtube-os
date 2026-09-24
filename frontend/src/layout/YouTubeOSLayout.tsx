import { useEffect, useState, type ReactNode } from 'react';
import { publicRuntimeConfig } from '../config/runtime';
import { BouncyLetters } from '../shared/components/BouncyLetters';
import LoginPage from '../pages/LoginPage';

type ShellVariant = 'creator' | 'president';

type NavItem = { href: string; label: string; icon: string; badge?: string };

const creatorNav: NavItem[] = [
  { href: '/', label: 'Main Dashboard', icon: '⌂' },
  { href: '/success', label: 'Growth Engine', icon: '↗' },
  { href: '/wallet', label: 'Monetization Center', icon: '$' },
  { href: '/success', label: 'AI Success Roadmap', icon: '◎' },
  { href: '/workflow', label: 'Content Studio', icon: '▣' },
  { href: '/assistant', label: 'AI Tools', icon: '✦' },
  { href: '/analytics', label: 'Analytics Center', icon: '◔' },
  { href: '/analytics', label: 'Audience Center', icon: '☺' },
  { href: '/prompts', label: 'SEO Studio', icon: '⌕' },
  { href: '/workflow', label: 'Thumbnail Studio', icon: '▣' },
  { href: '/music', label: 'Music Studio', icon: '♪', badge: 'NEW' },
  { href: '/workflow', label: 'Publishing Center', icon: '⇪' },
  { href: '/twin', label: 'Community Center', icon: '☰' },
  { href: '/ai-sync', label: 'AI Strategy Hub', icon: '✧' },
  { href: '/settings', label: 'Channel Settings', icon: '⚙' },
];

const presidentNav: NavItem[] = [
  { href: '/president', label: 'Platform Overview', icon: '⌂' },
  { href: '/president', label: 'Business Dashboard', icon: '▣' },
  { href: '/wallet', label: 'Monetization Center', icon: '$' },
  { href: '/success', label: 'AI Growth Center', icon: '↗' },
  { href: '/twin', label: 'AI Director Center', icon: '✦' },
  { href: '/workflow', label: 'Content Center', icon: '▶' },
  { href: '/success', label: 'AI Success Roadmap', icon: '◎' },
  { href: '/analytics', label: 'Tariff Statistics', icon: '◔' },
  { href: '/analytics', label: 'AI Performance', icon: '⚡' },
  { href: '/governance', label: 'Security Center', icon: '⬡' },
  { href: '/workflow', label: 'Original Content Center', icon: '◇' },
  { href: '/success', label: 'Growth Mission Center', icon: '⚑' },
  { href: '/wallet', label: 'Financial Dashboard', icon: '€' },
  { href: '/president', label: 'Executive Alerts', icon: '!' },
  { href: '/analytics', label: 'Global Reports', icon: '◎' },
];

function route(path: string) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path === '/' ? '/' : path}`;
}

function currentPath() {
  return window.location.pathname.replace(/^\/youtube-os/, '') || '/';
}

export function YouTubeOSLayout({ children, variant = 'creator' }: { children: ReactNode; variant?: ShellVariant }) {
  const path = currentPath();
  const nav = variant === 'president' ? presidentNav : creatorNav;
  const baseName = publicRuntimeConfig.userDisplayName;
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('yo-theme') === 'light' ? 'light' : 'dark'));
  const [signedIn, setSignedIn] = useState(() => Boolean(localStorage.getItem('yo-user')));
  const [userName, setUserName] = useState(() => localStorage.getItem('yo-user') || baseName);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yo-theme', theme);
  }, [theme]);

  const initials = userName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const activeHref = path === '' || path === '/creator' ? '/' : path;

  return (
    <>
      <div className="os-app">
      <aside className="os-sidebar">
        <a href={route('/')} className="os-brand">
          <span className="os-logo">AI</span>
          <span>
            <strong>{variant === 'president' ? 'President Panel' : 'AIArbiTech Studio'}</strong>
            <small>{variant === 'president' ? 'YouTube OS' : '@aiarbitech.studio · 5 channels'}</small>
          </span>
        </a>
        <nav className="os-nav">
          {nav.map((item) => {
            const href = route(item.href);
            const active = item.href === activeHref || (item.href === '/' && (activeHref === '/' || activeHref === '/creator'));
            return (
              <a key={`${item.label}-${item.href}`} href={href} className={active ? 'os-nav-link os-nav-link--active' : 'os-nav-link'}>
                <span className="os-nav-icon">{item.icon}</span>
                <span className="os-nav-label">{item.label}</span>
                {item.badge ? <em className="os-badge">{item.badge}</em> : null}
              </a>
            );
          })}
        </nav>
        {variant === 'president' ? (
          <div className="os-status-card">
            <p>Platform Status</p>
            <strong className="text-emerald-400">● ONLINE</strong>
            <small>Uptime: 45d 12h 21s</small>
            <small>Health Score: 98.7%</small>
          </div>
        ) : (
          <div className="os-plan-card">
            <p>Premium Plan <span>Pro</span></p>
            <small>Active until 18.06.2026</small>
            <a href={route('/wallet')}>Manage plan</a>
          </div>
        )}
        <div className="os-sidebar-foot">
          <a href={route('/onboarding')}>Help Center</a>
          <a href={route('/settings')}>Sign out</a>
        </div>
      </aside>
      <div className="os-stage">
        <header className="os-topbar">
          <div>
            <p className="os-topbar-title">{variant === 'president' ? <BouncyLetters text="AIArbiTechnology" /> : <BouncyLetters text="AIArbiTech YouTube OS" />}</p>
            <p className="os-topbar-sub">{variant === 'president' ? 'GLOBAL ECOSYSTEM' : 'AI-Powered Growth & Monetization Platform'}</p>
          </div>
          <label className="os-search">
            <span>⌕</span>
            <input type="search" placeholder="Search… (Ctrl + K)" />
          </label>
          <div className="os-topbar-actions">
            <button type="button" className="os-icon-btn os-theme-btn" aria-label="Toggle theme" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button type="button" className="os-icon-btn" aria-label="Notifications">🔔</button>
            <a href={route('/assistant')} className="os-ai-btn">✦ {<BouncyLetters text="AI Assistant" />}</a>
            {signedIn ? (
              <>
                <div className="os-user">
                  {publicRuntimeConfig.userAvatarUrl ? (
                    <img src={publicRuntimeConfig.userAvatarUrl} alt="" className="os-avatar" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="os-avatar os-avatar--fallback">{initials}</span>
                  )}
                  <span>
                    <strong>{variant === 'president' ? 'President' : userName}</strong>
                    <small>{variant === 'president' ? 'AIArbiTechnology' : 'Premium Plan'}</small>
                  </span>
                </div>
                <button type="button" className="os-logout-btn" onClick={() => { localStorage.removeItem('yo-user'); setSignedIn(false); setUserName(baseName); }}><BouncyLetters text="Выйти" /></button>
              </>
            ) : (
              <button type="button" className="os-login-btn" onClick={() => setLoginOpen(true)}><BouncyLetters text="Войти" /></button>
            )}
          </div>
        </header>
        <div className="os-content">{children}</div>
      </div>
      </div>
      <LoginPage open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={(name) => { setSignedIn(true); setUserName(name); }} />
    </>
  );
}
