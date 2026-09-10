import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number | null | undefined;
  subtitle?: string | null;
  trend?: string | null;
  trendPositive?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive,
  icon: Icon,
  iconColor = 'var(--color-brand-teal)',
  iconBg = 'var(--color-brand-teal-light)'
}) => {
  const displayValue = value === null || value === undefined ? '--' : value;

  return (
    <div
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '110px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: iconBg,
              color: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
          {displayValue}
        </div>

        {(trend || subtitle) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '12px' }}>
            {trend && (
              <span
                style={{
                  fontWeight: 600,
                  color: trendPositive ? 'var(--color-risk-low-text)' : 'var(--color-risk-high-text)'
                }}
              >
                {trend}
              </span>
            )}
            {subtitle && (
              <span style={{ color: 'var(--color-text-subtle)' }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
