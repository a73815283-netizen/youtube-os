import { useState, type FormEvent } from 'react';
import { validateWithdrawal, type WalletSummary, type WithdrawalReceipt } from '../../wallet/types';

interface WithdrawButtonProps {
  summary: WalletSummary;
  onRequest: (amount: number, twoFactorConfirmed: boolean) => Promise<WithdrawalReceipt>;
}

export function WithdrawButton({ summary, onRequest }: WithdrawButtonProps) {
  const [amount, setAmount] = useState('');
  const [twoFactorConfirmed, setTwoFactorConfirmed] = useState(false);
  const [message, setMessage] = useState<string>();
  const parsedAmount = Number(amount);
  const requiresTwoFactor = parsedAmount >= 5_000;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateWithdrawal({ amount: parsedAmount, twoFactorConfirmed }, summary);
    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }
    void onRequest(parsedAmount, twoFactorConfirmed).then((receipt) => setMessage(receipt.message)).catch((reason: unknown) => {
      setMessage(reason instanceof Error ? reason.message : 'Unable to submit the sandbox withdrawal request.');
    });
  };

  return <section className="wallet-card wallet-card--wide" aria-labelledby="withdraw-title">
    <p className="wallet-kicker">Sandbox withdrawal</p>
    <h2 id="withdraw-title">Withdraw test balance</h2>
    <p className="wallet-sandbox">TEST MODE ONLY · Circle credentials are not configured · no real funds move</p>
    <form className="wallet-withdrawal" onSubmit={submit}>
      <label>Amount (USD)<input aria-label="Withdrawal amount" type="number" min="1" max={summary.limits.monthly} value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
      <p>Limits: $1,000 daily · $5,000 weekly · $20,000 monthly</p>
      <p>KYC and AML verification are required before any withdrawal request.</p>
      {requiresTwoFactor && <label className="wallet-checkbox"><input type="checkbox" checked={twoFactorConfirmed} onChange={(event) => setTwoFactorConfirmed(event.target.checked)} /> I explicitly confirm 2FA approval for this $5,000+ request.</label>}
      <button type="submit">Submit sandbox withdrawal</button>
    </form>
    {message && <p role="status" className="wallet-message">{message}</p>}
  </section>;
}
