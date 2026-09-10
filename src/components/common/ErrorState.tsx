import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load',
  message,
  onRetry
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '30px 20px',
        backgroundColor: 'var(--color-risk-high-bg)',
        border: '1px solid var(--color-risk-high-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-risk-high-text)'
      }}
    >
      <AlertCircle size={24} style={{ marginBottom: '8px' }} />
      <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{title}</h4>
      <p style={{ fontSize: '12px', opacity: 0.9, maxWidth: '380px', marginBottom: onRetry ? '12px' : '0' }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-risk-high-border)',
            color: 'var(--color-risk-high-text)',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={13} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
