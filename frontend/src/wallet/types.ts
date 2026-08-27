export interface RevenueAllocation {
  grossRevenue: number;
  creatorAmount: number;
  platformAmount: number;
  creatorPercent: 50;
  platformPercent: 50;
}

export interface WithdrawalLimits {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface ComplianceStatus {
  kycComplete: boolean;
  amlComplete: boolean;
}

export interface WalletTransaction {
  id: string;
  createdAt: string;
  type: 'REVENUE_ALLOCATION' | 'WITHDRAWAL_REQUEST';
  amount: number;
  status: 'AVAILABLE' | 'PENDING' | 'SIMULATED';
  description: string;
}

export interface WalletSummary {
  mode: 'SANDBOX';
  currency: 'USD';
  availableBalance: number;
  allocation: RevenueAllocation;
  limits: WithdrawalLimits;
  compliance: ComplianceStatus;
  transactions: readonly WalletTransaction[];
}

export interface WithdrawalRequest {
  amount: number;
  twoFactorConfirmed: boolean;
}

export interface WithdrawalReceipt {
  id: string;
  status: 'SIMULATED';
  message: string;
}

export interface WalletClient {
  getSummary(signal?: AbortSignal): Promise<WalletSummary>;
  requestWithdrawal(input: WithdrawalRequest, signal?: AbortSignal): Promise<WithdrawalReceipt>;
}

export interface WithdrawalValidation {
  valid: boolean;
  message?: string;
}

export function validateWithdrawal(
  input: WithdrawalRequest,
  summary: Pick<WalletSummary, 'availableBalance' | 'limits' | 'compliance'>,
): WithdrawalValidation {
  if (!summary.compliance.kycComplete || !summary.compliance.amlComplete) {
    return { valid: false, message: 'KYC and AML verification are required before requesting a withdrawal.' };
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { valid: false, message: 'Enter a withdrawal amount greater than $0.' };
  }
  if (input.amount >= 5_000 && !input.twoFactorConfirmed) {
    return { valid: false, message: 'Confirm your 2FA approval for withdrawal requests of $5,000 or more.' };
  }
  if (input.amount > summary.availableBalance) {
    return { valid: false, message: 'The requested amount exceeds your available sandbox balance.' };
  }
  if (input.amount > summary.limits.daily) {
    return { valid: false, message: `The daily withdrawal limit is $${summary.limits.daily.toLocaleString()}.` };
  }
  return { valid: true };
}
