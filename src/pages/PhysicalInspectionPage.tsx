import { ClipboardCheck } from 'lucide-react';
import { useReturnInvestigation } from '../hooks/useReturnInvestigation';
import { InvestigationHeader } from '../components/investigation/InvestigationHeader';
import { PhysicalInspectionPanel } from '../components/investigation/PhysicalInspectionPanel';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

export function PhysicalInspectionPage({ returnId, onBack }: { returnId: string; onBack: () => void }) {
  const { detail, loading, error, refresh } = useReturnInvestigation(returnId);

  if (loading) return <LoadingState message={'Loading physical inspection for ' + returnId + '…'}/>;
  if (error || !detail) return <ErrorState title="Unable to load physical inspection" message={error || 'Return not found'} onRetry={refresh}/>;
  if (detail.source_type !== 'source_backed') {
    return <div className="page-stack"><button className="case-back" onClick={onBack}>Back to investigation</button><div className="inspection-route-unavailable"><ClipboardCheck size={24}/><strong>Inspection entry unavailable</strong><p>Controlled Demo scenarios are read-only. Physical inspection entry is available only for source-backed returns.</p></div></div>;
  }
  const lifecycleStatus = detail.return.status.toLowerCase();
  const inspectionReady = detail.inspection?.available || lifecycleStatus.includes('warehouse received') || lifecycleStatus.includes('awaiting physical inspection') || lifecycleStatus.includes('under review');
  if (!inspectionReady) {
    return <div className="page-stack"><button className="case-back" onClick={onBack}>Back to investigation</button><div className="inspection-route-unavailable"><ClipboardCheck size={24}/><strong>Warehouse receipt required</strong><p>Complete the source-backed pickup and warehouse-received lifecycle steps before recording a physical inspection.</p></div></div>;
  }

  return <div className="inspection-page page-stack">
    <InvestigationHeader data={detail} onBack={onBack} backLabel="Back to investigation"/>
    <section className="inspection-route-heading"><span><ClipboardCheck size={19}/></span><div><div className="eyebrow">Source-backed · {detail.return.status}</div><h2>Physical Inspection Entry</h2><p>Record warehouse-provided inspection facts. ReturnGuard does not generate risk or decision values in the browser.</p></div></section>
    <PhysicalInspectionPanel returnId={detail.return_id} inspection={detail.inspection} editable initiallyOpen onSaved={async () => { await refresh(); onBack(); }}/>
  </div>;
}
