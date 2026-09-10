import React from 'react';
import { LucideIcon, Info } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  variant?: 'neutral' | 'subtle';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon: Icon = Info,
  actionText,
  onAction,
  variant = 'neutral'
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '28px 20px',
        backgroundColor: variant === 'neutral' ? 'var(--color-bg-subtle)' : 'transparent',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--color-border-subtle)',
        minHeight: '130px'
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          marginBottom: '10px',
          border: '1px solid var(--color-border-subtle)'
        }}
      >
        <Icon size={18} />
      </div>
      {title && (
        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          {title}
        </h4>
      )}
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', maxWidth: '340px', lineHeight: 1.4 }}>
        {message}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="rg-btn-secondary"
          style={{ marginTop: '12px', padding: '4px 10px', fontSize: '11px' }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
