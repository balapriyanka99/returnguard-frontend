import React from 'react';
import { DecisionData } from '../../api/types';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export interface DecisionCardProps {
  decision: DecisionData | null;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => {
  if (!decision) {
    return (
      <div className="rg-card" style={{ borderLeft: '4px solid #CBD5E1', marginBottom: '20px' }}>
        <div className="rg-card-header">
          <span className="rg-card-title">
            <Clock size={16} color="var(--color-text-muted)" />
            Recommended Decision
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-subtle)',
              color: 'var(--color-text-muted)'
            }}
          >
            Pending
          </span>
        </div>
        <EmptyState
          title="Decision assessment pending"
          message="ReturnGuard has not generated an automated policy decision yet. Assessment will finalize once physical or evidence verification is registered."
          icon={Clock}
          variant="subtle"
        />
      </div>
    );
  }

  const isHoldOrReview =
    decision.recommended_action.toLowerCase().includes('hold') ||
    decision.recommended_action.toLowerCase().includes('investigate') ||
    decision.recommended_action.toLowerCase().includes('reject');

  return (
    <div
      className="rg-card"
      style={{
        borderLeft: `4px solid ${isHoldOrReview ? 'var(--color-risk-high)' : 'var(--color-risk-low)'}`,
        marginBottom: '20px'
      }}
    >
      <div className="rg-card-header">
        <span className="rg-card-title">
          {isHoldOrReview ? (
            <AlertCircle size={16} color="var(--color-risk-high)" />
          ) : (
            <CheckCircle size={16} color="var(--color-risk-low)" />
          )}
          Recommended Decision
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isHoldOrReview ? 'var(--color-risk-high-bg)' : 'var(--color-risk-low-bg)',
            color: isHoldOrReview ? 'var(--color-risk-high-text)' : 'var(--color-risk-low-text)',
            border: `1px solid ${isHoldOrReview ? 'var(--color-risk-high-border)' : 'var(--color-risk-low-border)'}`
          }}
        >
          {decision.status}
        </span>
      </div>

      {/* Action Title */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
          Recommended Action
        </div>
        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-brand-navy-dark)' }}>
          {decision.recommended_action}
        </div>
      </div>

      {/* Confidence & Policy Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '10px 12px',
          backgroundColor: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '14px'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Confidence</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {decision.confidence}
          </div>
        </div>

        {decision.policy_name && (
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Policy Matched</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }} title={decision.policy_name}>
              {decision.policy_name}
            </div>
          </div>
        )}
      </div>

      {/* Policy Explanation */}
      {decision.policy_explanation && (
        <div style={{ marginBottom: '12px', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
          {decision.policy_explanation}
        </div>
      )}

      {/* Verification Level / Timeline */}
      {(decision.verification_level || decision.refund_timeline) && (
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px' }}>
          {decision.verification_level && (
            <div>
              <span style={{ fontWeight: 600 }}>Verification: </span>
              <span>{decision.verification_level}</span>
            </div>
          )}
          {decision.refund_timeline && (
            <div>
              <span style={{ fontWeight: 600 }}>Refund Timeline: </span>
              <span>{decision.refund_timeline}</span>
            </div>
          )}
        </div>
      )}

      {/* Decision Limitations */}
      {decision.limitations && decision.limitations.length > 0 && (
        <div style={{ marginTop: '10px', padding: '8px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', marginBottom: '2px' }}>
            Known Limitations
          </div>
          <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: '#92400E' }}>
            {decision.limitations.map((lim, lIdx) => (
              <li key={lIdx}>{lim}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
