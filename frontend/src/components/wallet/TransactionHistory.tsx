import type { WalletTransaction } from '../../wallet/types';

export function TransactionHistory({ transactions }: { transactions: readonly WalletTransaction[] }) {
  return <section className="wallet-card wallet-card--wide" aria-labelledby="transaction-history-title">
    <div><p className="wallet-kicker">Wallet ledger</p><h2 id="transaction-history-title">Transaction history</h2></div>
    {transactions.length === 0 ? <p className="wallet-copy">No sandbox transactions yet.</p> : <ul className="wallet-transactions">
      {transactions.map((transaction) => <li key={transaction.id}>
        <div><strong>{transaction.description}</strong><span>{new Date(transaction.createdAt).toLocaleDateString()}</span></div>
        <div><b>{transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}</b><span>{transaction.status}</span></div>
      </li>)}
    </ul>}
  </section>;
}
