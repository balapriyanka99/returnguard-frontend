import React from 'react';
import { EconomicsData } from '../../api/types';
import { CircleDollarSign } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export interface EconomicsCardProps {
  economics: EconomicsData | null;
}

export const EconomicsCard: React.FC<EconomicsCardProps> = ({ economics }) => {
  if (!economics) {
    return (
      <div className="rg-card">
        <div className="rg-card-header">
          <span className="rg-card-title">
            <CircleDollarSign size={16} color="var(--color-brand-teal)" />
            Return Economics
          </span>
        </div>
        <EmptyState
          title="Financial Analysis"
          message="Economic breakdown is not calculated for this return yet."
          variant="subtle"
        />
      </div>
    );
  }

  const {
    item_value,
    reverse_logistics_cost,
    inspection_cost,
    recovery_value,
    net_return_cost,
    calculation_at
  } = economics;

  // Potential gross exposure is item value + logistics + inspection
  const totalCostBeforeRecovery = (item_value || 0) + (reverse_logistics_cost || 0) + (inspection_cost || 0);

  return (
    <div className="rg-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <CircleDollarSign size={16} color="var(--color-brand-teal)" />
          Return Economics
        </span>
        {calculation_at && (
          <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
            Calculated: {formatDateTime(calculation_at)}
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Cost Breakdown Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Item Value (Gross Refund)</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatCurrency(item_value)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Reverse Logistics Cost</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{formatCurrency(reverse_logistics_cost)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Warehouse Inspection &amp; Intake</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{formatCurrency(inspection_cost)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '6px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Estimated Item Recovery / Restock Value</span>
            <span style={{ fontWeight: 600, color: 'var(--color-risk-low-text)' }}>
              +{formatCurrency(recovery_value)}
            </span>
          </div>
        </div>

        {/* Net Exposure Summary Card */}
        <div
          style={{
            marginTop: 'auto',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-brand-navy-dark)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-brand-teal)', fontWeight: 600, textTransform: 'uppercase' }}>
              Potential Merchant Exposure
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>
              {formatCurrency(totalCostBeforeRecovery)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Net Return Cost</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F1F5F9' }}>
              {formatCurrency(net_return_cost)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
