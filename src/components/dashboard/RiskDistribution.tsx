import React from 'react';
import { DashboardRiskDistribution } from '../../api/types';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export interface RiskDistributionProps {
  distribution?: DashboardRiskDistribution;
  totalReturns?: number;
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({
  distribution,
  totalReturns
}) => {
  if (distribution?.low == null && distribution?.medium == null && distribution?.high == null) {
    return <div className="rg-card" style={{ minHeight: '180px' }}><div className="rg-card-header"><span className="rg-card-title"><ShieldCheck size={16} color="var(--color-brand-teal)"/>Risk Distribution</span></div><div className="empty-panel" style={{ padding: '30px 10px' }}>Aggregate risk distribution is unavailable.</div></div>;
  }
  const low = distribution?.low ?? 0;
  const medium = distribution?.medium ?? 0;
  const high = distribution?.high ?? 0;
  const total = (low + medium + high) || totalReturns || 1;

  const lowPct = ((low / total) * 100).toFixed(0);
  const medPct = ((medium / total) * 100).toFixed(0);
  const highPct = ((high / total) * 100).toFixed(0);

  return (
    <div className="rg-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <ShieldCheck size={16} color="var(--color-brand-teal)" />
          Risk Distribution
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {total} Assessed Returns
        </span>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            height: '14px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-subtle)',
            gap: '2px',
            marginBottom: '8px'
          }}
        >
          {low > 0 && (
            <div
              style={{
                width: `${lowPct}%`,
                backgroundColor: 'var(--color-risk-low)',
                transition: 'width 0.4s ease'
              }}
              title={`Low Risk: ${low} (${lowPct}%)`}
            />
          )}
          {medium > 0 && (
            <div
              style={{
                width: `${medPct}%`,
                backgroundColor: 'var(--color-risk-med)',
                transition: 'width 0.4s ease'
              }}
              title={`Medium Risk: ${medium} (${medPct}%)`}
            />
          )}
          {high > 0 && (
            <div
              style={{
                width: `${highPct}%`,
                backgroundColor: 'var(--color-risk-high)',
                transition: 'width 0.4s ease'
              }}
              title={`High Risk: ${high} (${highPct}%)`}
            />
          )}
        </div>
      </div>

      {/* Breakdown Legend Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {/* Low Risk */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-risk-low-bg)',
            border: '1px solid var(--color-risk-low-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--color-risk-low-text)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-risk-low)' }} />
            <span>Low (0–24)</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-risk-low-text)' }}>
            {distribution?.low !== null && distribution?.low !== undefined ? distribution.low : '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
            {lowPct}% of total
          </div>
        </div>

        {/* Medium Risk */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-risk-med-bg)',
            border: '1px solid var(--color-risk-med-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--color-risk-med-text)' }}>
            <AlertTriangle size={12} />
            <span>Medium (25–49)</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-risk-med-text)' }}>
            {distribution?.medium !== null && distribution?.medium !== undefined ? distribution.medium : '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
            {medPct}% of total
          </div>
        </div>

        {/* High Risk */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-risk-high-bg)',
            border: '1px solid var(--color-risk-high-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--color-risk-high-text)' }}>
            <AlertOctagon size={12} />
            <span>High (50–74)</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-risk-high-text)' }}>
            {distribution?.high !== null && distribution?.high !== undefined ? distribution.high : '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
            {highPct}% of total
          </div>
        </div>
      </div>
    </div>
  );
};
