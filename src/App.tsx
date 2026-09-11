import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { ControlledCasesPage } from './pages/ControlledCasesPage';
import { DashboardPage } from './pages/DashboardPage';
import { InvestigationsPage } from './pages/InvestigationsPage';
import { ManualReviewPage } from './pages/ManualReviewPage';
import { RaiseReturnPage } from './pages/RaiseReturnPage';
import { ReturnInvestigationPage } from './pages/ReturnInvestigationPage';
import { PhysicalInspectionPage } from './pages/PhysicalInspectionPage';

type Route = 'overview' | 'controlled-cases' | 'investigations' | 'manual-review' | 'raise-return' | 'investigation' | 'physical-inspection';

function resolveRoute() {
  const path = (window.location.hash ? window.location.hash.replace(/^#\/?/, '') : window.location.pathname.replace(/^\/?/, ''));
  const inspectionMatch = path.match(/^returns\/([^/]+)\/inspection$/);
  if (inspectionMatch) return { route: 'physical-inspection' as const, id: decodeURIComponent(inspectionMatch[1]) };
  if (path.startsWith('returns/')) return { route: 'investigation' as const, id: decodeURIComponent(path.slice(8)) };
  if (path === 'overview') return { route: 'overview' as const };
  if (path === 'investigations') return { route: 'investigations' as const };
  if (path === 'manual-review') return { route: 'manual-review' as const };
  if (path === 'raise-return') return { route: 'raise-return' as const };
  return { route: 'controlled-cases' as const };
}

export function App() {
  const initial = resolveRoute();
  const [route, setRoute] = useState<Route>(initial.route);
  const [returnId, setReturnId] = useState(initial.id || 'RTN-M08-002');
  useEffect(() => {
    const sync = () => { const next = resolveRoute(); setRoute(next.route); if (next.id) setReturnId(next.id); };
    window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);
  const navigate = (path: string) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); };
  const openReturn = (id: string) => navigate(`/returns/${encodeURIComponent(id)}`);
  const active = route === 'investigation' || route === 'physical-inspection' ? 'investigations' : route;
  return <AppShell currentTab={active} onSelectTab={(tab) => navigate(`/${tab}`)}>
    {route === 'overview' && <DashboardPage onNavigate={navigate} onSelectReturn={openReturn}/>}
    {route === 'controlled-cases' && <ControlledCasesPage onSelectReturn={openReturn}/>}
    {route === 'investigations' && <InvestigationsPage onSelectReturn={openReturn}/>}
    {route === 'manual-review' && <ManualReviewPage onSelectReturn={openReturn}/>}
    {route === 'raise-return' && <RaiseReturnPage onBack={() => navigate('/investigations')} onCreated={openReturn}/>}
    {route === 'investigation' && <ReturnInvestigationPage returnId={returnId} onBack={() => navigate('/investigations')} onOpenInspection={() => navigate(`/returns/${encodeURIComponent(returnId)}/inspection`)}/>}
    {route === 'physical-inspection' && <PhysicalInspectionPage returnId={returnId} onBack={() => navigate(`/returns/${encodeURIComponent(returnId)}`)}/>}
  </AppShell>;
}

export default App;
