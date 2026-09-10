import React from 'react';
import { RiskBand } from '../../api/types';

export interface RiskBadgeProps {
  score?: number | null;
  band?: RiskBand | string | null;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  band,
  size = 'md',
  showScore = true
}) => {
  if (score === null && !band) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: size === 'sm' ? '2px 6px' : size === 'lg' ? '6px 12px' : '3px 8px',
          fontSize: size === 'sm' ? '11px' : size === 'lg' ? '14px' : '12px',
          fontWeight: 600,
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-neutral-badge-bg)',
          color: 'var(--color-neutral-badge-text)',
          border: '1px solid var(--color-neutral-badge-border)'
        }}
      >
        --
      </span>
    );
  }

  // Derive band if only score provided
  let effectiveBand: RiskBand = 'low';
  if (band) {
    effectiveBand = band.toLowerCase() as RiskBand;
  } else if (score !== undefined && score !== null) {
    if (score >= 75) effectiveBand = 'critical';
    else if (score >= 50) effectiveBand = 'high';
    else if (score >= 25) effectiveBand = 'medium';
    else effectiveBand = 'low';
  }

  const getStyles = () => {
    switch (effectiveBand) {
      case 'critical':
        return { bg: 'var(--color-risk-critical-bg)', color: 'var(--color-risk-critical-text)', border: 'var(--color-risk-critical-border)', label: 'Critical' };
      case 'high':
        return {
          bg: 'var(--color-risk-high-bg)',
          color: 'var(--color-risk-high-text)',
          border: 'var(--color-risk-high-border)',
          label: 'High'
        };
      case 'medium':
        return {
          bg: 'var(--color-risk-med-bg)',
          color: 'var(--color-risk-med-text)',
          border: 'var(--color-risk-med-border)',
          label: 'Medium'
        };
      case 'low':
      default:
        return {
          bg: 'var(--color-risk-low-bg)',
          color: 'var(--color-risk-low-text)',
          border: 'var(--color-risk-low-border)',
          label: 'Low'
        };
    }
  };

  const current = getStyles();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '2px 7px' : size === 'lg' ? '5px 12px' : '3px 9px',
        fontSize: size === 'sm' ? '11px' : size === 'lg' ? '13px' : '12px',
        fontWeight: 700,
        borderRadius: size === 'lg' ? 'var(--radius-md)' : 'var(--radius-sm)',
        backgroundColor: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        lineHeight: 1.2,
        whiteSpace: 'nowrap'
      }}
    >
      {showScore && score !== undefined && score !== null ? (
        <span>{score}</span>
      ) : null}
      {(!showScore || score === undefined || score === null) ? (
        <span>{current.label}</span>
      ) : (
        <span style={{ fontWeight: 500, opacity: 0.85 }}>({current.label})</span>
      )}
    </span>
  );
};
