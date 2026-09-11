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
import { getMockInspection, getMockLifecycle, getMockTimelineEvents } from '../mocks/workflow';

export async function getReturns(params?: ReturnsFilterParams): Promise<ReturnsListResponse> {
  if (config.useMock) {
    await new Promise((res) => setTimeout(res, 80));
    let items = mockReturnsList.map((item) => {
      const lifecycle = getMockLifecycle(item.return_id);
      const scoredHistory = (mockAssessmentHistoryMap[item.return_id]?.items || []).filter((point) => point.risk);
      const previousRisk = scoredHistory.length > 1 ? scoredHistory[scoredHistory.length - 2].risk : null;
      return {
        ...item,
        ...(lifecycle ? { status: lifecycle.status } : {}),
        previous_risk: previousRisk
      };
    });

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
      const lifecycle = getMockLifecycle(returnId);
      const savedInspection = getMockInspection(returnId);
      return {
        ...found,
        return: lifecycle ? { ...found.return, status: lifecycle.status } : found.return,
        inspection: savedInspection?.inspection || found.inspection
      };
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
      const savedInspection = getMockInspection(returnId);
      if (savedInspection && !history.items.some((item) => item.stage === 'inspection')) {
        return {
          items: [...history.items, {
            assessment_id: `mock-inspection-assessment-${returnId}`,
            assessment_at: savedInspection.inspection.inspected_at,
            stage: 'inspection',
            stage_label: 'Physical inspection',
            risk: null,
            decision: null
          }]
        };
      }
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
    return [...(mockTimelineEventsMap[returnId] || []), ...getMockTimelineEvents(returnId)];
  }

  return apiFetch<TimelineEvent[]>(
    `/api/returns/${encodeURIComponent(returnId)}/timeline`
  );
}
