import React from 'react';
import { ReturnDetailResponse } from '../../api/types';
import { SourceBadge } from '../common/SourceBadge';
import { ArrowLeft, Package, Calendar, User, ShoppingBag } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

export interface InvestigationHeaderProps {
  data: ReturnDetailResponse;
  onBack: () => void;
}

export const InvestigationHeader: React.FC<InvestigationHeaderProps> = ({
  data,
  onBack
}) => {
  const { return_id, source_type, return: rInfo } = data;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '20px'
      }}
    >
      {/* Top Bar with Back Link and Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-brand-teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Returns</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SourceBadge sourceType={source_type} />
        </div>
      </div>

      {/* Main Entity Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '24px',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid var(--color-border-subtle)'
        }}
      >
        {/* Product Visual Icon / Box */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-brand-teal)'
          }}
        >
          <Package size={32} />
        </div>

        {/* Core Product and Case Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-brand-navy-dark)' }}>
              {return_id}
            </h1>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-subtle)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)'
              }}
            >
              Status: {rInfo.status}
            </span>
          </div>

          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
            {rInfo.product_name || `Product #${rInfo.product_id}`}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShoppingBag size={14} />
              <span>Order #{rInfo.order_id} (Item #{rInfo.order_item_id})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={14} />
              <span>{rInfo.customer_name || `User #${rInfo.user_id}`}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} />
              <span>Requested {formatDate(rInfo.requested_at)}</span>
            </div>
          </div>
        </div>

        {/* Value and Price */}
        <div style={{ textAlign: 'right', paddingLeft: '16px', borderLeft: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Item Value / Sale Price
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-brand-navy-dark)' }}>
            {formatCurrency(rInfo.sale_price)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
            Reason: {rInfo.reason}
          </div>
        </div>
      </div>
    </div>
  );
};
