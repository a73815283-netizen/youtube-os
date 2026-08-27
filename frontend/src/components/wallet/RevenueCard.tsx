import type { RevenueAllocation } from '../../wallet/types';

export function RevenueCard({ allocation }: { allocation: RevenueAllocation }) {
  return <section className="wallet-card" aria-labelledby="revenue-card-title">
    <p className="wallet-kicker">Creator earnings</p>
    <h2 id="revenue-card-title">${allocation.creatorAmount.toLocaleString()}</h2>
    <p className="wallet-copy">Your 50% share of ${allocation.grossRevenue.toLocaleString()} gross eligible revenue.</p>
  </section>;
}
