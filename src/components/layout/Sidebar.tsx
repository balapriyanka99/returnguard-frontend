import { ClipboardCheck, FlaskConical, LayoutDashboard, PlusCircle, SearchCheck } from 'lucide-react';

function ReturnGuardMark() {
  return <svg viewBox="0 0 48 52" aria-hidden="true" className="returnguard-mark">
    <path className="mark-shield" d="M24 2 44 9v15c0 12.8-7.8 21.8-20 26C11.8 45.8 4 36.8 4 24V9L24 2Z"/>
    <path className="mark-r" d="M14 15h15.5c5.3 0 8.5 2.8 8.5 7.1 0 4.1-3 6.7-7.7 7.1H25l11 11H27L14 27h14.8c1.8 0 3-1 3-2.7 0-1.6-1.2-2.6-3-2.6H20v18.6h-6V15Z"/>
    <path className="mark-guard" d="m31.5 33.5 4.5 4.6 7.2-8"/>
  </svg>;
}

export function Sidebar({ currentTab, onSelectTab }: { currentTab: string; onSelectTab: (tab: string) => void }) {
  const items = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'controlled-cases', label: 'Controlled Cases', icon: FlaskConical },
    { id: 'investigations', label: 'Investigations', icon: SearchCheck },
    { id: 'manual-review', label: 'Manual Review', icon: ClipboardCheck },
    { id: 'raise-return', label: 'Raise Test Return', icon: PlusCircle }
  ];
  return <aside className="sidebar"><div><div className="brand"><span className="brand-mark"><ReturnGuardMark/></span><div><strong>Return<span>Guard</span></strong><small>Return Intelligence Platform</small></div></div><div className="nav-label">Return operations</div><nav>{items.map(({ id, label, icon: Icon }) => <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => onSelectTab(id)}><Icon size={17}/><span>{label}</span></button>)}</nav></div></aside>;
}
