import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { WalletPage } from '../../pages/WalletPage';
import { validateWithdrawal, type WalletSummary } from '../../wallet/types';

const summary: WalletSummary = {
  mode: 'SANDBOX',
  currency: 'USD',
  availableBalance: 900,
  allocation: { grossRevenue: 1_800, creatorAmount: 900, platformAmount: 900, creatorPercent: 50, platformPercent: 50 },
  limits: { daily: 1_000, weekly: 5_000, monthly: 20_000 },
  compliance: { kycComplete: true, amlComplete: true },
  transactions: [{ id: 'allocation-1', createdAt: '2026-08-27T00:00:00Z', type: 'REVENUE_ALLOCATION', amount: 900, status: 'AVAILABLE', description: 'August creator allocation' }],
};

describe('WalletPage', () => {
  it('renders a clearly sandbox-only 50/50 wallet experience', () => {
    const markup = renderToStaticMarkup(<WalletPage initialData={summary} />);

    for (const expected of ['Creator Wallet', 'SANDBOX / TEST MODE', '50/50 creator/platform allocation', 'KYC and AML verification', '$1,000 daily', '$5,000 weekly', '$20,000 monthly', 'August creator allocation']) {
      expect(markup).toContain(expected);
    }
  });

  it('requires an explicit 2FA confirmation for requests of $5,000 or more', () => {
    expect(validateWithdrawal({ amount: 5_000, twoFactorConfirmed: false }, summary)).toEqual({
      valid: false,
      message: 'Confirm your 2FA approval for withdrawal requests of $5,000 or more.',
    });
    expect(validateWithdrawal({ amount: 900, twoFactorConfirmed: false }, summary)).toEqual({ valid: true });
  });

  it('enforces compliance and daily balance limits before calling the API', () => {
    expect(validateWithdrawal({ amount: 1_001, twoFactorConfirmed: true }, summary).valid).toBe(false);
    expect(validateWithdrawal({ amount: 10, twoFactorConfirmed: false }, { ...summary, compliance: { kycComplete: false, amlComplete: true } }).message).toContain('KYC and AML');
  });
});
