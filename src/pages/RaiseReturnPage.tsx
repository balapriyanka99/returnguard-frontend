import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Package, Search, ShoppingBag, UploadCloud, UserRound } from 'lucide-react';
import { createSourceReturn, getSourceCustomerOrders, getSourceCustomers, getSourceOrderItems } from '../api/source';
import type { SourceCustomer, SourceOrder, SourceOrderItem } from '../api/types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { config } from '../api/client';

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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search), 280); return () => window.clearTimeout(timer); }, [search]);
  useEffect(() => {
    if (debouncedSearch.trim().length < 2) { setCustomers([]); setCustomerLoading(false); return; }
    let active = true; setCustomerLoading(true); setError(undefined);
    getSourceCustomers(debouncedSearch).then((response) => { if (active) setCustomers(response.items); }).catch((value) => { if (active) setError(value instanceof Error ? value.message : 'Unable to load customers'); }).finally(() => { if (active) setCustomerLoading(false); });
    return () => { active = false; };
  }, [debouncedSearch]);
  useEffect(() => {
    if (!customer) return; let active = true; setOrderLoading(true); setError(undefined);
    getSourceCustomerOrders(customer.user_id).then((response) => { if (active) setOrders(response.items); }).catch((value) => { if (active) setError(value instanceof Error ? value.message : 'Unable to load orders'); }).finally(() => { if (active) setOrderLoading(false); });
    return () => { active = false; };
  }, [customer]);
  useEffect(() => {
    if (!order) return; let active = true; setItemLoading(true); setError(undefined);
    getSourceOrderItems(order.order_id).then((response) => { if (active) setItems(response.items); }).catch((value) => { if (active) setError(value instanceof Error ? value.message : 'Unable to load items'); }).finally(() => { if (active) setItemLoading(false); });
    return () => { active = false; };
  }, [order]);

  const canContinue = useMemo(() => [!!customer, !!order, !!item, !!reason, true][step], [step, customer, order, item, reason]);
  const stepLoading = (step === 0 && customerLoading) || (step === 1 && orderLoading) || (step === 2 && itemLoading);
  const submit = async () => {
    if (!item || !reason) return; setSubmitting(true); setError(undefined);
    try { const result = await createSourceReturn({ order_item_id: item.order_item_id, customer_id: customer?.user_id, order_id: order?.order_id, reason, ...(comment.trim() ? { comment: comment.trim() } : {}) }); onCreated(result.return_id); }
    catch (value) { setError(value instanceof Error ? value.message : 'Unable to raise return'); setSubmitting(false); }
  };

  return <div className="flow-page">
    <button className="case-back" onClick={onBack}><ArrowLeft size={16}/>Back to investigations</button>
    <div className="page-heading"><div><span className="eyebrow">Demo integration flow</span><h1>Demo: Raise Source-backed Return</h1><p>This simulates a return request that would normally originate from an ecommerce platform.</p></div></div>
    <div className="flow-explainer">Selections remain constrained to valid source relationships. The backend derives customer, order, product, and price from the selected order item.</div>
    <div className="stepper">{labels.map((label, index) => <div className={index === step ? 'current' : index < step ? 'done' : ''} key={label}><span>{index < step ? <Check size={14}/> : index + 1}</span><small>{label}</small></div>)}</div>
    <section className="wizard-card">
      {error && <div className="inline-error">{error}</div>}
      {step === 0 && <><div className="section-heading"><UserRound/><div><h2>Select customer</h2><p>Search customers in the frozen source snapshot.</p></div></div><label className="search-field"><Search size={17}/><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by customer name or ID"/><span className="field-loader">{customerLoading && <LoaderCircle className="spin" size={15}/>}</span></label><div className="selection-list stable-list">{customers.map((value) => <button className={customer?.user_id === value.user_id ? 'selected' : ''} key={value.user_id} onClick={() => { setCustomer(value); setOrder(undefined); setItem(undefined); setOrders([]); setItems([]); }}><span className="item-icon"><UserRound/></span><span><strong>{value.display_name}</strong><small>User ID {value.user_id}{value.email ? ` · ${value.email}` : ''}</small></span>{customer?.user_id === value.user_id && <Check/>}</button>)}{!customerLoading && customers.length === 0 && <div className="selection-empty">No customers match this search.</div>}</div></>}
      {step === 1 && <><div className="section-heading"><ShoppingBag/><div><h2>Select order</h2><p>Only orders belonging to {customer?.display_name} are shown.</p></div></div>{orderLoading ? <div className="inline-loading"><LoaderCircle className="spin"/>Loading orders…</div> : <div className="selection-list">{orders.map((value) => <button className={order?.order_id === value.order_id ? 'selected' : ''} key={value.order_id} onClick={() => { setOrder(value); setItem(undefined); setItems([]); }}><span className="item-icon"><ShoppingBag/></span><span><strong>Order #{value.order_id}</strong><small>{formatDate(value.created_at)} · {value.status} · {value.num_of_item} {value.num_of_item === 1 ? 'item' : 'items'}</small></span>{order?.order_id === value.order_id && <Check/>}</button>)}</div>}</>}
      {step === 2 && <><div className="section-heading"><Package/><div><h2>Select eligible order item</h2><p>Only eligible items from Order #{order?.order_id} are shown.</p></div></div>{itemLoading ? <div className="inline-loading"><LoaderCircle className="spin"/>Loading order items…</div> : <div className="selection-list">{items.map((value) => <button className={item?.order_item_id === value.order_item_id ? 'selected' : ''} key={value.order_item_id} onClick={() => setItem(value)}><span className="item-icon"><Package/></span><span><strong>{value.product_name}</strong><small>{value.category} · {formatCurrency(value.sale_price)} · Item ID {value.order_item_id}</small></span>{item?.order_item_id === value.order_item_id && <Check/>}</button>)}</div>}</>}
      {step === 3 && <><div className="section-heading"><Package/><div><h2>Return details</h2><p>Add the provided reason and optional context.</p></div></div><div className="form-grid"><label>Return reason<select value={reason} onChange={(event) => setReason(event.target.value)}><option value="">Select a reason</option>{reasons.map((value) => <option key={value}>{value}</option>)}</select></label><label>Comment <span>(optional)</span><textarea rows={4} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add relevant return context"/></label><div className="upload-placeholder"><UploadCloud/><strong>Evidence upload</strong><span>Optional · interface placeholder</span><small>Upload awaits a backend evidence contract.</small></div></div></>}
      {step === 4 && <><div className="section-heading"><Check/><div><h2>Review return request</h2><p>Only the selected order item, reason, and optional comment will be submitted.</p></div></div><div className="review-grid"><div><span>Customer</span><strong>{customer?.display_name}</strong><small>User ID {customer?.user_id}</small></div><div><span>Order</span><strong>#{order?.order_id}</strong><small>{order && formatDate(order.created_at)}</small></div><div><span>Product</span><strong>{item?.product_name}</strong><small>Order item {item?.order_item_id}</small></div><div><span>Return reason</span><strong>{reason}</strong><small>{comment || 'No comment provided'}</small></div></div><div className="neutral-note">{config.useMock ? 'Inspection, vision, risk, and decision data may be unavailable immediately after creation.' : 'Source-backed request will be created with relationships validated by the backend.'}</div></>}
      <footer className="wizard-actions"><button className="rg-btn-secondary" disabled={step === 0 || submitting} onClick={() => setStep((value) => value - 1)}>Back</button>{step < 4 ? <button className="rg-btn-primary" disabled={!canContinue || stepLoading} onClick={() => setStep((value) => value + 1)}>Continue<ArrowRight size={16}/></button> : <button className="rg-btn-primary" disabled={submitting} onClick={submit}>{submitting ? 'Raising return…' : 'Raise Return'}<ArrowRight size={16}/></button>}</footer>
    </section>
  </div>;
}
