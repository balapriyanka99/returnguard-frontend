import { LayoutDashboard, RotateCcw, SearchCheck, PlusCircle, Sparkles, ShieldCheck, Store } from 'lucide-react';

export function Sidebar({ currentTab, onSelectTab }: { currentTab: string; onSelectTab: (tab: string) => void }) {
  const items = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'raise-return', label: 'Raise Return', icon: PlusCircle },
    { id: 'investigations', label: 'Investigations', icon: SearchCheck },
    { id: 'ask', label: 'Ask ReturnGuard', icon: Sparkles, badge: 'AI' }
  ];
  return <aside className="sidebar"><div><div className="brand"><span className="brand-mark"><ShieldCheck size={22}/></span><div><strong>Return<span>Guard</span></strong><small>Return intelligence</small></div></div><div className="nav-label">Workspace</div><nav>{items.map(({ id, label, icon: Icon, badge }) => <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => onSelectTab(id)}><Icon size={17}/><span>{label}</span>{badge && <em>{badge}</em>}</button>)}</nav></div><div className="merchant"><span><Store size={17}/></span><div><strong>Demo Merchant</strong><small>Return operations</small></div></div></aside>;
}
