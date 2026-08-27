import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../app/App';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App routing', () => {
  it('renders the creator dashboard at the YouTube OS base path', () => {
    vi.stubGlobal('window', {
      location: { pathname: '/youtube-os/' },
      localStorage: { getItem: () => '{}' },
    });

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('Creator Dashboard');
    expect(markup).not.toContain('Global Ecosystem');
  });

  it.each([
    ['/youtube-os/heir', 'Heir Panel'],
    ['/youtube-os/admin', 'Admin Panel'],
    ['/youtube-os/governance', 'Governance Permission Matrix'],
    ['/youtube-os/ai-sync', 'Global AI Core Sync'],
    ['/youtube-os/workflow', 'AI Workflow Engine'],
    ['/youtube-os/prompts', 'AI Prompt Registry'],
    ['/youtube-os/onboarding', 'Creator Onboarding'],
    ['/youtube-os/success', 'Creator Success'],
    ['/youtube-os/twin', 'Creator Twin'],
    ['/youtube-os/assistant', 'AI Assistant'],
    ['/youtube-os/analytics', 'Analytics Center'],
    ['/youtube-os/wallet', 'Creator Wallet'],
    ['/youtube-os/settings', 'Settings'],
  ])('renders the page for %s', (pathname, expected) => {
    vi.stubGlobal('window', {
      location: { pathname },
      localStorage: { getItem: () => '{}' },
    });

    expect(renderToStaticMarkup(<App />)).toContain(expected);
  });
});
