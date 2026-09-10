import React from 'react';
import { ProductIntelligence } from '../../api/types';
import { PackageCheck } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { formatPercent } from '../../utils/formatters';

export interface ProductIntelligenceCardProps {
  product: ProductIntelligence | null;
}

export const ProductIntelligenceCard: React.FC<ProductIntelligenceCardProps> = ({
  product
}) => {
  if (!product) {
    return (
      <div className="rg-card">
        <div className="rg-card-header">
          <span className="rg-card-title">
            <PackageCheck size={16} color="var(--color-brand-teal)" />
            Product Intelligence
          </span>
        </div>
        <EmptyState
          title="Product Profile"
          message="No product intelligence telemetry available for this SKU."
          variant="subtle"
        />
      </div>
    );
  }

  const { metrics, findings, limitations } = product;

  return (
    <div className="rg-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <PackageCheck size={16} color="var(--color-brand-teal)" />
          Product Intelligence
        </span>
        {metrics.sku && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-subtle)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-mono)'
            }}
          >
            {metrics.sku}
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Metric Comparison Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Historical Return Rate</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {formatPercent(metrics.historical_return_rate)}
            </div>
          </div>

          <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Category Baseline</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {formatPercent(metrics.category_return_rate)}
            </div>
          </div>

          <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Sample Size</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {metrics.sample_count ? `${metrics.sample_count} units` : '--'}
            </div>
          </div>
        </div>

        {/* Product Reason Breakdown if available */}
        {metrics.top_reasons && metrics.top_reasons.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Top Return Reasons for SKU
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {metrics.top_reasons.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <span style={{ width: '160px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.reason}
                  </span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${r.percentage}%`,
                        height: '100%',
                        backgroundColor: idx === 0 ? 'var(--color-brand-teal)' : '#94A3B8'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', width: '32px', textAlign: 'right' }}>
                    {r.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Findings */}
        {findings && findings.length > 0 && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            {findings.join(' ')}
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
    </div>
  );
};
