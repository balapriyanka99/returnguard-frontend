import { AlertCircle, Banknote, CheckCircle2, Eye, FileQuestion, Gauge, Lightbulb, Scale, ShieldAlert } from 'lucide-react';
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

export function ReturnInvestigationPage({ returnId, onBack }: { returnId: string; onBack: () => void }) {
  const { detail, history, timeline, loading, error, refresh } = useReturnInvestigation(returnId);
  if (loading) return <LoadingState message={`Loading investigation ${returnId}…`}/>;
  if (error || !detail) return <ErrorState title="Unable to load investigation" message={error || 'Return not found'} onRetry={refresh}/>;
  const exposure = detail.economics?.net_return_cost;
  return <div className="investigation-page">
    <InvestigationHeader data={detail} onBack={onBack}/>
    <div className="assessment-grid">
      <article className="assessment-card"><div className="assessment-icon"><Gauge/></div><span>Suspiciousness Risk</span>{detail.risk ? <RiskBadge score={detail.risk.score} band={detail.risk.band} size="lg"/> : <strong className="undetermined">Undetermined</strong>}<p>{detail.risk ? 'Established by the risk service.' : 'No suspiciousness score has been established.'}</p></article>
      <article className="assessment-card"><div className="assessment-icon"><Scale/></div><span>Evidence Coverage</span><strong className="pending">Assessment pending</strong><p>The current API does not provide an evidence-coverage state.</p></article>
      <article className="assessment-card"><div className="assessment-icon"><Banknote/></div><span>Financial Exposure</span><strong>{exposure === undefined ? '—' : formatCurrency(exposure)}</strong><p>{detail.economics ? 'Deterministic net return cost; separate from risk.' : 'Financial analysis unavailable.'}</p></article>
      <article className="assessment-card"><div className="assessment-icon"><Lightbulb/></div><span>Recommended Action</span><strong className="pending">{detail.decision?.recommended_action?.replaceAll('_', ' ') || 'Decision pending'}</strong><p>{detail.decision ? 'Returned by policy and decision service.' : 'No policy recommendation is available.'}</p></article>
    </div>
    <div className="investigation-layout"><main>
      <RiskEvolution history={history}/>
      <EvidenceTimeline events={timeline}/>
      <div className="intelligence-grid"><CustomerIntelligenceCard customer={detail.customer}/><ProductIntelligenceCard product={detail.product}/><InspectionCard inspection={detail.inspection}/><EvidenceCard evidence={detail.evidence} vision={detail.vision}/><NetworkContextCard network={detail.network}/><EconomicsCard economics={detail.economics}/></div>
      <AskReturnGuard returnId={detail.return_id} assessmentAt={detail.return.assessment_at}/>
    </main><aside className="context-rail">
      <section className="rail-card"><div className="rail-title"><ShieldAlert/>Risk signals</div>{detail.risk?.signal_contributions?.length ? detail.risk.signal_contributions.map((signal) => <div className="signal" key={signal.name}><strong>{signal.name}</strong><p>{signal.supporting_fact}</p><span>{signal.source}</span></div>) : <div className="neutral-state"><FileQuestion/><strong>Signals unavailable</strong><p>The risk service has not returned signal contributions.</p></div>}</section>
      <section className="rail-card"><div className="rail-title"><Eye/>Vision assessment</div>{detail.vision ? <p>{detail.vision.summary || `${detail.vision.findings.length} findings available.`}</p> : <div className="neutral-state"><Eye/><strong>Not performed</strong><p>Visual assessment has not been performed.</p></div>}</section>
      <section className="rail-card"><div className="rail-title"><AlertCircle/>Limitations</div>{detail.limitations.length ? <ul className="plain-list">{detail.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul> : <div className="neutral-state"><CheckCircle2/><strong>No limitations returned</strong></div>}</section>
      <div className="context-note">Network relationships and historical metrics are contextual evidence only. They do not independently establish fraud.</div>
    </aside></div>
  </div>;
}
