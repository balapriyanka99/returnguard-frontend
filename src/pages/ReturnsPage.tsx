import { useMemo, useState } from 'react';
import { ArrowRight, Package, Plus, Search } from 'lucide-react';
import type { SourceType } from '../api/types';
import { useReturns } from '../hooks/useReturns';
import { SourceBadge } from '../components/common/SourceBadge';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { formatDateTime } from '../utils/formatters';

export function ReturnsPage({ onSelectReturn, onRaiseReturnClick }: { onSelectReturn: (id: string) => void; onRaiseReturnClick: () => void }) {
  const [source, setSource] = useState<SourceType | 'all'>('all');
  const [search, setSearch] = useState('');
  const { data, loading, error, refresh, setParams } = useReturns();
  const changeSource = (next: SourceType | 'all') => { setSource(next); setParams(next === 'all' ? {} : { source_type: next }); };
  const rows = useMemo(() => (data?.items || []).filter((item) => [item.return_id, item.customer.display_name, item.product.name, item.reason].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [data, search]);
  return <div className="page-stack">
    <div className="page-heading"><div><span className="eyebrow">Returns workspace</span><h1>Return Intelligence</h1><p>Investigate existing ReturnGuard cases or raise a source-backed return.</p></div><button className="rg-btn-primary" onClick={onRaiseReturnClick}><Plus size={17}/>Raise Return</button></div>
    <section className="returns-panel">
      <div className="returns-toolbar"><div className="segmented">{([['all','All'],['controlled','Controlled Demo'],['source_backed','Source-backed']] as const).map(([id,label]) => <button className={source === id ? 'active' : ''} key={id} onClick={() => changeSource(id)}>{label}</button>)}</div><label className="table-search"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search returns"/></label></div>
      {loading ? <LoadingState message="Loading returns…"/> : error ? <ErrorState title="Unable to load returns" message={error} onRetry={refresh}/> : rows.length === 0 ? <div className="empty-panel">No returns match this view.</div> : <div className="table-scroll"><table className="returns-table"><thead><tr><th>Return</th><th>Source</th><th>Customer</th><th>Product</th><th>Requested</th><th>Reason</th><th>Status</th><th>Suspiciousness risk</th><th></th></tr></thead><tbody>{rows.map((item) => <tr key={item.return_id} onClick={() => onSelectReturn(item.return_id)}><td><strong>{item.return_id}</strong><small>Order #{item.order_id}</small></td><td><SourceBadge sourceType={item.source_type}/></td><td>{item.customer.display_name}</td><td><div className="product-cell"><span><Package size={16}/></span><div>{item.product.name}<small>{item.product.category}</small></div></div></td><td>{formatDateTime(item.requested_at)}</td><td className="truncate">{item.reason}</td><td><span className="status-pill">{item.status}</span></td><td>{item.risk ? <RiskBadge score={item.risk.score} band={item.risk.band}/> : item.assessment_at ? <span className="neutral-pill">Undetermined</span> : <span className="muted-value">—</span>}</td><td><ArrowRight size={16}/></td></tr>)}</tbody></table></div>}
      <footer className="table-footer"><span>{rows.length} returns</span><span>Missing information is shown neutrally and is not treated as risk evidence.</span></footer>
    </section>
  </div>;
}
