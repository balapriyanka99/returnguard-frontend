import React from 'react';
import { RiskData } from '../../api/types';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export interface RiskFactorsProps {
  risk: RiskData | null;
}

export const RiskFactors: React.FC<RiskFactorsProps> = ({ risk }) => {
  if (!risk || (!risk.signal_contributions?.length && !risk.reason_codes?.length)) {
    return (
      <div className="rg-card" style={{ marginBottom: '20px' }}>
        <div className="rg-card-header">
          <span className="rg-card-title">
            <ShieldCheck size={16} color="var(--color-brand-teal)" />
            Risk Factors & Signals
          </span>
        </div>
        <EmptyState
          message="No active risk signals or reason codes registered for this return."
          icon={ShieldCheck}
          variant="subtle"
        />
      </div>
    );
  }

  const { signal_contributions, limitations } = risk;

  return (
    <div className="rg-card" style={{ marginBottom: '20px' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <AlertCircle size={16} color="var(--color-brand-teal)" />
          Risk Factors & Signals
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {signal_contributions?.length || 0} Deterministic Factors
        </span>
      </div>

      {/* Signal Contributions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {signal_contributions.map((signal, idx) => {
          const isHigh = signal.severity === 'high';
          const isMed = signal.severity === 'medium';

          return (
            <div
              key={idx}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isHigh ? 'var(--color-risk-high-bg)' : isMed ? 'var(--color-risk-med-bg)' : 'var(--color-bg-subtle)',
                border: `1px solid ${isHigh ? 'var(--color-risk-high-border)' : isMed ? 'var(--color-risk-med-border)' : 'var(--color-border-subtle)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isHigh ? 'var(--color-risk-high)' : isMed ? 'var(--color-risk-med)' : 'var(--color-risk-low)'
                    }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {signal.name}
                  </span>
                  {signal.contribution_pct !== undefined && (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      ({signal.contribution_pct}%)
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
                  {signal.supporting_fact}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: '#FFFFFF',
                    color: isHigh ? 'var(--color-risk-high-text)' : isMed ? 'var(--color-risk-med-text)' : 'var(--color-text-muted)',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  {signal.source.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Limitations if provided */}
      {limitations && limitations.length > 0 && (
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
          <span style={{ fontWeight: 600 }}>Assessment Context: </span>
          <span>{limitations.join(' • ')}</span>
        </div>
      )}
    </div>
  );
};
