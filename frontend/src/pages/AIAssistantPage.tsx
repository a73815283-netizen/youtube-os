import { useState } from 'react';
import type { ChatSession } from '../ai/types';
import { ChatWindow } from '../components/ai/chat/ChatWindow';
import { HistorySidebar } from '../components/ai/chat/HistorySidebar';

interface AIAssistantPageProps {
  initialSessions?: readonly ChatSession[];
}

export function AIAssistantPage({ initialSessions }: AIAssistantPageProps) {
  const [sessions] = useState<readonly ChatSession[]>(initialSessions ?? []);
  const [activeSessionId, setActiveSessionId] = useState<string>();
  const activeSession = sessions.find((session) => session.id === activeSessionId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-black/70 p-6 text-white">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="eyebrow">Creator Experience</p>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        </div>
        <div className="rounded-full bg-gray-800 px-4 py-2 text-sm text-gray-300">Mock AI Only</div>
      </header>
      <div className="assistant-layout">
        <div>
          {initialSessions === undefined && <p role="status">Loading conversations…</p>}
          <HistorySidebar
            sessions={sessions}
            {...(activeSessionId ? { activeSessionId } : {})}
            onSelect={setActiveSessionId}
            onNewChat={() => setActiveSessionId(undefined)}
          />
        </div>
        <ChatWindow
          messages={activeSession?.messages ?? []}
          typing={false}
          onSend={() => undefined}
        />
      </div>
    </div>
  );
}

export default AIAssistantPage;
