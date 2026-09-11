import { Banknote, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { ReturnDetailResponse } from '../../api/types';
import { formatCurrency } from '../../utils/formatters';

const formatAction = (action: string) => action.replaceAll('_', ' ');

export function DecisionExplanation({ detail }: { detail: ReturnDetailResponse }) {
  const finalCase = Boolean(detail.decision) && /completed|approved|rejected|escalated/i.test(detail.return.status);
  if (!finalCase || !detail.decision) return null;

  const action = detail.decision.recommended_action;
  const signals = detail.risk?.signal_contributions || [];
  const strongestSignal = signals[0];
  const mitigating = detail.decision.mitigating_context || [];
  const limitations = Array.from(new Set([...(detail.risk?.limitations || []), ...detail.decision.limitations, ...detail.limitations]));
  const factors = [
    ...signals.slice(0, 3).map((signal) => signal.contribution_pct === undefined ? signal.name : `${signal.name} · ${signal.contribution_pct}%`),
    ...(detail.risk?.patterns || []).slice(0, 2)
  ];

  const narrative: string[] = [];
  if (detail.risk) narrative.push(`The final suspiciousness assessment was ${detail.risk.score}, in the ${detail.risk.band.toUpperCase()} band.`);
  if (strongestSignal) {
    const contribution = strongestSignal.contribution_pct === undefined ? '' : ` and contributed ${strongestSignal.contribution_pct}% of the assessment`;
    narrative.push(`${strongestSignal.name} was the strongest returned signal${contribution}. ${strongestSignal.supporting_fact}`);
  } else {
    narrative.push('No contributing risk signals were returned with the final assessment.');
  }
  narrative.push(mitigating.length ? `Mitigating context included: ${mitigating.join('; ')}.` : 'No mitigating context was returned for this case.');
  narrative.push(`The policy and decision service returned ${formatAction(action)}.`);

  const feeAvailable = action === 'APPROVE_WITH_RETURN_FEE' && detail.decision.suggested_fee !== undefined;
  const showGeneralFinancials = action !== 'APPROVE_WITH_RETURN_FEE' && Boolean(detail.economics);

  return <section className={`decision-explanation decision-${action.toLowerCase()}`}>
    <header className="decision-explanation-header"><div><span className="eyebrow">Final decision</span><h2>{formatAction(action)}</h2></div><span className="decision-explanation-mark"><CheckCircle2 size={20}/></span></header>
    <div className="decision-explanation-body">
      <div className="decision-narrative"><h3>Why this decision</h3><p>{narrative.join(' ')}</p></div>
      {factors.length > 0 && <div className="decision-factors"><h3><ShieldAlert size={14}/>Key factors</h3><div>{factors.map((factor) => <span key={factor}>{factor.replaceAll('_', ' ')}</span>)}</div></div>}
      {detail.decision.policy_explanation && <div className="decision-policy-explanation"><Info size={15}/><div><strong>Policy rationale</strong><p>{detail.decision.policy_explanation}</p></div></div>}
      {(feeAvailable || showGeneralFinancials) && <div className="decision-financial-strip"><span><Banknote size={15}/>Financial impact</span>
        {feeAvailable && <dl><div><dt>Return fee</dt><dd>{formatCurrency(detail.decision.suggested_fee!)}</dd></div></dl>}
        {showGeneralFinancials && detail.economics && <dl><div><dt>Item value</dt><dd>{formatCurrency(detail.economics.item_value)}</dd></div><div><dt>Net return cost</dt><dd>{formatCurrency(detail.economics.net_return_cost)}</dd></div></dl>}
      </div>}
      {limitations.length > 0 && <p className="decision-limitations"><strong>Limitations:</strong> {limitations.join(' · ')}</p>}
    </div>
  </section>;
}
