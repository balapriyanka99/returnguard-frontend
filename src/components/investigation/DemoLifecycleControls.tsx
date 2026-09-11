import { useState } from 'react';
import { ArrowRight, Box, ClipboardCheck, Truck } from 'lucide-react';
import { DemoLifecycleEvent } from '../../api/types';
import { simulateLifecycleEvent } from '../../api/workflow';

export function DemoLifecycleControls({ returnId, currentStatus, onUpdated, onOpenInspection }: { returnId: string; currentStatus: string; onUpdated: () => void; onOpenInspection: () => void }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const normalizedStatus = currentStatus.toLowerCase();
  const pickupComplete = normalizedStatus.includes('in transit') || normalizedStatus.includes('pickup complete');
  const warehouseReceived = normalizedStatus.includes('awaiting physical inspection') || normalizedStatus.includes('warehouse received');
  const inspectionComplete = normalizedStatus.includes('under review') || normalizedStatus.includes('inspection complete');
  const run = async (event: DemoLifecycleEvent) => {
    setBusy(true); setMessage('');
    try { await simulateLifecycleEvent(returnId, event); setMessage(event === 'pickup_complete' ? 'Pickup event saved.' : 'Warehouse receipt saved.'); await Promise.resolve(onUpdated()); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Lifecycle event unavailable.'); }
    finally { setBusy(false); }
  };
  return <section className="lifecycle-panel"><div className="manual-review-heading"><div><span className="eyebrow">Integration simulator</span><h2>Demo Lifecycle</h2><p>These controls simulate events that would normally arrive from ecommerce, logistics, and warehouse systems.</p></div><ArrowRight size={22}/></div><div className="lifecycle-status"><span>Current lifecycle stage</span><strong>{currentStatus}</strong></div><div className="lifecycle-actions">
    {!pickupComplete && !warehouseReceived && !inspectionComplete && <button className="rg-btn-primary" disabled={busy} onClick={() => run('pickup_complete')}><Truck size={15}/>{busy ? 'Saving pickup…' : 'Fast-forward Pickup'}</button>}
    {pickupComplete && !warehouseReceived && <button className="rg-btn-primary" disabled={busy} onClick={() => run('warehouse_received')}><Box size={15}/>{busy ? 'Saving receipt…' : 'Fast-forward Warehouse Received'}</button>}
    {warehouseReceived && !inspectionComplete && <button className="rg-btn-primary" disabled={busy} onClick={onOpenInspection}><Box size={15}/>Complete Physical Inspection</button>}
    {inspectionComplete && <span className="lifecycle-complete"><ClipboardCheck size={15}/>Physical inspection submitted</span>}
  </div>{message && <div className="review-state" role="status">{message}</div>}</section>;
}
