import { useMemo, useState } from 'react';
import { ClipboardCheck, Save, WandSparkles } from 'lucide-react';
import { InspectionData } from '../../api/types';
import { saveInspection } from '../../api/inspection';
import { InspectionCard } from './InspectionCard';

const emptyInspection = (): InspectionData => ({
  available: false,
  item_present: false,
  condition: 'unknown',
  expected_weight_kg: null,
  actual_weight_kg: null,
  weight_delta_kg: null,
  weight_ratio: null,
  serial_comparison_performed: false,
  serial_mismatch: null,
  accessory_comparison_performed: false,
  missing_accessories: [],
  inspected_at: ''
});

const demoInspection = (): InspectionData => ({
  ...emptyInspection(),
  available: true,
  item_present: true,
  condition: 'salable',
  expected_weight_kg: 1.2,
  actual_weight_kg: 1.2,
  serial_comparison_performed: true,
  serial_mismatch: false,
  accessory_comparison_performed: true
});

type Props = {
  returnId: string;
  inspection: InspectionData | null;
  editable: boolean;
  initiallyOpen?: boolean;
  onSaved: () => void | Promise<void>;
};

export function PhysicalInspectionPanel({ returnId, inspection, editable, initiallyOpen = false, onSaved }: Props) {
  const [editing, setEditing] = useState(initiallyOpen);
  const [draft, setDraft] = useState<InspectionData>(inspection || emptyInspection());
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const expectedWeightProvided = inspection?.expected_weight_kg != null;
  const weightDifference = useMemo(() => draft.expected_weight_kg != null && draft.actual_weight_kg != null
    ? Number((draft.actual_weight_kg - draft.expected_weight_kg).toFixed(3))
    : null, [draft.actual_weight_kg, draft.expected_weight_kg]);

  const update = <K extends keyof InspectionData>(key: K, value: InspectionData[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const loadDemo = () => {
    setDraft(demoInspection());
    setNotes('Demo inspection values pre-filled for review.');
    setMessage('Demo values loaded in the form only. Nothing has been saved.');
    setEditing(true);
  };
  const submit = async () => {
    const expected = draft.expected_weight_kg;
    const actual = draft.actual_weight_kg;
    const updated: InspectionData = {
      ...draft,
      available: true,
      serial_mismatch: draft.serial_comparison_performed ? draft.serial_mismatch : null,
      missing_accessories: draft.accessory_comparison_performed ? draft.missing_accessories : [],
      weight_delta_kg: expected != null && actual != null ? Number((actual - expected).toFixed(3)) : null,
      weight_ratio: expected != null && expected !== 0 && actual != null ? Number((actual / expected).toFixed(4)) : null
    };
    setBusy(true);
    setMessage('');
    try {
      await saveInspection(returnId, { inspection: updated, inspector_notes: notes || undefined });
      setEditing(false);
      setMessage('Inspection saved successfully. Risk and decision were not changed by the frontend.');
      await onSaved();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Inspection submission unavailable.');
    } finally {
      setBusy(false);
    }
  };

  if (!editable) return <InspectionCard inspection={inspection}/>;
  if (!editing) return <div className="inspection-entry"><InspectionCard inspection={inspection}/><div className="inspection-entry-actions"><button className="rg-btn-secondary" onClick={() => { setDraft(inspection || emptyInspection()); setEditing(true); }}><ClipboardCheck size={14}/>{inspection ? 'Edit Physical Inspection' : 'Open Physical Inspection'}</button><button className="rg-btn-primary" onClick={loadDemo}><WandSparkles size={14}/>Load Demo Inspection</button></div>{message && <div className="review-state" role="status">{message}</div>}</div>;

  return <div className="inspection-form">
    <div className="manual-review-heading"><div><span className="eyebrow">Warehouse input</span><h2>Physical Inspection</h2><p>Load optional demo values, review them, then submit. Opening this form does not persist an inspection.</p></div><ClipboardCheck size={22}/></div>
    <div className="inspection-fields">
      <fieldset><legend>Item present</legend><label><input type="radio" name="item-present" checked={draft.item_present} onChange={() => update('item_present', true)}/>Yes</label><label><input type="radio" name="item-present" checked={!draft.item_present} onChange={() => update('item_present', false)}/>No</label></fieldset>
      <label>Condition<select value={draft.condition} onChange={(event) => update('condition', event.target.value)}><option value="unknown">Unknown</option><option value="salable">Salable</option><option value="used">Used</option><option value="damaged">Damaged</option></select></label>
      <label>Expected weight (kg)<input type="number" step="0.001" readOnly={expectedWeightProvided} value={draft.expected_weight_kg ?? ''} onChange={(event) => update('expected_weight_kg', event.target.value === '' ? null : Number(event.target.value))}/><small>{expectedWeightProvided ? 'Provided by the return record' : 'Enter only when known'}</small></label>
      <label>Actual weight (kg)<input type="number" step="0.001" value={draft.actual_weight_kg ?? ''} onChange={(event) => update('actual_weight_kg', event.target.value === '' ? null : Number(event.target.value))}/></label>
      <div className="inspection-derived"><span>Weight difference</span><strong>{weightDifference == null ? '—' : `${weightDifference > 0 ? '+' : ''}${weightDifference.toFixed(3)} kg`}</strong></div>
      <fieldset><legend>Serial comparison performed</legend><label><input type="radio" name="serial-performed" checked={draft.serial_comparison_performed} onChange={() => update('serial_comparison_performed', true)}/>Yes</label><label><input type="radio" name="serial-performed" checked={!draft.serial_comparison_performed} onChange={() => { update('serial_comparison_performed', false); update('serial_mismatch', null); }}/>No</label></fieldset>
      <fieldset disabled={!draft.serial_comparison_performed}><legend>Serial mismatch</legend><label><input type="radio" name="serial-mismatch" checked={draft.serial_mismatch === true} onChange={() => update('serial_mismatch', true)}/>Yes</label><label><input type="radio" name="serial-mismatch" checked={draft.serial_mismatch === false} onChange={() => update('serial_mismatch', false)}/>No</label></fieldset>
      <fieldset><legend>Accessory comparison performed</legend><label><input type="radio" name="accessory-performed" checked={draft.accessory_comparison_performed} onChange={() => update('accessory_comparison_performed', true)}/>Yes</label><label><input type="radio" name="accessory-performed" checked={!draft.accessory_comparison_performed} onChange={() => update('accessory_comparison_performed', false)}/>No</label></fieldset>
      <label>Missing accessories<input disabled={!draft.accessory_comparison_performed} value={draft.missing_accessories.join(', ')} onChange={(event) => update('missing_accessories', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder="Comma-separated"/></label>
      <div className="inspection-derived"><span>Inspected at</span><strong>{inspection?.inspected_at || 'Assigned by the persistence service on submit'}</strong></div>
    </div>
    <label className="inspection-notes">Inspector notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional inspection notes"/></label>
    <div className="inspection-form-actions"><button className="rg-btn-secondary" onClick={loadDemo}><WandSparkles size={14}/>Load Demo Inspection</button><button className="rg-btn-primary" disabled={busy} onClick={submit}><Save size={14}/>{busy ? 'Saving…' : 'Submit Inspection'}</button></div>
    {message && <div className="review-state" role="status">{message}</div>}
  </div>;
}
