import React from 'react';
import type { AnalyticsBundle, AnalyticsClient } from '../analytics/types';
import { AudienceBreakdown } from '../components/analytics/AudienceBreakdown';
import { MetricCard } from '../components/analytics/MetricCard';
import { TimeSeriesChart } from '../components/analytics/TimeSeriesChart';
import { TopVideosTable } from '../components/analytics/TopVideosTable';

interface AnalyticsPageProps {
  initialData?: AnalyticsBundle;
  client?: AnalyticsClient;
}

export function AnalyticsPage({ initialData, client }: AnalyticsPageProps) {
  if (!initialData && client) {
    return <main><h1>Creator Analytics Center</h1><p>Loading creator analytics…</p></main>;
  }
  if (initialData) {
    const activeSeries = initialData.trends.series[0];
    return (
      <main className="analytics-page">
        <h1>Creator Analytics Center</h1>
        <section>
          <h2>Key Metrics (last 30 days)</h2>
          <div className="metric-grid">{initialData.summary.metrics.map((metric) => <MetricCard key={metric.metric} summary={metric} />)}</div>
        </section>
        <section>
          <h2>Performance Trends</h2>
          <div data-testid="metric-tabs">{initialData.trends.series.map((series) => <button type="button" key={series.metric}>{series.label}</button>)}</div>
          {activeSeries ? <TimeSeriesChart series={activeSeries} /> : <p>No trend data available.</p>}
        </section>
        <section><h2>Top Performing Videos</h2><TopVideosTable videos={initialData.performance.topVideos} /></section>
        <section><h2>Audience</h2><AudienceBreakdown geography={initialData.performance.geography} devices={initialData.performance.devices} /></section>
      </main>
    );
  }
  const metrics = [
    ['Subscribers', '1.2M', '+12%'],
    ['Views', '45.8M', '+8%'],
    ['Watch Time', '1.4K h', '+5%'],
    ['CTR', '8.2%', '+0.3%'],
  ];
  const bars = ['h-20', 'h-32', 'h-40', 'h-24', 'h-36', 'h-44'];
  const videos = [
    ['How to Start a YouTube Channel', '124K views'],
    ['AI Video Editing Tutorial', '98K views'],
    ['Top 10 AI Tools for Creators', '76K views'],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-black/70 p-6 text-white">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Center</h1>
        <div className="rounded-full bg-gray-800 px-4 py-2 text-sm text-gray-300">Mock Data</div>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map(([label, value, change]) => (
          <div key={label} className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-green-400">{change}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-300">Views Over Time</h2>
        <div className="flex h-48 items-end justify-between gap-2" role="img" aria-label="Mock views chart">
          {bars.map((height) => <div key={height} className={`w-6 rounded-full bg-blue-500 ${height}`} />)}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-300">Top Performing Videos</h2>
        <div className="space-y-3">
          {videos.map(([title, views]) => (
            <div key={title} className="flex items-center justify-between rounded-xl border border-gray-700 bg-gray-900/50 p-3">
              <span className="text-sm text-gray-200">{title}</span>
              <span className="text-sm text-blue-400">{views}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
