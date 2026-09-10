import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export interface AppShellProps {
  children: React.ReactNode;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onRaiseReturnClick: () => void;
  onSearchChange?: (val: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  currentTab,
  onSelectTab,
  onRaiseReturnClick,
  onSearchChange
}) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-bg-app)' }}>
      {/* Dark Navy Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} />

      {/* Main Body */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <TopBar
          onRaiseReturnClick={onRaiseReturnClick}
          onSearchChange={onSearchChange}
        />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
};
