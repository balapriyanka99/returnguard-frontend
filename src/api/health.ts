import { apiFetch, config, mockApiClient } from './client';
import type { HealthResponse } from './types';

export function getHealth(): Promise<HealthResponse> {
  if (config.useMock) return mockApiClient.respond({ status: 'ok', service: 'returnguard-api', version: 'mock-contract' });
  return apiFetch<HealthResponse>('/api/health');
}
