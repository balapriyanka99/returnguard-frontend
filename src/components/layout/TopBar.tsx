import { Database, Plus, UserRound } from 'lucide-react';
import { config } from '../../api/client';

export function TopBar({ onRaiseReturnClick }: { onRaiseReturnClick: () => void; onSearchChange?: (value: string) => void }) {
  return <header className="topbar"><div className="environment"><Database size={14}/><span>{config.useMock ? 'Contract mock data' : 'FastAPI connected'}</span></div><div className="topbar-actions"><button className="rg-btn-primary" onClick={onRaiseReturnClick}><Plus size={16}/>Raise Return</button><span className="avatar"><UserRound size={16}/></span><div className="reviewer"><strong>Merchant review</strong><small>Investigation workspace</small></div></div></header>;
}
