import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { RaiseReturnPage } from './pages/RaiseReturnPage';
import { ReturnInvestigationPage } from './pages/ReturnInvestigationPage';
import { ReturnsPage } from './pages/ReturnsPage';

type Route = 'overview' | 'returns' | 'raise-return' | 'investigation';

export function App() {
  const [route, setRoute] = useState<Route>('returns');
  const [returnId, setReturnId] = useState('RTN-M08-002');

  useEffect(() => {
    const sync = () => {
      const path = (window.location.hash ? window.location.hash.replace(/^#\/?/, '') : window.location.pathname.replace(/^\/?/, ''));
      if (path.startsWith('returns/')) {
        setReturnId(decodeURIComponent(path.slice('returns/'.length)));
        setRoute('investigation');
      } else if (path === 'raise-return') setRoute('raise-return');
      else if (path === 'overview') setRoute('overview');
      else setRoute('returns');
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);

  const navigate = (path: string) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); };
  const openReturn = (id: string) => navigate(`/returns/${encodeURIComponent(id)}`);
  const active = route === 'investigation' ? 'investigations' : route;

  return (
    <AppShell currentTab={active} onSelectTab={(tab) => {
      if (tab === 'investigations' || tab === 'ask') openReturn('RTN-M08-002');
      else navigate(`/${tab}`);
    }} onRaiseReturnClick={() => navigate('/raise-return')}>
      {route === 'returns' && <ReturnsPage onSelectReturn={openReturn} onRaiseReturnClick={() => navigate('/raise-return')} />}
      {route === 'investigation' && <ReturnInvestigationPage returnId={returnId} onBack={() => navigate('/returns')} />}
      {route === 'raise-return' && <RaiseReturnPage onBack={() => navigate('/returns')} onCreated={openReturn} />}
      {route === 'overview' && <DashboardPage onSelectReturn={openReturn} onNavigateToReturns={() => navigate('/returns')} onRaiseReturnClick={() => navigate('/raise-return')} />}
    </AppShell>
  );
}

export default App;
