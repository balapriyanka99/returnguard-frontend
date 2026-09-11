import { useState } from 'react';
import { Banknote, Boxes, ClipboardCheck, FileImage, Gauge, Lightbulb, Network, PackageSearch, Scale, UserRound } from 'lucide-react';
import { useReturnInvestigation } from '../hooks/useReturnInvestigation';
import { InvestigationHeader } from '../components/investigation/InvestigationHeader';
import { RiskEvolution } from '../components/investigation/RiskEvolution';
import { EvidenceTimeline } from '../components/investigation/EvidenceTimeline';
import { CustomerIntelligenceCard } from '../components/investigation/CustomerIntelligenceCard';
import { ProductIntelligenceCard } from '../components/investigation/ProductIntelligenceCard';
import { InspectionCard } from '../components/investigation/InspectionCard';
import { ManualReviewPanel } from '../components/investigation/ManualReviewPanel';
import { DemoLifecycleControls } from '../components/investigation/DemoLifecycleControls';
import { DecisionExplanation } from '../components/investigation/DecisionExplanation';
import { EvidenceCard } from '../components/investigation/EvidenceCard';
import { NetworkContextCard } from '../components/investigation/NetworkContextCard';
import { EconomicsCard } from '../components/investigation/EconomicsCard';
import { AskReturnGuard } from '../components/investigation/AskReturnGuard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { RiskBadge } from '../components/common/RiskBadge';
import { formatCurrency } from '../utils/formatters';

type IntelligenceTab = 'customer' | 'product' | 'inspection' | 'evidence' | 'network' | 'economics';

export function ReturnInvestigationPage({ returnId, onBack, onOpenInspection }: { returnId: string; onBack: () => void; onOpenInspection: () => void }) {
  const [tab, setTab] = useState<IntelligenceTab>('customer');
  const { detail, history, timeline, loading, error, refresh, investigate, investigating } = useReturnInvestigation(returnId);
  if (loading) return <LoadingState message={`Loading investigation ${returnId}…`}/>;
  if (error || !detail) return <ErrorState title="Unable to load investigation" message={error || 'Return not found'} onRetry={refresh}/>;
  const lifecycleStatus = detail.return.status.toLowerCase();
  const canOpenInspection = detail.inspection?.available || lifecycleStatus.includes('warehouse received') || lifecycleStatus.includes('awaiting physical inspection') || lifecycleStatus.includes('under review');
  const tabs = [
    { id: 'customer' as const, label: 'Customer', icon: UserRound }, { id: 'product' as const, label: 'Product', icon: PackageSearch },
    { id: 'inspection' as const, label: 'Inspection', icon: Scale }, { id: 'evidence' as const, label: 'Evidence', icon: FileImage },
    { id: 'network' as const, label: 'Network', icon: Network }, { id: 'economics' as const, label: 'Economics', icon: Banknote }
  ];
  const panels = {
    customer: <CustomerIntelligenceCard customer={detail.customer}/>, product: <ProductIntelligenceCard product={detail.product}/>,
    inspection: detail.source_type === 'source_backed' ? <div className="inspection-overview"><InspectionCard inspection={detail.inspection}/><div className="inspection-route-cta"><div><strong>Physical inspection entry</strong><p>{canOpenInspection ? 'Open the dedicated warehouse-input view to record or update inspection facts.' : 'Physical inspection becomes available after warehouse receipt.'}</p></div><button className="rg-btn-primary" disabled={!canOpenInspection} onClick={onOpenInspection}><ClipboardCheck size={15}/>Open Physical Inspection</button></div></div> : <InspectionCard inspection={detail.inspection}/>, evidence: <EvidenceCard evidence={detail.evidence} vision={detail.vision}/>,
    network: <NetworkContextCard network={detail.network}/>, economics: <EconomicsCard economics={detail.economics}/>
  };
  const limitations = [...(detail.risk?.limitations || []), ...detail.limitations];
  return <div className="investigation-page">
    <InvestigationHeader data={detail} onBack={onBack}/>
    <div className="investigation-route-cta"><div><strong>Grounded assessment</strong><p>Run the real ReturnGuard specialist, risk, economics, policy, and decision workflow.</p></div><button className="rg-btn-primary" disabled={investigating} onClick={investigate}>{investigating ? 'Investigating…' : 'Run Investigation'}</button></div>
    <div className="assessment-grid">
      <article className={'assessment-card assessment-risk ' + (detail.risk ? 'risk-' + detail.risk.band : 'risk-undetermined')}><div className="assessment-icon"><Gauge/></div><span>Suspiciousness Risk</span>{detail.risk ? <div className="risk-hero"><strong>{detail.risk.score}</strong><RiskBadge band={detail.risk.band} showScore={false} size="lg"/></div> : <strong className="undetermined">NOT ASSESSED</strong>}<p>{detail.risk ? 'Current suspiciousness assessment.' : 'No persisted Risk-v1 assessment is available yet.'}</p></article>
      <article className="assessment-card assessment-coverage"><div className="assessment-icon"><Boxes/></div><span>Evidence Coverage</span><strong className={detail.evidence_coverage ? 'coverage-' + detail.evidence_coverage : 'pending'}>{detail.evidence_coverage?.replaceAll('_', ' ') || 'Assessment pending'}</strong><p>{detail.evidence_coverage ? 'Coverage state supplied by this controlled demo fixture.' : 'No coverage state is available in the current API response.'}</p></article>
      <article className="assessment-card assessment-financial"><div className="assessment-icon"><Banknote/></div><span>Financial Exposure</span><strong>{detail.economics ? formatCurrency(detail.economics.net_return_cost) : '—'}</strong><p>{detail.economics ? 'Deterministic net return cost, separate from risk.' : 'Financial analysis unavailable.'}</p></article>
      <article className={'assessment-card assessment-decision ' + (detail.decision ? 'has-decision' : '')}><div className="assessment-icon"><Lightbulb/></div><span>Recommended Action</span><strong className={detail.decision ? '' : 'pending'}>{detail.decision?.recommended_action?.replaceAll('_', ' ') || 'Decision pending'}</strong><p>{detail.decision ? 'Returned by the policy and decision service.' : 'No policy recommendation is available.'}</p></article>
    </div>

    <DecisionExplanation detail={detail}/>

    <section className="case-section assessment-context-section"><div className="section-title-row"><div><span className="eyebrow">Assessment context</span><h2>Assessment Details</h2></div><p>{detail.risk ? `Current assessment: ${detail.risk.score} ${detail.risk.band.toUpperCase()}` : 'No suspiciousness score has been established.'}</p></div><div className="assessment-details"><article className="assessment-overview"><h3>Risk Explanation</h3>{detail.risk ? <><div className={'assessment-risk-line risk-' + detail.risk.band}><RiskBadge score={detail.risk.score} band={detail.risk.band}/><span>{detail.risk.signal_contributions.length ? `${detail.risk.signal_contributions.length} contributing signal${detail.risk.signal_contributions.length === 1 ? '' : 's'} returned.` : 'No contributing risk signals were returned.'}</span></div>{detail.risk.patterns?.length ? <p>Detected patterns: {detail.risk.patterns.map((pattern) => pattern.replaceAll('_', ' ')).join(', ')}.</p> : null}{detail.decision?.policy_explanation && <p>{detail.decision.policy_explanation}</p>}</> : <div className="compact-empty">Risk is undetermined because the API has not returned an established assessment.</div>}</article><article><h3>Strongest Risk Signals</h3>{detail.risk?.signal_contributions?.length ? detail.risk.signal_contributions.map((signal) => <div className="compact-fact" key={signal.name}><strong>{signal.name}</strong><p>{signal.supporting_fact}</p><span>{signal.source}{signal.contribution_pct !== undefined ? ` · ${signal.contribution_pct}% contribution` : ''}</span></div>) : <div className="compact-empty">No signal contributions returned.</div>}</article><article><h3>Mitigating Context</h3>{detail.decision?.mitigating_context?.length ? <ul>{detail.decision.mitigating_context.map((item) => <li key={item}>{item}</li>)}</ul> : <div className="compact-empty">No mitigating context was returned by the assessment contract.</div>}</article><article><h3>Limitations</h3>{limitations.length ? <ul>{Array.from(new Set(limitations)).map((item) => <li key={item}>{item}</li>)}</ul> : <div className="compact-empty">No limitations returned.</div>}</article></div></section>

    <section className="case-section"><div className="section-title-row"><div><span className="eyebrow">Case chronology</span><h2>What happened</h2></div><p>Only events recorded for this return are shown.</p></div><RiskEvolution history={history}/><EvidenceTimeline events={timeline}/></section>

    {detail.source_type === 'source_backed' && <DemoLifecycleControls returnId={detail.return_id} currentStatus={detail.return.status} onUpdated={refresh} onOpenInspection={onOpenInspection}/>}

    <section className="case-section intelligence-section"><div className="section-title-row"><div><span className="eyebrow">Source-backed context</span><h2>Investigation intelligence</h2></div><p>Select a category to inspect the available evidence.</p></div><div className="intelligence-tabs" role="tablist">{tabs.map(({ id, label, icon: Icon }) => <button role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}><Icon size={16}/>{label}</button>)}</div><div className="intelligence-panel" role="tabpanel">{panels[tab]}</div></section>
    <ManualReviewPanel returnId={detail.return_id} eligible={detail.return.status.toLowerCase().includes('review') || detail.decision?.recommended_action === 'MANUAL_REVIEW'} risk={detail.risk} decision={detail.decision} evidenceCoverage={detail.evidence_coverage} limitations={limitations} onSubmitted={refresh}/>
    <AskReturnGuard returnId={detail.return_id} assessmentAt={detail.return.assessment_at}/>
  </div>;
}
