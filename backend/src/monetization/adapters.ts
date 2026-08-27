import { randomUUID } from 'node:crypto';
import type {
  ApplicationStatusWatcher,
  CircleUsdcPayoutAdapter,
  FiatToUSDCConverter,
  KycAmlProviderAdapter,
  KycLevel,
  MonetizationStatusTracker,
  YPPAutoApplicator,
} from './contracts.js';

export class SandboxCircleUsdcPayoutAdapter implements CircleUsdcPayoutAdapter {
  readonly performsRealMoneyMovement = false;

  async executeSandboxPayout(): Promise<{ providerReference: string; status: 'SANDBOX_EXECUTED' }> {
    return { providerReference: `sandbox-circle-${randomUUID()}`, status: 'SANDBOX_EXECUTED' };
  }
}

export class SandboxKycAmlProviderAdapter implements KycAmlProviderAdapter {
  constructor(private readonly level: KycLevel = 3) {}

  async getKycLevel(): Promise<KycLevel> {
    return this.level;
  }

  async screenWithdrawal(): Promise<{ cleared: boolean; screeningReference: string }> {
    return { cleared: true, screeningReference: `sandbox-aml-${randomUUID()}` };
  }
}

export class BlockedMonetizationStatusTracker implements MonetizationStatusTracker {
  async getStatus(userId: string): Promise<{ status: 'NOT_CONFIGURED'; userId: string }> {
    return { status: 'NOT_CONFIGURED', userId };
  }
}

export class BlockedYPPAutoApplicator implements YPPAutoApplicator {
  async apply(userId: string): Promise<{ status: 'BLOCKED'; reason: string; userId: string }> {
    return { status: 'BLOCKED', reason: 'External YouTube actions are disabled without verified credentials.', userId };
  }
}

export class BlockedApplicationStatusWatcher implements ApplicationStatusWatcher {
  async getStatus(userId: string): Promise<{ status: 'NOT_CONFIGURED'; userId: string }> {
    return { status: 'NOT_CONFIGURED', userId };
  }
}

export class BlockedFiatToUSDCConverter implements FiatToUSDCConverter {
  async convert(): Promise<{ status: 'BLOCKED'; reason: string }> {
    return { status: 'BLOCKED', reason: 'Fiat conversion is disabled in sandbox mode.' };
  }
}
