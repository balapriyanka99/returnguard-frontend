import React from 'react';
import { LucideIcon, Clock } from 'lucide-react';

export interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  phase: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon: Icon,
  phase
}) => {
  return (
    <div style={{ maxWidth: '640px', margin: '60px auto', textAlign: 'center' }}>
      <div className="rg-card" style={{ padding: '40px 32px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-brand-teal-light)',
            color: 'var(--color-brand-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}
        >
          <Icon size={24} />
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-brand-navy-dark)', marginBottom: '8px' }}>
          {title}
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
          {description}
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-muted)'
          }}
        >
          <Clock size={13} />
          <span>Scheduled for {phase}</span>
        </div>
      </div>
    </div>
  );
};
