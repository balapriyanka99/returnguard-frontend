import { useMemo, useState } from 'react';
import { ArrowRight, Package, Search } from 'lucide-react';
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

export function ReturnQueue({ sourceType, filter, onSelectReturn, emptyMessage, showDecision = true }: Props) {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const { data, loading, error, refresh } = useReturns(sourceType ? { source_type: sourceType } : undefined);
  const sourceItems = useMemo(() => (data?.items || []).filter((item) => filter?.(item) ?? true), [data, filter]);
  const statuses = useMemo(() => Array.from(new Set(sourceItems.map((item) => item.status))), [sourceItems]);
  const rows = useMemo(() => sourceItems.filter((item) => {
    const matchesStatus = status === 'all' || item.status === status;
    const query = search.trim().toLowerCase();
    return matchesStatus && (!query || [item.return_id, item.customer.display_name, item.product.name, item.reason].some((value) => value.toLowerCase().includes(query)));
  }), [sourceItems, status, search]);

  return <section className="returns-panel queue-panel">
    <div className="returns-toolbar"><div className="segmented"><button className={status === 'all' ? 'active' : ''} onClick={() => setStatus('all')}>All <span>{sourceItems.length}</span></button>{statuses.map((value) => <button className={status === value ? 'active' : ''} key={value} onClick={() => setStatus(value)}>{value} <span>{sourceItems.filter((item) => item.status === value).length}</span></button>)}</div><label className="table-search"><Search size={16}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search return, customer, product"/></label></div>
    {loading ? <LoadingState message="Loading returns…"/> : error ? <ErrorState title="Unable to load returns" message={error} onRetry={refresh}/> : rows.length === 0 ? <div className="empty-panel">{emptyMessage}</div> : <div className="table-scroll"><table className="returns-table queue-table"><thead><tr><th>Return</th><th>Source</th><th>Customer</th><th>Product</th><th>Current stage</th><th>Risk</th>{showDecision && <th>Decision</th>}<th>Last updated</th><th></th></tr></thead><tbody>{rows.map((item) => <tr key={item.return_id} onClick={() => onSelectReturn(item.return_id)}><td><strong>{item.return_id}</strong><small>Order #{item.order_id}</small></td><td><SourceBadge sourceType={item.source_type}/></td><td>{item.customer.display_name}</td><td><div className="product-cell"><span><Package size={16}/></span><div>{item.product.name}<small>{item.product.category}</small></div></div></td><td><span className="status-pill">{item.status}</span></td><td>{item.risk ? <RiskBadge score={item.risk.score} band={item.risk.band}/> : item.assessment_at ? <span className="neutral-pill">Undetermined</span> : <span className="muted-value">—</span>}</td>{showDecision && <td><span className="muted-value">—</span></td>}<td className="date-cell">{formatDateTime(item.assessment_at || item.requested_at)}</td><td><ArrowRight size={16}/></td></tr>)}</tbody></table></div>}
    <footer className="table-footer"><span>{rows.length} shown</span><span>Risk and decision values appear only when returned by the API.</span></footer>
  </section>;
}
