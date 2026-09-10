import { ClipboardCheck, FlaskConical, LayoutDashboard, PlusCircle, SearchCheck, Shield } from 'lucide-react';

export function Sidebar({ currentTab, onSelectTab }: { currentTab: string; onSelectTab: (tab: string) => void }) {
  const items = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'controlled-cases', label: 'Controlled Cases', icon: FlaskConical },
    { id: 'investigations', label: 'Investigations', icon: SearchCheck },
    { id: 'manual-review', label: 'Manual Review', icon: ClipboardCheck },
    { id: 'raise-return', label: 'Raise Test Return', icon: PlusCircle }
  ];
  return <aside className="sidebar"><div><div className="brand"><span className="brand-mark"><Shield size={25}/><b>R</b></span><div><strong>Return<span>Guard</span></strong><small>Return Intelligence Platform</small></div></div><div className="nav-label">Return operations</div><nav>{items.map(({ id, label, icon: Icon }) => <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => onSelectTab(id)}><Icon size={17}/><span>{label}</span></button>)}</nav></div><div className="product-footer"><span>RG</span><div><strong>Ecommerce returns intelligence</strong><small>Investigation &amp; decision support</small></div></div></aside>;
}
