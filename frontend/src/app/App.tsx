import { AppShell } from './AppShell';
import { YouTubeOSLayout } from '../layout/YouTubeOSLayout';
import { GlobalEcosystemHomePage } from '../pages/GlobalEcosystemHomePage';
import { CreatorDashboard } from '../pages/CreatorDashboard';
import { PresidentPanelPage } from '../pages/PresidentPanelPage';
import { GoalsPage } from '../pages/GoalsPage';
import { MusicStudioPage } from '../pages/MusicStudioPage';
import { HeirPanelPage } from '../pages/HeirPanelPage';
import { AdminPanelPage } from '../pages/AdminPanelPage';
import { GovernancePage } from '../pages/GovernancePage';
import { AISyncPage } from '../pages/AISyncPage';
import { WorkflowPage } from '../pages/WorkflowPage';
import { PromptRegistryPage } from '../pages/PromptRegistryPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { SuccessScorePage } from '../pages/SuccessScorePage';
import { TwinPage } from '../pages/TwinPage';
import { AIAssistantPage } from '../pages/AIAssistantPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { WalletPage } from '../pages/WalletPage';
import { SettingsPage } from '../pages/SettingsPage';
import type { PlatformFoundationClient } from '../platform/platform-client';

export interface AppProps {
  client?: PlatformFoundationClient;
}

export function App(_props: AppProps) {
  const path = window.location.pathname.replace(/^\/youtube-os/, '');
  const isCreatorRoute = path === '' || path === '/' || path === '/creator';
  const isEcosystem = path === '/ecosystem';
  const page = isCreatorRoute ? <CreatorDashboard />
    : path === '/president' ? <PresidentPanelPage />
    : isEcosystem ? <GlobalEcosystemHomePage />
    : path === '/goals' ? <GoalsPage />
    : path === '/music' ? <MusicStudioPage />
    : path === '/heir' ? <HeirPanelPage />
    : path === '/admin' ? <AdminPanelPage />
    : path === '/governance' ? <GovernancePage />
    : path === '/ai-sync' ? <AISyncPage />
    : path === '/workflow' ? <WorkflowPage />
    : path === '/prompts' ? <PromptRegistryPage />
    : path === '/onboarding' ? <OnboardingPage />
    : path === '/success' ? <SuccessScorePage />
    : path === '/twin' ? <TwinPage />
    : path === '/assistant' ? <AIAssistantPage />
    : path === '/analytics' ? <AnalyticsPage />
    : path === '/wallet' ? <WalletPage />
    : path === '/settings' ? <SettingsPage />
    : <GlobalEcosystemHomePage />;
  const osShell = isCreatorRoute || [
    '/president', '/goals', '/music', '/heir', '/admin', '/governance', '/ai-sync', '/workflow', '/prompts', '/onboarding', '/success', '/twin', '/assistant', '/analytics', '/wallet', '/settings',
  ].includes(path);
  return <AppShell>{osShell ? <YouTubeOSLayout variant={path === '/president' ? 'president' : 'creator'}>{page}</YouTubeOSLayout> : page}</AppShell>;
}
