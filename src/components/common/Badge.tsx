import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          background: 'var(--color-risk-low-bg)',
          color: 'var(--color-risk-low-text)',
          borderColor: 'var(--color-risk-low-border)'
        };
      case 'warning':
        return {
          background: 'var(--color-risk-med-bg)',
          color: 'var(--color-risk-med-text)',
          borderColor: 'var(--color-risk-med-border)'
        };
      case 'danger':
        return {
          background: 'var(--color-risk-high-bg)',
          color: 'var(--color-risk-high-text)',
          borderColor: 'var(--color-risk-high-border)'
        };
      case 'info':
        return {
          background: 'var(--color-brand-teal-light)',
          color: 'var(--color-brand-teal-hover)',
          borderColor: 'var(--color-brand-teal-border)'
        };
      case 'neutral':
        return {
          background: 'var(--color-neutral-badge-bg)',
          color: 'var(--color-neutral-badge-text)',
          borderColor: 'var(--color-neutral-badge-border)'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--color-text-secondary)',
          borderColor: 'var(--color-border-subtle)'
        };
      default:
        return {
          background: 'var(--color-bg-subtle)',
          color: 'var(--color-text-secondary)',
          borderColor: 'var(--color-border-subtle)'
        };
    }
  };

  const style = getVariantStyles();

  return (
    <span
      className={clsx('rg-badge', className)}
      style={{
        ...style,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '2px 6px' : '3px 8px',
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 600,
        borderRadius: 'var(--radius-sm)',
        border: '1px solid',
        lineHeight: 1.2,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </span>
  );
};
