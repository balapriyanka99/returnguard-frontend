import { ArrowRight, BellRing, CheckCircle2, ClipboardCheck, Database, RotateCcw, ShieldAlert, XCircle } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { LoadingState } from '../components/common/LoadingState';
import { formatDateTime } from '../utils/formatters';
import { SourceBadge } from '../components/common/SourceBadge';
import { RiskBadge } from '../components/common/RiskBadge';
import { config } from '../api/client';

const decisionLabel = (value?: string | null) => value ? value.replaceAll('_', ' ') : 'Decision pending';

export function DashboardPage({ onNavigate, onSelectReturn }: { onNavigate: (path: string) => void; onSelectReturn: (id: string) => void }) {
  const { data, loading } = useDashboard();
  if (loading) return <LoadingState message="Loading overview…"/>;
  const counts = data?.counts;
  const recent = data?.recent_returns || [];
  const attentionRows = (data?.attention_returns || recent.filter((item) => item.decision === 'MANUAL_REVIEW' || item.decision === 'REQUIRE_INSPECTION' || item.decision === 'REJECT_OR_ESCALATE' || item.decision === 'ESCALATE_TO_SPECIALIST' || item.risk?.band === 'high' || item.risk?.band === 'critical')).slice(0, 5);
  const needsAttention = attentionRows.length;
  const kpis = [
    { label: 'Total Return Requests', value: counts?.total_returns, icon: RotateCcw, tone: 'teal' },
    { label: 'Approved', value: counts?.auto_approved, icon: CheckCircle2, tone: 'green' },
    { label: 'Rejected / Escalated', value: counts?.rejected, icon: XCircle, tone: 'red' },
    { label: 'Under Review', value: counts?.needs_review, icon: ShieldAlert, tone: 'orange' },
    { label: 'Awaiting Inspection', value: counts?.awaiting_inspection, icon: ClipboardCheck, tone: 'amber' },
    { label: 'Needs Attention', value: config.useMock ? needsAttention : counts?.needs_review, icon: BellRing, tone: 'navy' }
  ];
  const riskDistribution = data?.risk_distribution;
  const riskTotal = (riskDistribution?.low || 0) + (riskDistribution?.medium || 0) + (riskDistribution?.high || 0);

  return <div className="page-stack overview-page">
    <div className="page-heading"><div><span className="eyebrow">Activity overview</span><h1>Return Intelligence Console</h1><p>Operational visibility across assessments, investigations, and prepared demo scenarios.</p></div></div>
    <div className="operational-kpis">{kpis.map(({ label, value, icon: Icon, tone }) => <article className={'kpi-card kpi-' + tone} key={label}><span className="kpi-icon"><Icon size={18}/></span><div><span>{label}</span><strong>{value ?? '—'}</strong></div></article>)}</div>

    <div className="overview-focus-grid">
      <section className="attention-panel"><div className="panel-heading"><div><span className="eyebrow">Priority queue</span><h2><BellRing size={17}/>Returns Needing Attention</h2></div><button className="rg-btn-secondary" onClick={() => onNavigate('/investigations')}>Open queue<ArrowRight size={15}/></button></div>
        {attentionRows.length ? attentionRows.map((item) => <button className={'attention-row attention-' + (item.risk?.band || 'neutral')} key={item.return_id} onClick={() => onSelectReturn(item.return_id)}><div className="attention-id"><strong>{item.return_id}</strong><SourceBadge sourceType={item.source_type}/></div><div className="attention-product"><strong>{item.product.name}</strong><small>{item.reason_for_attention || item.reason}</small></div><span className="workflow-badge">{item.status}</span><div className="attention-risk">{item.risk ? <RiskBadge score={item.risk.score} band={item.risk.band}/> : <span className="neutral-pill">NOT ASSESSED</span>}</div><span className={'decision-badge decision-' + (item.decision === 'REJECT_OR_ESCALATE' ? 'reject' : item.decision === 'MANUAL_REVIEW' ? 'review' : item.decision === 'REQUIRE_INSPECTION' ? 'inspection' : item.decision === 'ESCALATE_TO_SPECIALIST' ? 'reject' : 'pending')}>{decisionLabel(item.decision)}</span><ArrowRight className="row-arrow" size={18}/></button>) : <div className="empty-panel">No returns currently need attention.</div>}
      </section>
      <section className="risk-summary-panel"><div className="panel-heading"><div><span className="eyebrow">Assessed cases</span><h2>Risk Distribution</h2></div></div>{riskTotal > 0 ? <div className="risk-bars"><div><span><i className="risk-dot low"/>Low</span><b>{riskDistribution?.low}</b><em style={{ width: String(((riskDistribution?.low || 0) / riskTotal) * 100) + '%' }}/></div><div><span><i className="risk-dot medium"/>Medium</span><b>{riskDistribution?.medium}</b><em style={{ width: String(((riskDistribution?.medium || 0) / riskTotal) * 100) + '%' }}/></div><div><span><i className="risk-dot high"/>High / Critical</span><b>{riskDistribution?.high}</b><em style={{ width: String(((riskDistribution?.high || 0) / riskTotal) * 100) + '%' }}/></div></div> : <div className="compact-empty">Available after assessment data is populated.</div>}</section>
    </div>

    <div className="overview-lower"><section className="recent-panel"><div className="panel-heading"><div><span className="eyebrow">Latest activity</span><h2>Recent Returns</h2></div></div>{recent.slice(0, 5).map((item) => <button className="recent-row" key={item.return_id} onClick={() => onSelectReturn(item.return_id)}><span><strong>{item.return_id}</strong><small>{formatDateTime(item.assessment_at || item.requested_at)}</small></span><SourceBadge sourceType={item.source_type}/><span className="recent-product">{item.product.name}</span><span className="status-pill">{item.status}</span><ArrowRight size={16}/></button>)}</section><section className="provenance-panel"><div className="panel-heading"><div><span className="eyebrow">Trusted context</span><h2><Database size={17}/>Data Provenance</h2></div></div><div className="provenance-list"><span><i><ShieldAlert size={16}/></i><small>Controlled Demo<b>Prepared scenarios</b></small></span><span><i><Database size={16}/></i><small>Source-backed<b>Frozen source snapshot</b></small></span><span><i><RotateCcw size={16}/></i><small>Runtime<b>{config.useMock ? 'Mock API' : 'Real API'}</b></small></span></div></section></div>
  </div>;
}
