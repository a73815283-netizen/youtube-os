import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { RevenueAutoDistributor, resetMonetizationStore } from '../monetization/monetization-service.js';

const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5433/youtube_os' });
const auth = { Authorization: 'Bearer test-token' };
const walletAddress = '0x1234567890123456789012345678901234567890';

describe('sandbox monetization', () => {
  beforeEach(() => resetMonetizationStore());

  it('keeps wallet status sandboxed with a test balance', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/monetization/status', headers: auth });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({ mode: 'SANDBOX_ONLY', realMoneyMovementEnabled: false, testBalanceUsdCents: 1_250_000, kycLevel: 3 });
    await app.close();
  });

  it('screens, records, and sandbox-executes an eligible withdrawal', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({
      method: 'POST', url: '/api/v1/monetization/withdrawals', headers: auth,
      payload: { amountUsdCents: 100_000, destinationAddress: walletAddress, twoFactorConfirmed: false },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({ decision: 'APPROVED', status: 'SANDBOX_EXECUTED', amlScreeningReference: expect.stringMatching(/^sandbox-aml-/) });
    const history = await app.inject({ method: 'GET', url: '/api/v1/monetization/withdrawals', headers: auth });
    expect(history.json().data.auditEvents.map((event: { type: string }) => event.type)).toEqual(expect.arrayContaining(['WITHDRAWAL_DECISION', 'WITHDRAWAL_EXECUTION']));
    await app.close();
  });

  it('blocks a $5,000 withdrawal without two-factor confirmation and audits the decision', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({
      method: 'POST', url: '/api/v1/monetization/withdrawals', headers: auth,
      payload: { amountUsdCents: 500_000, destinationAddress: walletAddress, twoFactorConfirmed: false },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({ decision: 'BLOCKED', status: 'BLOCKED' });
    const history = await app.inject({ method: 'GET', url: '/api/v1/monetization/withdrawals', headers: auth });
    expect(history.json().data.auditEvents).toHaveLength(1);
    await app.close();
  });

  it('enforces a $1,000 daily withdrawal limit', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    await app.inject({
      method: 'POST', url: '/api/v1/monetization/withdrawals', headers: auth,
      payload: { amountUsdCents: 100_000, destinationAddress: walletAddress, twoFactorConfirmed: false },
    });
    const response = await app.inject({
      method: 'POST', url: '/api/v1/monetization/withdrawals', headers: auth,
      payload: { amountUsdCents: 1, destinationAddress: walletAddress, twoFactorConfirmed: false },
    });
    expect(response.json().data).toMatchObject({ status: 'BLOCKED', reason: expect.stringContaining('day') });
    await app.close();
  });

  it('splits revenue equally while preserving an odd cent', () => {
    expect(new RevenueAutoDistributor().distribute(101)).toEqual({
      grossUsdCents: 101, creatorUsdCents: 50, platformUsdCents: 51,
    });
  });
});
