import type { WalletClient, WalletSummary, WithdrawalReceipt, WithdrawalRequest } from './types';

interface ApiEnvelope<T> {
  data: T;
}

export class HttpWalletClient implements WalletClient {
  constructor(
    private readonly baseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim() || '/api/v1',
    private readonly token = typeof window === 'undefined' ? '' : window.localStorage.getItem('accessToken') ?? '',
  ) {}

  private async request<T>(path: string, init: RequestInit, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Wallet API returned ${response.status} for ${path}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  getSummary(signal?: AbortSignal): Promise<WalletSummary> {
    return this.request<WalletSummary>('/wallet/summary', { method: 'GET' }, signal);
  }

  requestWithdrawal(input: WithdrawalRequest, signal?: AbortSignal): Promise<WithdrawalReceipt> {
    return this.request<WithdrawalReceipt>('/wallet/withdrawals', { method: 'POST', body: JSON.stringify(input) }, signal);
  }
}

export function createWalletClient(): WalletClient {
  return new HttpWalletClient();
}
