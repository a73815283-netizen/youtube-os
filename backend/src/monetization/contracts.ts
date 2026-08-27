export type KycLevel = 0 | 1 | 2 | 3;
export type WithdrawalStatus = 'SANDBOX_EXECUTED' | 'BLOCKED';
export type WithdrawalDecision = 'APPROVED' | 'BLOCKED';

export interface CircleUsdcPayoutAdapter {
  readonly performsRealMoneyMovement: boolean;
  executeSandboxPayout(input: {
    withdrawalId: string;
    userId: string;
    amountUsdCents: number;
    destinationAddress: string;
  }): Promise<{ providerReference: string; status: 'SANDBOX_EXECUTED' }>;
}

export interface KycAmlProviderAdapter {
  getKycLevel(userId: string): Promise<KycLevel>;
  screenWithdrawal(input: {
    userId: string;
    withdrawalId: string;
    amountUsdCents: number;
  }): Promise<{ cleared: boolean; screeningReference: string }>;
}

export interface RevenueAllocation {
  grossUsdCents: number;
  creatorUsdCents: number;
  platformUsdCents: number;
}

export interface MonetizationStatusTracker {
  getStatus(userId: string): Promise<{ status: 'NOT_CONFIGURED'; userId: string }>;
}

export interface YPPAutoApplicator {
  apply(userId: string): Promise<{ status: 'BLOCKED'; reason: string; userId: string }>;
}

export interface ApplicationStatusWatcher {
  getStatus(userId: string): Promise<{ status: 'NOT_CONFIGURED'; userId: string }>;
}

export interface FiatToUSDCConverter {
  convert(input: { amountUsdCents: number }): Promise<{ status: 'BLOCKED'; reason: string }>;
}

export interface WithdrawalManager {
  request(input: WithdrawalRequestInput): Promise<WithdrawalRecord>;
}

export interface WithdrawalRequestInput {
  userId: string;
  amountUsdCents: number;
  destinationAddress: string;
  twoFactorConfirmed: boolean;
}

export interface WithdrawalRecord {
  id: string;
  userId: string;
  amountUsdCents: number;
  destinationAddress: string;
  status: WithdrawalStatus;
  decision: WithdrawalDecision;
  reason?: string;
  providerReference?: string;
  amlScreeningReference?: string;
  createdAt: string;
}

export interface WithdrawalAuditEvent {
  id: string;
  withdrawalId: string;
  type: 'WITHDRAWAL_DECISION' | 'WITHDRAWAL_EXECUTION';
  decision: WithdrawalDecision;
  occurredAt: string;
  details: Readonly<Record<string, string | number | boolean>>;
}
