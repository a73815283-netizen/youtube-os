import type { RevenueAllocation } from '../../wallet/types';

export function MonetizationStatusCard({ allocation }: { allocation: RevenueAllocation }) {
  return <section className="wallet-card" aria-labelledby="monetization-status-title">
    <p className="wallet-kicker">Monetization status</p>
    <h2 id="monetization-status-title">Revenue allocation</h2>
    <p className="wallet-copy">Eligible creator revenue is allocated transparently under the current policy.</p>
    <div className="wallet-split" aria-label="50/50 creator and platform revenue allocation">
      <div><strong>{allocation.creatorPercent}%</strong><span>Creator share</span><b>${allocation.creatorAmount.toLocaleString()}</b></div>
      <div><strong>{allocation.platformPercent}%</strong><span>Platform share</span><b>${allocation.platformAmount.toLocaleString()}</b></div>
    </div>
    <p className="wallet-note">Gross revenue: ${allocation.grossRevenue.toLocaleString()} · 50/50 creator/platform allocation</p>
  </section>;
}
