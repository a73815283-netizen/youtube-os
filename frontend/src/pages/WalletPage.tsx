import { useEffect, useMemo, useState } from 'react';
import { MonetizationStatusCard } from '../components/wallet/MonetizationStatusCard';
import { RevenueCard } from '../components/wallet/RevenueCard';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { WalletBalance } from '../components/wallet/WalletBalance';
import { WithdrawButton } from '../components/wallet/WithdrawButton';
import { createWalletClient } from '../wallet/wallet-client';
import type { WalletClient, WalletSummary } from '../wallet/types';

interface WalletPageProps {
  client?: WalletClient;
  initialData?: WalletSummary;
}

export function WalletPage({ client, initialData }: WalletPageProps) {
  const walletClient = useMemo(() => client ?? createWalletClient(), [client]);
  const [summary, setSummary] = useState<WalletSummary | undefined>(initialData);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (initialData) return;
    const controller = new AbortController();
    walletClient.getSummary(controller.signal).then(setSummary).catch((reason: unknown) => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Unable to load the sandbox wallet.');
    });
    return () => controller.abort();
  }, [initialData, walletClient]);

  if (error) return <main className="wallet-page"><h1>Creator Wallet</h1><p role="alert">{error}</p></main>;
  if (!summary) return <main className="wallet-page"><h1>Creator Wallet</h1><p role="status">Loading sandbox wallet…</p></main>;

  return <main className="wallet-page" aria-labelledby="wallet-title">
    <header className="wallet-header"><div><p className="wallet-kicker">Creator monetization</p><h1 id="wallet-title">Creator Wallet</h1><p className="wallet-copy">A contract-backed view of sandbox earnings and simulated withdrawal requests.</p></div><span className="wallet-mode">SANDBOX / TEST MODE</span></header>
    <div className="wallet-grid">
      <WalletBalance amount={summary.availableBalance} currency={summary.currency} />
      <RevenueCard allocation={summary.allocation} />
      <MonetizationStatusCard allocation={summary.allocation} />
      <WithdrawButton summary={summary} onRequest={(amount, twoFactorConfirmed) => walletClient.requestWithdrawal({ amount, twoFactorConfirmed })} />
      <TransactionHistory transactions={summary.transactions} />
    </div>
  </main>;
}
