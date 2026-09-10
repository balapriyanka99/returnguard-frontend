import React from 'react';
import { AssessmentHistoryResponse } from '../../api/types';
import { TrendingUp, Clock } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export interface RiskEvolutionProps {
  history?: AssessmentHistoryResponse | null;
}

export const RiskEvolution: React.FC<RiskEvolutionProps> = ({ history }) => {
  const items = history?.items || [];

  if (items.length === 0) {
    return (
      <div className="rg-card" style={{ marginBottom: '20px' }}>
        <div className="rg-card-header">
          <span className="rg-card-title">
            <TrendingUp size={16} color="var(--color-brand-teal)" />
            Risk Evolution
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Lifecycle History</span>
        </div>
        <div style={{ padding: '12px 0', fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          No historical assessment checkpoints recorded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rg-card" style={{ marginBottom: '20px' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <TrendingUp size={16} color="var(--color-brand-teal)" />
          Risk Evolution
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {items.length} Stage Checkpoints
        </span>
      </div>

      <div style={{ position: 'relative', padding: '16px 8px 8px 8px' }}>
        {/* Connecting Track Line */}
        <div
          style={{
            position: 'absolute',
            top: '36px',
            left: '30px',
            right: '30px',
            height: '2px',
            backgroundColor: 'var(--color-border-subtle)',
            zIndex: 1
          }}
        />

        {/* Checkpoint Nodes */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2
          }}
        >
          {items.map((item, idx) => {
            const hasRisk = item.risk !== null && item.risk !== undefined;
            const score = hasRisk ? item.risk!.score : null;
            const band = hasRisk ? item.risk!.band : null;

            let badgeBg = 'var(--color-bg-subtle)';
            let badgeText = 'var(--color-text-muted)';
            let badgeBorder = 'var(--color-border-subtle)';

            if (band === 'critical') {
              badgeBg = 'var(--color-risk-critical-bg)';
              badgeText = 'var(--color-risk-critical-text)';
              badgeBorder = 'var(--color-risk-critical-border)';
            } else if (band === 'high') {
              badgeBg = 'var(--color-risk-high-bg)';
              badgeText = 'var(--color-risk-high-text)';
              badgeBorder = 'var(--color-risk-high-border)';
            } else if (band === 'medium') {
              badgeBg = 'var(--color-risk-med-bg)';
              badgeText = 'var(--color-risk-med-text)';
              badgeBorder = 'var(--color-risk-med-border)';
            } else if (band === 'low') {
              badgeBg = 'var(--color-risk-low-bg)';
              badgeText = 'var(--color-risk-low-text)';
              badgeBorder = 'var(--color-risk-low-border)';
            }

            return (
              <div
                key={item.assessment_id || idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  minWidth: '70px'
                }}
              >
                {/* Node Pill */}
                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: badgeBg,
                    color: badgeText,
                    border: `1.5px solid ${badgeBorder}`,
                    fontSize: '12px',
                    fontWeight: 700,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    marginBottom: '8px'
                  }}
                >
                  {hasRisk ? score : '--'}
                </div>

                {/* Stage Title */}
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {item.stage_label || item.stage}
                </div>

                {/* Timestamp */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                  <Clock size={10} />
                  <span>{formatDateTime(item.assessment_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
