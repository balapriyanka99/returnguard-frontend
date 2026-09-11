import { config } from './client';
import { ManualReviewAction, ManualReviewState } from './types';
import { saveMockManualReview } from '../mocks/workflow';

export async function submitManualReviewAction(
  returnId: string,
  action: ManualReviewAction,
  notes?: string
): Promise<ManualReviewState> {
  if (config.useMock) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return saveMockManualReview(returnId, action, notes);
  }
  throw new Error('Manual review action contract is not available yet.');
}

