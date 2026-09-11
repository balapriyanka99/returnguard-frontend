export {
  getReturnDetail,
  getReturnAssessmentHistory,
  getReturnTimelineEvents
} from './returns';

import { apiFetch } from './client';

export async function investigateReturn(
  returnId: string,
  assessmentAt: string | null
): Promise<unknown> {
  return apiFetch(`/api/returns/${encodeURIComponent(returnId)}/investigate`, {
    method: 'POST',
    body: JSON.stringify({
      intent: 'inspection_review',
      ...(assessmentAt ? { assessment_at: assessmentAt } : {})
    })
  });
}
