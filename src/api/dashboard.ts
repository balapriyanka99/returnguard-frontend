import { config, apiFetch } from './client';
import { DashboardResponse } from './types';
import { mockDashboardData } from '../mocks/dashboard';

export async function getDashboard(): Promise<DashboardResponse> {
  if (config.useMock) {
    // Simulate slight network latency
    await new Promise((res) => setTimeout(res, 80));
    return mockDashboardData;
  }
  return apiFetch<DashboardResponse>('/api/dashboard');
}
