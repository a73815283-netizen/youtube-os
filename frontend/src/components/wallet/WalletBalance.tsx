export function WalletBalance({ amount, currency }: { amount: number; currency: string }) {
  return <section className="wallet-card wallet-balance" aria-labelledby="wallet-balance-title">
    <p className="wallet-kicker">Available balance</p>
    <h2 id="wallet-balance-title">{currency} ${amount.toLocaleString()}</h2>
    <p className="wallet-copy">Sandbox balance only. It cannot represent, store, or transfer real funds.</p>
  </section>;
}
