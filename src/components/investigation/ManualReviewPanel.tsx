import { useState } from 'react';
import { CheckCircle2, ClipboardCheck, FilePlus2, MessageSquare, ShieldAlert, XCircle } from 'lucide-react';
import { ManualReviewAction, RiskData, DecisionData } from '../../api/types';
import { submitManualReviewAction } from '../../api/manualReview';
import { getMockManualReview } from '../../mocks/workflow';

interface Props {
  returnId: string;
  eligible: boolean;
  risk: RiskData | null;
  decision: DecisionData | null;
  evidenceCoverage?: string;
  limitations: string[];
  onSubmitted: () => void;
}

export function ManualReviewPanel({ returnId, eligible, risk, decision, evidenceCoverage, limitations, onSubmitted }: Props) {
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const existing = getMockManualReview(returnId);
  if (!eligible && !existing) return null;
  const actions: Array<{ id: ManualReviewAction; label: string; className: string; icon: typeof CheckCircle2 }> = [
    { id: 'APPROVE', label: 'Approve', className: 'review-action-positive', icon: CheckCircle2 },
    { id: 'REJECT', label: 'Reject', className: 'review-action-danger', icon: XCircle },
    { id: 'REQUEST_MORE_EVIDENCE', label: 'Request More Evidence', className: 'review-action-warning', icon: FilePlus2 },
    { id: 'REQUIRE_PHYSICAL_INSPECTION', label: 'Require Physical Inspection', className: 'review-action-inspection', icon: ClipboardCheck },
    { id: 'ESCALATE', label: 'Escalate', className: 'review-action-escalate', icon: ShieldAlert }
  ];
  const submit = async (action: ManualReviewAction) => {
    setBusy(true);
    setMessage('');
    try {
      await submitManualReviewAction(returnId, action, notes || undefined);
      setMessage(action.replaceAll('_', ' ') + ' recorded in mock review state. Risk and decision values were not changed.');
      onSubmitted();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Review action unavailable.');
    } finally {
      setBusy(false);
    }
  };

  return <section className="manual-review-panel">
    <div className="manual-review-banner"><ShieldAlert size={22}/><div><span>Manual Review Required</span><p>A human decision is required for this return.</p></div></div>
    <div className="manual-review-metrics">
      <div><span>Current Risk</span><strong className={risk ? 'risk-text-' + risk.band : ''}>{risk ? String(risk.score) + ' ' + risk.band.toUpperCase() : 'UNDETERMINED'}</strong></div>
      <div><span>Evidence Coverage</span><strong>{evidenceCoverage?.toUpperCase() || 'UNAVAILABLE'}</strong></div>
      <div className="review-recommendation"><span>Recommended Action</span><strong>{decision?.recommended_action?.replaceAll('_', ' ') || 'Decision pending'}</strong></div>
    </div>
    {limitations.length > 0 && <div className="review-reason"><MessageSquare size={15}/><div><strong>Reasoning and limitations</strong><ul>{limitations.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></div></div>}
    <label className="review-notes"><span>Reviewer Notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Record the evidence reviewed and rationale for the decision…" aria-label="Reviewer notes"/></label>
    <div className="review-decision-heading">Reviewer Decision</div>
    <div className="review-actions">{actions.map(({ id, label, className, icon: Icon }) => <button key={id} disabled={busy} className={className} onClick={() => submit(id)}><Icon size={18}/><span>{label}</span></button>)}</div>
    {(message || existing) && <div className="review-state">{message || 'Last mock action: ' + existing?.action.replaceAll('_', ' ')}</div>}
  </section>;
}
