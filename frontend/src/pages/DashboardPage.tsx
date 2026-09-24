import React from 'react';
import type { DashboardSummary } from '../dashboard/types';
import { ChannelHealthCard } from '../components/dashboard/ChannelHealthCard';
import { KPICard } from '../components/dashboard/KPICard';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { RecommendationCard } from '../components/dashboard/RecommendationCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { StatusCard } from '../components/dashboard/StatusCard';

export function DashboardPage({ initialData }: { initialData?: DashboardSummary }) {
  if (initialData) {
    return (
      <main className="dashboard-page">
        <h1>Creator Dashboard</h1>
        <div className="dashboard-grid">
          <StatusCard aiStatus={initialData.aiStatus} />
          <section className="card"><h3>Monetization Progress</h3><p>{initialData.monetization.current} / {initialData.monetization.goal}</p><p>{initialData.monetization.note}</p></section>
          <section className="card"><h3>Channel Overview</h3>{initialData.channels.map((channel) => <p key={channel.id}>{channel.title} · {channel.subscriberCount} subscribers · {channel.videoCount} videos</p>)}</section>
          <section className="card"><h3>KPI Summary</h3>{initialData.kpis.map((kpi) => <KPICard key={kpi.id} kpi={kpi} />)}</section>
          <RevenueChart series={initialData.revenueSeries} />
          <ChannelHealthCard health={initialData.channelHealth} />
          <section className="card"><h3>AI Recommendations</h3>{initialData.recommendations.map((item) => <RecommendationCard key={item.id} recommendation={item} />)}</section>
          <RecentActivityList items={initialData.recentActivity} />
          <section className="card"><h3>Quick Actions</h3>{initialData.quickActions.map((action) => <button type="button" key={action.id}>{action.icon} {action.label}</button>)}</section>
          <section className="card"><h3>{initialData.aiChat.label}</h3><p>{initialData.aiChat.prompt}</p></section>
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-black/70 p-8 text-white">
      <p role="status">Loading creator dashboard…</p>
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AIArbiTech YouTube OS</h1>
        <div className="rounded-full bg-gray-800 px-4 py-2 text-sm">Gate 08 · Foundation 0.1.0</div>
      </header>
      <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
        <h2 className="mb-2 text-lg font-medium text-gray-300">Creator Dashboard</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Success score', '72', 'text-white'],
            ['Active workflows', '2', 'text-white'],
            ['Quality score', '91', 'text-white'],
            ['Views trend', '+12%', 'text-green-400'],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-300">Analytics</h2>
        <div className="flex h-40 items-end justify-between gap-2">
          {['h-20', 'h-32', 'h-40', 'h-24', 'h-36'].map((height) => (
            <div key={height} className={`w-2 rounded-full bg-green-500 ${height}`} />
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-400">Retention 68% · Mock revenue $420</p>
      </div>
      <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
        <h2 className="mb-2 text-lg font-medium text-gray-300">AI Assistant</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Help me plan a video..."
            className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-purple-500"
          />
          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500">
            Send message
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
