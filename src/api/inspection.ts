import { config } from './client';
import { InspectionDraft } from './types';
import { saveMockInspection } from '../mocks/workflow';

export async function saveInspection(returnId: string, draft: InspectionDraft): Promise<InspectionDraft> {
  if (config.useMock) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return saveMockInspection(returnId, draft);
  }
  throw new Error('Physical inspection submission is unavailable in real API mode because no FastAPI inspection write contract is currently defined.');
}
