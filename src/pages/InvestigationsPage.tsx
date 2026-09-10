import { SearchCheck } from 'lucide-react';
import { ReturnQueue } from '../components/returns/ReturnQueue';

export function InvestigationsPage({ onSelectReturn }: { onSelectReturn: (id: string) => void }) {
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">Operations queue</span><h1>Investigations</h1><p>Track returns by their current workflow state and continue case review.</p></div><div className="page-context"><SearchCheck size={16}/><span>All active sources</span></div></div><ReturnQueue onSelectReturn={onSelectReturn} emptyMessage="No investigations match this status."/></div>;
}
