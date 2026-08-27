import { randomUUID } from 'node:crypto';
import { PlatformError } from '../shared/errors.js';
import {
  SandboxCircleUsdcPayoutAdapter,
  SandboxKycAmlProviderAdapter,
} from './adapters.js';
import type {
  CircleUsdcPayoutAdapter,
  KycAmlProviderAdapter,
  RevenueAllocation,
  WithdrawalAuditEvent,
  WithdrawalManager,
  WithdrawalRecord,
  WithdrawalRequestInput,
} from './contracts.js';

const DAILY_LIMIT_CENTS = 100_000;
const WEEKLY_LIMIT_CENTS = 500_000;
const MONTHLY_LIMIT_CENTS = 2_000_000;
const TWO_FACTOR_THRESHOLD_CENTS = 500_000;
const TEST_BALANCE_CENTS = 1_250_000;

let withdrawals: WithdrawalRecord[] = [];
let auditEvents: WithdrawalAuditEvent[] = [];

function periodStart(period: 'day' | 'week' | 'month', now: Date): number {
  const date = new Date(now);
  date.setUTCHours(0, 0, 0, 0);
  if (period === 'week') date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  if (period === 'month') date.setUTCDate(1);
  return date.getTime();
}

export function resetMonetizationStore(): void {
  withdrawals = [];
  auditEvents = [];
}

export class RevenueAutoDistributor {
  distribute(grossUsdCents: number): RevenueAllocation {
    if (!Number.isSafeInteger(grossUsdCents) || grossUsdCents < 0) {
      throw new PlatformError(400, 'INVALID_AMOUNT', 'Revenue must be a non-negative whole number of cents.');
    }
    const creatorUsdCents = Math.floor(grossUsdCents / 2);
    return { grossUsdCents, creatorUsdCents, platformUsdCents: grossUsdCents - creatorUsdCents };
  }
}

export class MonetizationService implements WithdrawalManager {
  constructor(
    private readonly payoutAdapter: CircleUsdcPayoutAdapter = new SandboxCircleUsdcPayoutAdapter(),
    private readonly complianceAdapter: KycAmlProviderAdapter = new SandboxKycAmlProviderAdapter(),
  ) {}

  async status(userId: string): Promise<object> {
    const kycLevel = await this.complianceAdapter.getKycLevel(userId);
    const completedCents = withdrawals
      .filter((withdrawal) => withdrawal.userId === userId && withdrawal.status === 'SANDBOX_EXECUTED')
      .reduce((total, withdrawal) => total + withdrawal.amountUsdCents, 0);
    return {
      mode: 'SANDBOX_ONLY',
      realMoneyMovementEnabled: false,
      currency: 'USDC',
      testBalanceUsdCents: Math.max(0, TEST_BALANCE_CENTS - completedCents),
      kycLevel,
      limitsUsdCents: { daily: DAILY_LIMIT_CENTS, weekly: WEEKLY_LIMIT_CENTS, monthly: MONTHLY_LIMIT_CENTS },
    };
  }

  history(userId: string): readonly WithdrawalRecord[] {
    return withdrawals.filter((withdrawal) => withdrawal.userId === userId);
  }

  audits(userId: string): readonly WithdrawalAuditEvent[] {
    const withdrawalIds = new Set(this.history(userId).map((withdrawal) => withdrawal.id));
    return auditEvents.filter((event) => withdrawalIds.has(event.withdrawalId));
  }

  async request(input: WithdrawalRequestInput): Promise<WithdrawalRecord> {
    const withdrawalId = randomUUID();
    const createdAt = new Date().toISOString();
    const block = (reason: string): WithdrawalRecord => {
      const record: WithdrawalRecord = {
        id: withdrawalId, userId: input.userId, amountUsdCents: input.amountUsdCents,
        destinationAddress: input.destinationAddress, status: 'BLOCKED', decision: 'BLOCKED', reason, createdAt,
      };
      withdrawals.unshift(record);
      this.audit(record, 'WITHDRAWAL_DECISION', { reason, approved: false });
      return record;
    };

    if (!Number.isSafeInteger(input.amountUsdCents) || input.amountUsdCents <= 0) return block('Amount must be a positive whole number of USD cents.');
    if (!/^0x[a-fA-F0-9]{40}$/.test(input.destinationAddress)) return block('A valid USDC-compatible destination address is required.');
    const kycLevel = await this.complianceAdapter.getKycLevel(input.userId);
    if (kycLevel < 1) return block('KYC level 1 or higher is required for withdrawals.');
    if (input.amountUsdCents >= TWO_FACTOR_THRESHOLD_CENTS && !input.twoFactorConfirmed) return block('Two-factor confirmation is required for withdrawals of $5,000 or more.');
    if (input.amountUsdCents > (await this.status(input.userId) as { testBalanceUsdCents: number }).testBalanceUsdCents) return block('Insufficient sandbox wallet balance.');
    const now = Date.now();
    for (const [period, limit] of [['day', DAILY_LIMIT_CENTS], ['week', WEEKLY_LIMIT_CENTS], ['month', MONTHLY_LIMIT_CENTS]] as const) {
      const used = withdrawals.filter((item) => item.userId === input.userId && item.status === 'SANDBOX_EXECUTED' && new Date(item.createdAt).getTime() >= periodStart(period, new Date(now))).reduce((total, item) => total + item.amountUsdCents, 0);
      if (used + input.amountUsdCents > limit) return block(`The ${period} withdrawal limit would be exceeded.`);
    }
    const screening = await this.complianceAdapter.screenWithdrawal({ userId: input.userId, withdrawalId, amountUsdCents: input.amountUsdCents });
    if (!screening.cleared) return block('Mandatory AML screening did not clear this withdrawal.');

    const payout = await this.payoutAdapter.executeSandboxPayout({ withdrawalId, userId: input.userId, amountUsdCents: input.amountUsdCents, destinationAddress: input.destinationAddress });
    const record: WithdrawalRecord = {
      id: withdrawalId, userId: input.userId, amountUsdCents: input.amountUsdCents, destinationAddress: input.destinationAddress,
      status: payout.status, decision: 'APPROVED', providerReference: payout.providerReference,
      amlScreeningReference: screening.screeningReference, createdAt,
    };
    withdrawals.unshift(record);
    this.audit(record, 'WITHDRAWAL_DECISION', { approved: true, kycLevel, amlScreened: true });
    this.audit(record, 'WITHDRAWAL_EXECUTION', { sandbox: true, realMoneyMovement: this.payoutAdapter.performsRealMoneyMovement });
    return record;
  }

  private audit(record: WithdrawalRecord, type: WithdrawalAuditEvent['type'], details: WithdrawalAuditEvent['details']): void {
    auditEvents.unshift({ id: randomUUID(), withdrawalId: record.id, type, decision: record.decision, occurredAt: new Date().toISOString(), details });
  }
}
