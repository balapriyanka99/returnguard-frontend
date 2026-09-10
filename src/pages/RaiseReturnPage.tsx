import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Package, Search, ShoppingBag, UploadCloud, UserRound } from 'lucide-react';
import { createSourceReturn, getSourceCustomerOrders, getSourceCustomers, getSourceOrderItems } from '../api/source';
import type { SourceCustomer, SourceOrder, SourceOrderItem } from '../api/types';
import { formatCurrency, formatDate } from '../utils/formatters';

const reasons = ['Item damaged', 'Item defective', 'Wrong item received', 'Missing parts or accessories', 'Does not fit', 'Changed my mind', 'Other'];
const labels = ['Customer', 'Order', 'Order item', 'Details', 'Review'];

export function RaiseReturnPage({ onBack, onCreated }: { onBack: () => void; onCreated: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [customers, setCustomers] = useState<SourceCustomer[]>([]);
  const [orders, setOrders] = useState<SourceOrder[]>([]);
  const [items, setItems] = useState<SourceOrderItem[]>([]);
  const [customer, setCustomer] = useState<SourceCustomer>();
  const [order, setOrder] = useState<SourceOrder>();
  const [item, setItem] = useState<SourceOrderItem>();
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => { setBusy(true); getSourceCustomers(search).then((r) => setCustomers(r.items)).catch((e) => setError(e.message)).finally(() => setBusy(false)); }, [search]);
  useEffect(() => { if (!customer) return; setBusy(true); getSourceCustomerOrders(customer.user_id).then((r) => setOrders(r.items)).catch((e) => setError(e.message)).finally(() => setBusy(false)); }, [customer]);
  useEffect(() => { if (!order) return; setBusy(true); getSourceOrderItems(order.order_id).then((r) => setItems(r.items)).catch((e) => setError(e.message)).finally(() => setBusy(false)); }, [order]);

  const canContinue = useMemo(() => [!!customer, !!order, !!item, !!reason, true][step], [step, customer, order, item, reason]);
  const submit = async () => {
    if (!item || !reason) return;
    setBusy(true); setError(undefined);
    try { const result = await createSourceReturn({ order_item_id: item.order_item_id, reason, ...(comment.trim() ? { comment: comment.trim() } : {}) }); onCreated(result.return_id); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to raise return'); setBusy(false); }
  };

  return <div className="flow-page">
    <button className="back-link" onClick={onBack}><ArrowLeft size={16}/>Back to returns</button>
    <div className="page-heading"><div><span className="eyebrow">Source-backed return</span><h1>Raise a return</h1><p>Select a valid customer, then one of their orders and eligible items.</p></div></div>
    <div className="stepper">{labels.map((label, index) => <div className={index === step ? 'current' : index < step ? 'done' : ''} key={label}><span>{index < step ? <Check size={14}/> : index + 1}</span><small>{label}</small></div>)}</div>
    <section className="wizard-card">
      {error && <div className="inline-error">{error}</div>}
      {step === 0 && <><div className="section-heading"><UserRound/><div><h2>Select customer</h2><p>Search the frozen source snapshot.</p></div></div><label className="search-field"><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer name or ID"/></label><div className="selection-list">{customers.map((c) => <button className={customer?.user_id === c.user_id ? 'selected' : ''} key={c.user_id} onClick={() => { setCustomer(c); setOrder(undefined); setItem(undefined); }}><span className="item-icon"><UserRound/></span><span><strong>{c.display_name}</strong><small>User ID {c.user_id}{c.email ? ` · ${c.email}` : ''}</small></span>{customer?.user_id === c.user_id && <Check/>}</button>)}</div></>}
      {step === 1 && <><div className="section-heading"><ShoppingBag/><div><h2>Select order</h2><p>Only orders belonging to {customer?.display_name} are shown.</p></div></div><div className="selection-list">{orders.map((o) => <button className={order?.order_id === o.order_id ? 'selected' : ''} key={o.order_id} onClick={() => { setOrder(o); setItem(undefined); }}><span className="item-icon"><ShoppingBag/></span><span><strong>Order #{o.order_id}</strong><small>{formatDate(o.created_at)} · {o.status} · {o.num_of_item} {o.num_of_item === 1 ? 'item' : 'items'}</small></span>{order?.order_id === o.order_id && <Check/>}</button>)}</div></>}
      {step === 2 && <><div className="section-heading"><Package/><div><h2>Select eligible order item</h2><p>Only items from Order #{order?.order_id} are available.</p></div></div><div className="selection-list">{items.map((i) => <button className={item?.order_item_id === i.order_item_id ? 'selected' : ''} key={i.order_item_id} onClick={() => setItem(i)}><span className="item-icon"><Package/></span><span><strong>{i.product_name}</strong><small>{i.category} · {formatCurrency(i.sale_price)} · Item ID {i.order_item_id}</small></span>{item?.order_item_id === i.order_item_id && <Check/>}</button>)}</div></>}
      {step === 3 && <><div className="section-heading"><Package/><div><h2>Return details</h2><p>Add the customer-provided reason and optional context.</p></div></div><div className="form-grid"><label>Return reason<select value={reason} onChange={(e) => setReason(e.target.value)}><option value="">Select a reason</option>{reasons.map((r) => <option key={r}>{r}</option>)}</select></label><label>Comment <span>(optional)</span><textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add relevant return context"/></label><div className="upload-placeholder"><UploadCloud/><strong>Evidence upload</strong><span>Optional · interface placeholder</span><small>Upload is not submitted until a backend evidence contract is available.</small></div></div></>}
      {step === 4 && <><div className="section-heading"><Check/><div><h2>Review source-backed return</h2><p>The backend will derive linked entity IDs and price from the order item.</p></div></div><div className="review-grid"><div><span>Customer</span><strong>{customer?.display_name}</strong><small>User ID {customer?.user_id}</small></div><div><span>Order</span><strong>#{order?.order_id}</strong><small>{order && formatDate(order.created_at)}</small></div><div><span>Product</span><strong>{item?.product_name}</strong><small>Order item {item?.order_item_id}</small></div><div><span>Return reason</span><strong>{reason}</strong><small>{comment || 'No comment provided'}</small></div></div><div className="neutral-note">A new return may have no inspection, vision, risk score, or decision. Missing data remains neutral while assessment is pending.</div></>}
      {busy && <div className="busy-overlay">Loading…</div>}
      <footer className="wizard-actions"><button className="rg-btn-secondary" disabled={step === 0 || busy} onClick={() => setStep((s) => s - 1)}>Back</button>{step < 4 ? <button className="rg-btn-primary" disabled={!canContinue || busy} onClick={() => setStep((s) => s + 1)}>Continue<ArrowRight size={16}/></button> : <button className="rg-btn-primary" disabled={busy} onClick={submit}>Raise Return<ArrowRight size={16}/></button>}</footer>
    </section>
  </div>;
}
