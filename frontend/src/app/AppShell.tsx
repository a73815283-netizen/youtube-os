import type { ReactNode } from 'react';
import { ConsentBanner } from '../components/privacy/ConsentBanner';
import { AnimatedBackground } from '../shared/components/AnimatedBackground';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <AnimatedBackground />
      <div className="app-shell">{children}<ConsentBanner /></div>
    </>
  );
}
