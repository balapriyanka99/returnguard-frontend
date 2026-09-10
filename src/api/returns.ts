import { config, apiFetch } from './client';
import {
  ReturnsListResponse,
  ReturnsFilterParams,
  ReturnDetailResponse,
  AssessmentHistoryResponse,
  TimelineEvent
} from './types';
import {
  mockReturnsList,
  mockInvestigationMap,
  mockAssessmentHistoryMap,
  mockTimelineEventsMap
} from '../mocks';

export async function getReturns(params?: ReturnsFilterParams): Promise<ReturnsListResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 80));
    let items = [...mockReturnsList];

    if (params?.source_type) {
      items = items.filter((item) => item.source_type === params.source_type);
    }
    if (params?.risk_band) {
      items = items.filter((item) => item.risk?.band === params.risk_band);
    }
    if (params?.status) {
      items = items.filter((item) =>
        item.status.toLowerCase().includes(params.status!.toLowerCase())
      );
    }

    return {
      items,
      total: items.length,
      limit: params?.limit || 25,
      offset: params?.offset || 0
    };
  }

  const query = new URLSearchParams();
  if (params?.source_type) query.set('source_type', params.source_type);
  if (params?.status) query.set('status', params.status);
  if (params?.risk_band) query.set('risk_band', params.risk_band);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));

  const qs = query.toString() ? `?${query.toString()}` : '';
  return apiFetch<ReturnsListResponse>(`/api/returns${qs}`);
}

export async function getReturnDetail(returnId: string): Promise<ReturnDetailResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 100));
    const found = mockInvestigationMap[returnId];
    if (found) {
      return found;
    }
    throw new Error(`Return ${returnId} was not found`);
  }

  return apiFetch<ReturnDetailResponse>(`/api/returns/${encodeURIComponent(returnId)}`);
}

export async function getReturnAssessmentHistory(
  returnId: string
): Promise<AssessmentHistoryResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 60));
    const history = mockAssessmentHistoryMap[returnId];
    if (history) {
      return history;
    }
    return { items: [] };
  }

  return apiFetch<AssessmentHistoryResponse>(
    `/api/returns/${encodeURIComponent(returnId)}/assessments`
  );
}

export async function getReturnTimelineEvents(
  returnId: string
): Promise<TimelineEvent[]> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 60));
    return mockTimelineEventsMap[returnId] || [];
  }

  // No timeline endpoint is present in the coordination contract yet.
  return [];
}
