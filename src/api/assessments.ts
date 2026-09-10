import { apiFetch, config, mockApiClient } from './client';
import type { AssessReturnRequest, AssessReturnResponse } from './types';

export async function assessReturn(returnId: string, request: AssessReturnRequest): Promise<AssessReturnResponse> {
  if (config.useMock) {
    return mockApiClient.respond({
      assessment_id: `ASM-${returnId}-${Date.now()}`,
      return_id: returnId,
      assessment_at: request.assessment_at,
      status: 'completed',
      risk: null,
      decision: null,
      vision: null
    }, 180);
  }
  return apiFetch<AssessReturnResponse>(`/api/returns/${encodeURIComponent(returnId)}/assess`, {
    method: 'POST', body: JSON.stringify(request)
  });
}
