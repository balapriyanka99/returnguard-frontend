import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  size?: number;
  inline?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  size = 22,
  inline = false
}) => {
  if (inline) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
        <Loader2 size={size} className="rg-spin" style={{ animation: 'spin 1s linear infinite' }} />
        <span>{message}</span>
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        color: 'var(--color-text-muted)',
        minHeight: '140px'
      }}
    >
      <Loader2
        size={size}
        style={{
          color: 'var(--color-brand-teal)',
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }}
      />
      <span style={{ fontSize: '13px', fontWeight: 500 }}>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
