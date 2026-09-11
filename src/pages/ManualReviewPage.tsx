import { ClipboardCheck, Info } from 'lucide-react';
import { ReturnQueue } from '../components/returns/ReturnQueue';

const requiresReview = (item: { status: string }) => item.status.toLowerCase().includes('review');

export function ManualReviewPage({ onSelectReturn }: { onSelectReturn: (id: string) => void }) {
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">Human judgement</span><h1>Manual Review</h1><p>Cases whose current workflow status indicates reviewer attention.</p></div><div className="page-context"><ClipboardCheck size={16}/><span>Reviewer queue</span></div></div><div className="integration-notice"><Info size={17}/><div><strong>Mock review controls are available on the case</strong><p>Actions persist locally in mock mode and do not manufacture risk or decision changes.</p></div></div><ReturnQueue filter={requiresReview} onSelectReturn={onSelectReturn} emptyMessage="No cases currently have a review status."/></div>;
}
