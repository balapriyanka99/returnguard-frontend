import { useState } from 'react';
import { Banknote, Boxes, FileImage, Gauge, Lightbulb, Network, PackageSearch, Scale, UserRound } from 'lucide-react';
import { useReturnInvestigation } from '../hooks/useReturnInvestigation';
import { InvestigationHeader } from '../components/investigation/InvestigationHeader';
import { RiskEvolution } from '../components/investigation/RiskEvolution';
import { EvidenceTimeline } from '../components/investigation/EvidenceTimeline';
import { CustomerIntelligenceCard } from '../components/investigation/CustomerIntelligenceCard';
import { ProductIntelligenceCard } from '../components/investigation/ProductIntelligenceCard';
import { InspectionCard } from '../components/investigation/InspectionCard';
import { EvidenceCard } from '../components/investigation/EvidenceCard';
import { NetworkContextCard } from '../components/investigation/NetworkContextCard';
import { EconomicsCard } from '../components/investigation/EconomicsCard';
import { AskReturnGuard } from '../components/investigation/AskReturnGuard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { RiskBadge } from '../components/common/RiskBadge';
import { formatCurrency } from '../utils/formatters';

type IntelligenceTab = 'customer' | 'product' | 'inspection' | 'evidence' | 'network' | 'economics';

export function ReturnInvestigationPage({ returnId, onBack }: { returnId: string; onBack: () => void }) {
  const [tab, setTab] = useState<IntelligenceTab>('customer');
  const { detail, history, timeline, loading, error, refresh } = useReturnInvestigation(returnId);
  if (loading) return <LoadingState message={`Loading investigation ${returnId}…`}/>;
  if (error || !detail) return <ErrorState title="Unable to load investigation" message={error || 'Return not found'} onRetry={refresh}/>;
  const tabs = [
    { id: 'customer' as const, label: 'Customer', icon: UserRound }, { id: 'product' as const, label: 'Product', icon: PackageSearch },
    { id: 'inspection' as const, label: 'Inspection', icon: Scale }, { id: 'evidence' as const, label: 'Evidence', icon: FileImage },
    { id: 'network' as const, label: 'Network', icon: Network }, { id: 'economics' as const, label: 'Economics', icon: Banknote }
  ];
  const panels = {
    customer: <CustomerIntelligenceCard customer={detail.customer}/>, product: <ProductIntelligenceCard product={detail.product}/>,
    inspection: <InspectionCard inspection={detail.inspection}/>, evidence: <EvidenceCard evidence={detail.evidence} vision={detail.vision}/>,
    network: <NetworkContextCard network={detail.network}/>, economics: <EconomicsCard economics={detail.economics}/>
  };
  const limitations = [...(detail.risk?.limitations || []), ...detail.limitations];
  return <div className="investigation-page">
    <InvestigationHeader data={detail} onBack={onBack}/>
    <div className="assessment-grid">
      <article className="assessment-card"><div className="assessment-icon"><Gauge/></div><span>Suspiciousness Risk</span>{detail.risk ? <RiskBadge score={detail.risk.score} band={detail.risk.band} size="lg"/> : <strong className="undetermined">Undetermined</strong>}<p>{detail.risk ? 'Established by the risk service.' : 'Minimum evidence for a score is not available.'}</p></article>
      <article className="assessment-card"><div className="assessment-icon"><Boxes/></div><span>Evidence Coverage</span><strong className="pending">Assessment pending</strong><p>No coverage state is available in the current API response.</p></article>
      <article className="assessment-card"><div className="assessment-icon"><Banknote/></div><span>Financial Exposure</span><strong>{detail.economics ? formatCurrency(detail.economics.net_return_cost) : '—'}</strong><p>{detail.economics ? 'Deterministic net return cost, separate from risk.' : 'Financial analysis unavailable.'}</p></article>
      <article className="assessment-card"><div className="assessment-icon"><Lightbulb/></div><span>Recommended Action</span><strong className="pending">{detail.decision?.recommended_action?.replaceAll('_', ' ') || 'Decision pending'}</strong><p>{detail.decision ? 'Returned by the policy and decision service.' : 'No policy recommendation is available.'}</p></article>
    </div>

    <section className="case-section"><div className="section-title-row"><div><span className="eyebrow">Case chronology</span><h2>What happened</h2></div><p>Only events recorded for this return are shown.</p></div><div className="chronology-grid"><RiskEvolution history={history}/><EvidenceTimeline events={timeline}/></div></section>

    <section className="case-section intelligence-section"><div className="section-title-row"><div><span className="eyebrow">Source-backed context</span><h2>Investigation intelligence</h2></div><p>Select a category to inspect the available evidence.</p></div><div className="intelligence-tabs" role="tablist">{tabs.map(({ id, label, icon: Icon }) => <button role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}><Icon size={16}/>{label}</button>)}</div><div className="intelligence-panel" role="tabpanel">{panels[tab]}{tab === 'inspection' && !detail.inspection && <div className="future-integration-note">Pickup, warehouse receipt, and inspection actions will appear here when their backend contracts are available.</div>}</div></section>

    <section className="case-section"><div className="section-title-row"><div><span className="eyebrow">Assessment context</span><h2>Assessment details</h2></div><p>Risk-related outputs remain separate from raw investigation facts.</p></div><div className="assessment-details"><article><h3>Strongest risk signals</h3>{detail.risk?.signal_contributions?.length ? detail.risk.signal_contributions.map((signal) => <div className="compact-fact" key={signal.name}><strong>{signal.name}</strong><p>{signal.supporting_fact}</p><span>{signal.source}</span></div>) : <div className="compact-empty">No signal contributions returned.</div>}</article><article><h3>Detected patterns</h3><div className="compact-empty">No detected risk patterns returned.</div></article><article><h3>Mitigating context</h3><div className="compact-empty">No mitigating context field is available.</div></article><article><h3>Limitations</h3>{limitations.length ? <ul>{Array.from(new Set(limitations)).map((item) => <li key={item}>{item}</li>)}</ul> : <div className="compact-empty">No limitations returned.</div>}</article></div></section>
    <AskReturnGuard returnId={detail.return_id} assessmentAt={detail.return.assessment_at}/>
  </div>;
}
