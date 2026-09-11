import { useState } from 'react';
import { ArrowRight, Box, Truck } from 'lucide-react';
import { DemoLifecycleEvent } from '../../api/types';
import { simulateLifecycleEvent } from '../../api/workflow';
import { getMockLifecycle } from '../../mocks/workflow';

export function DemoLifecycleControls({ returnId, onUpdated, onOpenInspection }: { returnId: string; onUpdated: () => void; onOpenInspection: () => void }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const state = getMockLifecycle(returnId);
  const run = async (event: DemoLifecycleEvent) => {
    setBusy(true); setMessage('');
    try { await simulateLifecycleEvent(returnId, event); setMessage('Demo lifecycle event recorded.'); onUpdated(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Lifecycle event unavailable.'); }
    finally { setBusy(false); }
  };
  return <section className="lifecycle-panel"><div className="manual-review-heading"><div><span className="eyebrow">Integration simulator</span><h2>Demo Lifecycle Controls</h2><p>These controls simulate events normally received from ecommerce, logistics, and warehouse systems.</p></div><ArrowRight size={22}/></div><div className="lifecycle-status"><span>Current workflow state</span><strong>{state?.status || 'Requested'}</strong></div><div className="lifecycle-actions"><button className="rg-btn-secondary" disabled={busy || state?.status === 'In Transit' || state?.status === 'Awaiting Physical Inspection'} onClick={() => run('pickup_complete')}><Truck size={14}/>Simulate Pickup Complete</button><button className="rg-btn-secondary" disabled={busy || state?.status !== 'In Transit'} onClick={() => run('warehouse_received')}><Box size={14}/>Simulate Warehouse Received</button><button className="rg-btn-primary" onClick={onOpenInspection}><Box size={14}/>Open Physical Inspection</button></div>{message && <div className="review-state">{message}</div>}</section>;
}

