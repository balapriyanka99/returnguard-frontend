import React from 'react';
import { SourceType } from '../../api/types';
import { ShieldCheck, Database } from 'lucide-react';

export interface SourceBadgeProps {
  sourceType: SourceType;
  size?: 'sm' | 'md';
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceType, size = 'md' }) => {
  const isControlled = sourceType === 'controlled';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: size === 'sm' ? '2px 7px' : '3px 9px',
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 600,
        borderRadius: 'var(--radius-sm)',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        backgroundColor: isControlled ? 'var(--color-source-controlled-bg)' : 'var(--color-source-live-bg)',
        color: isControlled ? 'var(--color-source-controlled-text)' : 'var(--color-source-live-text)',
        border: `1px solid ${isControlled ? 'var(--color-source-controlled-border)' : 'var(--color-source-live-border)'}`
      }}
    >
      {isControlled ? (
        <>
          <ShieldCheck size={size === 'sm' ? 12 : 13} />
          <span>Controlled Demo</span>
        </>
      ) : (
        <>
          <Database size={size === 'sm' ? 12 : 13} />
          <span>Source-backed</span>
        </>
      )}
    </span>
  );
};
