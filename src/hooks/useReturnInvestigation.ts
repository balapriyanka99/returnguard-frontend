import { useState, useEffect, useCallback } from 'react';
import {
  ReturnDetailResponse,
  AssessmentHistoryResponse,
  TimelineEvent
} from '../api/types';
import {
  getReturnDetail,
  getReturnAssessmentHistory,
  getReturnTimelineEvents,
  investigateReturn
} from '../api/investigations';

export function useReturnInvestigation(returnId: string) {
  const [detail, setDetail] = useState<ReturnDetailResponse | null>(null);
  const [history, setHistory] = useState<AssessmentHistoryResponse | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [investigating, setInvestigating] = useState(false);

  const fetchData = useCallback(async () => {
    if (!returnId) return;
    setLoading(true);
    setError(null);
    try {
      const [detailRes, historyRes, timelineRes] = await Promise.all([
        getReturnDetail(returnId),
        getReturnAssessmentHistory(returnId),
        getReturnTimelineEvents(returnId)
      ]);
      setDetail(detailRes);
      setHistory(historyRes);
      setTimeline(timelineRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch return investigation details');
    } finally {
      setLoading(false);
    }
  }, [returnId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const investigate = useCallback(async () => {
    if (!detail) return;
    setInvestigating(true);
    setError(null);
    try {
      await investigateReturn(returnId, detail.return.assessment_at);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Investigation failed');
    } finally {
      setInvestigating(false);
    }
  }, [detail, fetchData, returnId]);

  return {
    detail,
    history,
    timeline,
    loading,
    error,
    refresh: fetchData,
    investigate,
    investigating
  };
}
