import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useReturns } from '../hooks/useReturns';
import { DashboardKpis } from '../components/dashboard/DashboardKpis';
import { SourceFilter } from '../components/dashboard/SourceFilter';
import { RiskDistribution } from '../components/dashboard/RiskDistribution';
import { ReturnsAttentionTable } from '../components/dashboard/ReturnsAttentionTable';
import { SourceType } from '../api/types';
import { Plus, RefreshCw, Layers } from 'lucide-react';

export interface DashboardPageProps {
  onSelectReturn: (returnId: string) => void;
  onNavigateToReturns: () => void;
  onRaiseReturnClick: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectReturn,
  onNavigateToReturns,
  onRaiseReturnClick
}) => {
  const [selectedSource, setSelectedSource] = useState<SourceType | 'all'>('all');
  const { data: dashboardData, loading: dashLoading, refresh: refreshDash } = useDashboard();
  
  const { data: returnsData, loading: returnsLoading, refresh: refreshReturns } = useReturns({
    source_type: selectedSource === 'all' ? undefined : selectedSource
  });

  const handleSourceChange = (src: SourceType | 'all') => {
    setSelectedSource(src);
  };

  const handleRefreshAll = () => {
    refreshDash();
    refreshReturns();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-brand-navy-dark)', letterSpacing: '-0.02em' }}>
            Merchant Overview Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            AI-powered return risk signals, policy evaluation, and operational returns queue.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Source Selector Filter */}
          <SourceFilter
            selectedSource={selectedSource}
            onChange={handleSourceChange}
            controlledCount={dashboardData?.counts.controlled_returns}
            sourceBackedCount={dashboardData?.counts.source_backed_returns}
            totalCount={dashboardData?.counts.total_returns}
          />

          {/* Refresh Button */}
          <button
            onClick={handleRefreshAll}
            className="rg-btn-secondary"
            title="Refresh dashboard telemetry"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Top KPI Metric Cards */}
      <DashboardKpis
        counts={dashboardData?.counts}
        financials={dashboardData?.financials}
        loading={dashLoading}
      />

      {/* Main Dashboard Two-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '20px' }}>
        {/* Left Column: Returns Attention Table */}
        <div>
          <ReturnsAttentionTable
            returns={returnsData?.items || []}
            loading={returnsLoading}
            onSelectReturn={onSelectReturn}
            onViewAllClick={onNavigateToReturns}
            title={
              selectedSource === 'controlled'
                ? 'Controlled Demo Returns Needing Attention'
                : selectedSource === 'source_backed'
                ? 'Source-backed Returns Queue'
                : 'Returns Needing Your Attention'
            }
          />
        </div>

        {/* Right Column: Risk Distribution & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Risk Distribution Card */}
          <RiskDistribution
            distribution={dashboardData?.risk_distribution}
            totalReturns={dashboardData?.counts.total_returns}
          />

          {/* Source Data Hierarchy Card */}
          <div className="rg-card" style={{ backgroundColor: 'var(--color-brand-navy-dark)', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Layers size={16} color="var(--color-brand-teal)" />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Data Provenance</span>
            </div>
            <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.4, marginBottom: '14px' }}>
              ReturnGuard evaluates both <strong>Controlled Demo</strong> benchmark cases and live <strong>Source-backed</strong> returns created through verified Customer & Order hierarchies.
            </p>
            <button
              onClick={onRaiseReturnClick}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-brand-teal)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '13px',
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              <span>Raise New Return</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
