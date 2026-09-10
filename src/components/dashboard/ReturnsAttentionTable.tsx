import React from 'react';
import { ReturnSummaryItem } from '../../api/types';
import { SourceBadge } from '../common/SourceBadge';
import { RiskBadge } from '../common/RiskBadge';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { formatRelativeAge } from '../../utils/formatters';
import { ArrowRight, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';

export interface ReturnsAttentionTableProps {
  returns: ReturnSummaryItem[];
  loading?: boolean;
  onSelectReturn: (returnId: string) => void;
  onViewAllClick?: () => void;
  title?: string;
  showViewAll?: boolean;
}

export const ReturnsAttentionTable: React.FC<ReturnsAttentionTableProps> = ({
  returns,
  loading,
  onSelectReturn,
  onViewAllClick,
  title = 'Returns Needing Your Attention',
  showViewAll = true
}) => {
  return (
    <div className="rg-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Table Header / Action Bar */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={17} color="var(--color-brand-teal)" />
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-subtle)',
              color: 'var(--color-text-muted)'
            }}
          >
            {returns.length}
          </span>
        </div>

        {showViewAll && onViewAllClick && (
          <button
            onClick={onViewAllClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-brand-teal)',
              cursor: 'pointer'
            }}
          >
            <span>View All Returns</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Table Body */}
      {loading ? (
        <LoadingState message="Loading returns..." />
      ) : returns.length === 0 ? (
        <EmptyState
          message="No returns match the current filter selection."
          variant="subtle"
        />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)'
                }}
              >
                <th style={{ padding: '10px 16px' }}>Return ID</th>
                <th style={{ padding: '10px 12px' }}>Source</th>
                <th style={{ padding: '10px 14px' }}>Customer</th>
                <th style={{ padding: '10px 14px' }}>Product</th>
                <th style={{ padding: '10px 12px' }}>Suspiciousness Risk</th>
                <th style={{ padding: '10px 14px' }}>Reason</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Age</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {returns.map((item) => {
                return (
                  <tr
                    key={item.return_id}
                    onClick={() => onSelectReturn(item.return_id)}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'background-color 0.1s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Return ID */}
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-brand-navy)' }}>
                      {item.return_id}
                    </td>

                    {/* Source */}
                    <td style={{ padding: '12px 12px' }}>
                      <SourceBadge sourceType={item.source_type} size="sm" />
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {item.customer.display_name}
                    </td>

                    {/* Product */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--color-bg-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-subtle)'
                          }}
                        >
                          <ShoppingBag size={13} />
                        </div>
                        <span
                          style={{
                            maxWidth: '220px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'var(--color-text-secondary)',
                            fontWeight: 500
                          }}
                          title={item.product.name}
                        >
                          {item.product.name}
                        </span>
                      </div>
                    </td>

                    {/* Current Risk */}
                    <td style={{ padding: '12px 12px' }}>
                      {item.risk ? (
                        <RiskBadge score={item.risk.score} band={item.risk.band} size="sm" />
                      ) : (
                        <span style={{ color: 'var(--color-text-subtle)', fontSize: '12px', fontWeight: 500 }}>
                          {item.assessment_at ? 'Undetermined' : '--'}
                        </span>
                      )}
                    </td>

                    {/* Reason */}
                    <td style={{ padding: '12px 14px', color: 'var(--color-text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.reason}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor:
                            item.status.toLowerCase().includes('approved')
                              ? 'var(--color-risk-low-bg)'
                              : item.status.toLowerCase().includes('investigation') || item.status.toLowerCase().includes('review')
                              ? 'var(--color-risk-med-bg)'
                              : 'var(--color-bg-subtle)',
                          color:
                            item.status.toLowerCase().includes('approved')
                              ? 'var(--color-risk-low-text)'
                              : item.status.toLowerCase().includes('investigation') || item.status.toLowerCase().includes('review')
                              ? 'var(--color-risk-med-text)'
                              : 'var(--color-text-secondary)'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Age */}
                    <td style={{ padding: '12px 14px', color: 'var(--color-text-subtle)', fontSize: '12px' }}>
                      {formatRelativeAge(item.requested_at)}
                    </td>

                    {/* Action Arrow */}
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-subtle)' }}>
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
