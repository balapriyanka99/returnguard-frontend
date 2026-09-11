import {
  DemoLifecycleEvent,
  DemoLifecycleState,
  InspectionDraft,
  InspectionData,
  ManualReviewAction,
  ManualReviewState,
  TimelineEvent
} from '../api/types';

const inspectionState: Record<string, InspectionDraft> = {};
const lifecycleState: Record<string, DemoLifecycleState> = {};
const reviewState: Record<string, ManualReviewState> = {};

const storageKey = 'returnguard.mock.workflow.v1';

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ inspectionState, lifecycleState, reviewState }));
  } catch {
    // Mock persistence is best effort; the in-memory state remains usable.
  }
}

function hydrate() {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<typeof stateSnapshot>;
    Object.assign(inspectionState, parsed.inspectionState || {});
    Object.assign(lifecycleState, parsed.lifecycleState || {});
    Object.assign(reviewState, parsed.reviewState || {});
  } catch {
    // Ignore malformed browser-local mock state.
  }
}

const stateSnapshot = { inspectionState, lifecycleState, reviewState };
hydrate();

export function getMockInspection(returnId: string): InspectionDraft | null {
  return inspectionState[returnId] || null;
}

export function saveMockInspection(returnId: string, draft: InspectionDraft): InspectionDraft {
  const now = draft.inspection.inspected_at || new Date().toISOString();
  const savedDraft = { ...draft, inspection: { ...draft.inspection, inspected_at: now } };
  inspectionState[returnId] = savedDraft;
  const events = lifecycleState[returnId]?.events || [];
  const event: TimelineEvent = {
    id: `mock-inspection-${returnId}-${Date.now()}`,
    title: 'Physical inspection submitted',
    timestamp: now,
    facts: [
      `Item present: ${draft.inspection.item_present ? 'Yes' : 'No'}`,
      `Condition: ${draft.inspection.condition || 'Not recorded'}`
    ],
    source_indicator: 'Demo Inspection Form',
    severity: 'normal'
  };
  lifecycleState[returnId] = {
    status: 'Inspection Complete · Under Review',
    updated_at: now,
    events: [...events.filter((item) => item.title !== event.title), event]
  };
  persist();
  return savedDraft;
}

export function getMockLifecycle(returnId: string): DemoLifecycleState | null {
  return lifecycleState[returnId] || null;
}

export function simulateMockLifecycleEvent(returnId: string, event: DemoLifecycleEvent): DemoLifecycleState {
  const now = new Date().toISOString();
  const current = lifecycleState[returnId];
  if (event === 'warehouse_received' && current?.status !== 'Pickup Complete') {
    throw new Error('Pickup must be completed before warehouse receipt can be recorded.');
  }
  const status = event === 'pickup_complete' ? 'Pickup Complete' : 'Warehouse Received';
  const title = event === 'pickup_complete' ? 'Pickup completed' : 'Warehouse received';
  const timelineEvent: TimelineEvent = {
    id: `mock-lifecycle-${returnId}-${event}-${Date.now()}`,
    title,
    timestamp: now,
    facts: [],
    source_indicator: 'Demo Lifecycle Simulator',
    severity: 'normal'
  };
  lifecycleState[returnId] = {
    status,
    updated_at: now,
    events: [...(current?.events || []), timelineEvent]
  };
  persist();
  return lifecycleState[returnId];
}

export function getMockTimelineEvents(returnId: string): TimelineEvent[] {
  return lifecycleState[returnId]?.events || [];
}

export function getMockManualReview(returnId: string): ManualReviewState | null {
  return reviewState[returnId] || null;
}

export function saveMockManualReview(returnId: string, action: ManualReviewAction, notes?: string): ManualReviewState {
  const state = { action, notes, updated_at: new Date().toISOString() };
  reviewState[returnId] = state;
  persist();
  return state;
}

export function clearMockWorkflowState() {
  Object.keys(inspectionState).forEach((key) => delete inspectionState[key]);
  Object.keys(lifecycleState).forEach((key) => delete lifecycleState[key]);
  Object.keys(reviewState).forEach((key) => delete reviewState[key]);
  persist();
}

export type { InspectionData };
