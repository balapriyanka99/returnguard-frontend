import { ArrowLeft, CalendarClock, ClipboardCheck as ClipboardClock, Package, ShoppingBag, UserRound } from 'lucide-react';
import type { ReturnDetailResponse } from '../../api/types';
import { SourceBadge } from '../common/SourceBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export function InvestigationHeader({ data, onBack, backLabel = 'Back to investigations' }: { data: ReturnDetailResponse; onBack: () => void; backLabel?: string }) {
  const info = data.return;
  const imageUrl = info.product_image_url && !info.product_image_url.startsWith('gs://') ? info.product_image_url : null;
  return <header className="investigation-header">
    <div className="case-topline"><button className="case-back" onClick={onBack}><ArrowLeft size={16}/>{backLabel}</button><SourceBadge sourceType={data.source_type}/></div>
    <div className="case-main"><div className="case-product-image">{imageUrl ? <img src={imageUrl} alt=""/> : <Package size={30}/>}</div><div className="case-identity"><div className="case-title"><h1>{data.return_id}</h1><span className="status-pill">{info.status}</span></div><h2>{info.product_name || `Product #${info.product_id}`}</h2><div className="case-meta"><span><UserRound/> <b>{info.customer_name || `Customer ${info.user_id}`}</b></span><span><ShoppingBag/> Order <b>#{info.order_id}</b> · Item #{info.order_item_id}</span></div></div><div className="case-value"><span>Item value</span><strong>{formatCurrency(info.sale_price)}</strong><small>{info.reason}</small></div></div>
    <div className="case-dates"><div><CalendarClock/><span>Requested at<strong>{formatDateTime(info.requested_at)}</strong></span></div><div><ClipboardClock/><span>Latest assessment<strong>{formatDateTime(info.assessment_at)}</strong></span></div></div>
  </header>;
}
