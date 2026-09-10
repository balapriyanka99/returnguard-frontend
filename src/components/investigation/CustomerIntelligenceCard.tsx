import React from 'react';
import { CustomerIntelligence } from '../../api/types';
import { User, UserCheck } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export interface CustomerIntelligenceCardProps {
  customer: CustomerIntelligence | null;
}

export const CustomerIntelligenceCard: React.FC<CustomerIntelligenceCardProps> = ({
  customer
}) => {
  if (!customer) {
    return (
      <div className="rg-card">
        <div className="rg-card-header">
          <span className="rg-card-title">
            <User size={16} color="var(--color-brand-teal)" />
            Customer Intelligence
          </span>
        </div>
        <EmptyState
          title="Customer Profile"
          message="No customer intelligence data available for this entity."
          variant="subtle"
        />
      </div>
    );
  }

  const { metrics, summary, findings, limitations, data_state } = customer;

  const isInsufficient =
    data_state === 'insufficient_history' ||
    (metrics.order_count !== undefined && metrics.order_count <= 1 && metrics.return_count === 0);

  return (
    <div className="rg-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <User size={16} color="var(--color-brand-teal)" />
          Customer Intelligence
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg-subtle)',
            color: 'var(--color-text-secondary)'
          }}
        >
          {data_state === 'live_source' ? 'Operational Source' : 'Audited History'}
        </span>
      </div>

      {isInsufficient ? (
        <EmptyState
          title="Insufficient customer history"
          message="Insufficient customer historical activity for a reliable behavioral baseline comparison."
          icon={UserCheck}
          variant="subtle"
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Orders</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {metrics.order_count ?? '--'}
              </div>
            </div>

            <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Total Spend</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {metrics.total_spend !== undefined ? formatCurrency(metrics.total_spend) : '--'}
              </div>
            </div>

            <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Returns</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {metrics.return_count ?? '--'}
              </div>
            </div>

            <div
              style={{
                padding: '8px 10px',
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid transparent'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Return Rate</div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)'
                }}
              >
                {metrics.return_rate !== undefined ? formatPercent(metrics.return_rate) : '--'}
              </div>
            </div>
          </div>

          {/* Summary Text */}
          {summary && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              {summary}
            </div>
          )}

          {/* Behavioral Findings */}
          {findings && findings.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Observed Patterns
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                {findings.map((f, idx) => (
                  <li key={idx} style={{ marginBottom: '2px' }}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Limitations */}
          {limitations && limitations.length > 0 && (
            <div style={{ marginTop: 'auto', fontSize: '11px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
              <span style={{ fontWeight: 600 }}>Limitations: </span>
              <span>{limitations.join(' • ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
