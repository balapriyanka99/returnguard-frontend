import { config } from './client';
import { DemoLifecycleEvent, DemoLifecycleState } from './types';
import { simulateMockLifecycleEvent } from '../mocks/workflow';

export async function simulateLifecycleEvent(returnId: string, event: DemoLifecycleEvent): Promise<DemoLifecycleState> {
  if (config.useMock) {
    await new Promise((resolve) => setTimeout(resolve, 90));
    return simulateMockLifecycleEvent(returnId, event);
  }
  throw new Error('Demo lifecycle write contract is not available yet.');
}

