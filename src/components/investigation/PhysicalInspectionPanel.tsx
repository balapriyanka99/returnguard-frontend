import { useState } from 'react';
import { ClipboardCheck, Save, WandSparkles } from 'lucide-react';
import { InspectionData } from '../../api/types';
import { saveInspection } from '../../api/inspection';
import { InspectionCard } from './InspectionCard';

const demoInspection = (): InspectionData => ({ available: true, item_present: true, condition: 'salable', expected_weight_kg: 1.2, actual_weight_kg: 1.2, weight_delta_kg: 0, weight_ratio: 1, serial_comparison_performed: true, serial_mismatch: false, accessory_comparison_performed: true, missing_accessories: [], inspected_at: new Date().toISOString() });

export function PhysicalInspectionPanel({ returnId, inspection, editable, onSaved }: { returnId: string; inspection: InspectionData | null; editable: boolean; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<InspectionData>(inspection || demoInspection());
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const update = <K extends keyof InspectionData>(key: K, value: InspectionData[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const loadDemo = () => { setDraft(demoInspection()); setNotes('Demo inspection values pre-filled for review.'); setMessage('Demo values loaded locally. Submit to persist them in mock mode.'); setEditing(true); };
  const submit = async () => {
    const expected = draft.expected_weight_kg;
    const actual = draft.actual_weight_kg;
    const updated = { ...draft, available: true, weight_delta_kg: expected !== null && actual !== null ? Number((actual - expected).toFixed(3)) : null, weight_ratio: expected && actual !== null ? Number((actual / expected).toFixed(4)) : null };
    setBusy(true); setMessage('');
    try { await saveInspection(returnId, { inspection: updated, inspector_notes: notes || undefined }); setEditing(false); setMessage('Inspection submitted to mock state. Risk and decision remain unchanged.'); onSaved(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Inspection submission unavailable.'); }
    finally { setBusy(false); }
  };
  if (!editable) return <InspectionCard inspection={inspection}/>;
  if (!editing) return <div className="inspection-entry"><InspectionCard inspection={inspection}/><div className="inspection-entry-actions"><button className="rg-btn-secondary" onClick={() => { setDraft(inspection || demoInspection()); setEditing(true); }}><ClipboardCheck size={14}/>{inspection ? 'Edit Physical Inspection' : 'Open Physical Inspection'}</button><button className="rg-btn-primary" onClick={loadDemo}><WandSparkles size={14}/>Load Demo Inspection</button></div>{message && <div className="review-state">{message}</div>}</div>;
  return <div className="inspection-form"><div className="manual-review-heading"><div><span className="eyebrow">Warehouse input</span><h2>Physical Inspection</h2><p>Prefill, edit, and submit inspection facts. This does not create a risk or decision result.</p></div><ClipboardCheck size={22}/></div><div className="inspection-fields"><label><input type="checkbox" checked={draft.item_present} onChange={(e) => update('item_present', e.target.checked)}/> Item present</label><label>Condition<select value={draft.condition} onChange={(e) => update('condition', e.target.value)}><option value="salable">Salable</option><option value="used">Used</option><option value="damaged">Damaged</option><option value="unknown">Unknown</option></select></label><label>Expected weight (kg)<input type="number" step="0.001" value={draft.expected_weight_kg ?? ''} onChange={(e) => update('expected_weight_kg', e.target.value === '' ? null : Number(e.target.value))}/></label><label>Actual weight (kg)<input type="number" step="0.001" value={draft.actual_weight_kg ?? ''} onChange={(e) => update('actual_weight_kg', e.target.value === '' ? null : Number(e.target.value))}/></label><label><input type="checkbox" checked={draft.serial_comparison_performed} onChange={(e) => update('serial_comparison_performed', e.target.checked)}/> Serial comparison performed</label><label><input type="checkbox" checked={Boolean(draft.serial_mismatch)} onChange={(e) => update('serial_mismatch', e.target.checked)}/> Serial mismatch</label><label><input type="checkbox" checked={draft.accessory_comparison_performed} onChange={(e) => update('accessory_comparison_performed', e.target.checked)}/> Accessory comparison performed</label><label>Missing accessories<input value={draft.missing_accessories.join(', ')} onChange={(e) => update('missing_accessories', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))}/></label></div><label className="inspection-notes">Inspector notes (mock-only draft)<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional inspection notes"/></label><div className="inspection-form-actions"><button className="rg-btn-secondary" onClick={() => setEditing(false)}>Cancel</button><button className="rg-btn-primary" disabled={busy} onClick={submit}><Save size={14}/>{busy ? 'Saving…' : 'Submit Inspection'}</button></div>{message && <div className="review-state">{message}</div>}</div>;
}
