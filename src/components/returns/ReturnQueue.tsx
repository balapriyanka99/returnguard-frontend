import { useMemo, useState } from 'react';
import { ArrowRight, Package, Search, UserRound } from 'lucide-react';
import type { ReturnSummaryItem, SourceType } from '../../api/types';
import { useReturns } from '../../hooks/useReturns';
import { SourceBadge } from '../common/SourceBadge';
import { RiskBadge } from '../common/RiskBadge';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { formatDateTime } from '../../utils/formatters';

interface Props {
  sourceType?: SourceType;
  filter?: (item: ReturnSummaryItem) => boolean;
  onSelectReturn: (id: string) => void;
  emptyMessage: string;
  showDecision?: boolean;
}
const queueFilters = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'active', label: 'Active', match: (item: ReturnSummaryItem) => !/completed|approved|rejected/i.test(item.status) },
  { id: 'inspection', label: 'Awaiting Inspection', match: (item: ReturnSummaryItem) => /awaiting.*inspection/i.test(item.status) },
  { id: 'review', label: 'Manual Review', match: (item: ReturnSummaryItem) => /review/i.test(item.status) || item.decision === 'MANUAL_REVIEW' },
  { id: 'completed', label: 'Completed', match: (item: ReturnSummaryItem) => /completed/i.test(item.status) },
  { id: 'approved', label: 'Approved', match: (item: ReturnSummaryItem) => /approved/i.test(item.status) || item.decision === 'AUTO_APPROVE' },
  { id: 'rejected', label: 'Rejected', match: (item: ReturnSummaryItem) => /rejected/i.test(item.status) || item.decision === 'REJECT_OR_ESCALATE' }
];

function DecisionBadge({ value }: { value?: string | null }) {
  if (!value) return <span className="decision-badge decision-pending">Pending</span>;
  const kind = value === 'AUTO_APPROVE' ? 'approve' : value === 'REJECT_OR_ESCALATE' ? 'reject' : value === 'MANUAL_REVIEW' ? 'review' : value === 'REQUIRE_INSPECTION' ? 'inspection' : 'neutral';
  return <span className={'decision-badge decision-' + kind}>{value.replaceAll('_', ' ')}</span>;
}

export function ReturnQueue({ sourceType, filter, onSelectReturn, emptyMessage, showDecision = true }: Props) {
  const [queueFilter, setQueueFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data, loading, error, refresh } = useReturns(sourceType ? { source_type: sourceType } : undefined);
  const sourceItems = useMemo(() => (data?.items || []).filter((item) => filter?.(item) ?? true), [data, filter]);
  const visibleFilters = useMemo(() => queueFilters.filter((candidate) => candidate.id === 'all' || sourceItems.some(candidate.match)), [sourceItems]);
  const rows = useMemo(() => {
    const activeFilter = queueFilters.find((candidate) => candidate.id === queueFilter) || queueFilters[0];
    return sourceItems.filter((item) => {
      const query = search.trim().toLowerCase();
      return activeFilter.match(item) && (!query || [item.return_id, item.customer.display_name, item.product.name, item.reason].some((value) => value.toLowerCase().includes(query)));
    });
  }, [sourceItems, queueFilter, search]);

  return <section className="returns-panel queue-panel">
    <div className="returns-toolbar"><div className="segmented">{visibleFilters.map((candidate) => { const count = sourceItems.filter(candidate.match).length; return <button className={queueFilter === candidate.id ? 'active' : ''} key={candidate.id} onClick={() => setQueueFilter(candidate.id)}>{candidate.label} <span>{count}</span></button>; })}</div><label className="table-search"><Search size={16}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search return, customer, product"/></label></div>
    {loading ? <LoadingState message="Loading returns…"/> : error ? <ErrorState title="Unable to load returns" message={error} onRetry={refresh}/> : rows.length === 0 ? <div className="empty-panel">{emptyMessage}</div> : <div className="table-scroll"><table className="returns-table investigation-table"><thead><tr><th>Return</th><th>Product / Customer</th><th>Workflow stage</th><th>Previous risk</th><th>Current risk</th>{showDecision && <th>Decision</th>}<th>Last updated</th><th></th></tr></thead><tbody>{rows.map((item) => <tr key={item.return_id} onClick={() => onSelectReturn(item.return_id)}><td><strong>{item.return_id}</strong><SourceBadge sourceType={item.source_type}/></td><td><div className="case-identity-cell"><span className="case-product-icon"><Package size={16}/></span><div><strong>{item.product.name}</strong><small><UserRound size={11}/>{item.customer.display_name}</small></div></div></td><td><span className={'workflow-badge workflow-' + (item.status.toLowerCase().includes('rejected') ? 'rejected' : item.status.toLowerCase().includes('approved') ? 'approved' : item.status.toLowerCase().includes('inspection') ? 'inspection' : item.status.toLowerCase().includes('review') ? 'review' : 'neutral')}>{item.status}</span></td><td>{item.previous_risk ? <RiskBadge score={item.previous_risk.score} band={item.previous_risk.band} size="sm"/> : <span className="muted-value">—</span>}</td><td>{item.risk ? <RiskBadge score={item.risk.score} band={item.risk.band}/> : <span className="neutral-pill">Undetermined</span>}</td>{showDecision && <td><DecisionBadge value={item.decision}/></td>}<td className="date-cell">{formatDateTime(item.assessment_at || item.requested_at)}</td><td><ArrowRight className="row-arrow" size={17}/></td></tr>)}</tbody></table></div>}
    <footer className="table-footer"><span>{rows.length} shown</span><span>Controlled Demo values are isolated mock fixtures; real mode displays FastAPI data only.</span></footer>
  </section>;
}
