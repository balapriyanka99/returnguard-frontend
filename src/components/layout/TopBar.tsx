import { Database, ShieldCheck } from 'lucide-react';
import { config } from '../../api/client';

export function TopBar() {
  return <header className="topbar"><div className="topbar-product"><ShieldCheck size={16}/><span>Ecommerce Returns Intelligence</span></div><div className="environment"><Database size={14}/><span>{config.useMock ? 'Demo data · API contract mode' : 'FastAPI connected'}</span></div></header>;
}
