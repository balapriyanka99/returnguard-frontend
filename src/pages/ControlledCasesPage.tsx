import { FlaskConical } from 'lucide-react';
import { ReturnQueue } from '../components/returns/ReturnQueue';

export function ControlledCasesPage({ onSelectReturn }: { onSelectReturn: (id: string) => void }) {
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">Prepared scenarios</span><h1>Controlled Cases</h1><p>Browse audited demonstration cases and open a case investigation.</p></div><div className="page-context"><FlaskConical size={16}/><span>Controlled Demo</span></div></div><div className="scenario-callout"><FlaskConical size={18}/><div><strong>Scenario library</strong><p>These prepared cases are read-only demonstration scenarios. Select one to inspect its evidence, intelligence, and lifecycle state.</p></div></div><ReturnQueue sourceType="controlled" onSelectReturn={onSelectReturn} emptyMessage="No controlled cases match this view."/></div>;
}
