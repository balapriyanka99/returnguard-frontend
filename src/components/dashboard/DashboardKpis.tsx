import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { DashboardCounts, DashboardFinancials } from '../../api/types';
import { RotateCcw, CheckCircle, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export interface DashboardKpisProps {
  counts?: DashboardCounts;
  financials?: DashboardFinancials;
  loading?: boolean;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({
  counts,
  financials,
  loading
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}
    >
      <MetricCard
        title="Total Returns"
        value={loading ? null : counts?.total_returns}
        subtitle="Audited pool + Live"
        icon={RotateCcw}
        iconColor="#0284C7"
        iconBg="#E0F2FE"
      />

      <MetricCard
        title="Auto Approved"
        value={loading ? null : counts?.auto_approved}
        subtitle={counts?.auto_approved && counts?.total_returns ? `${((counts.auto_approved / counts.total_returns) * 100).toFixed(1)}%` : undefined}
        icon={CheckCircle}
        iconColor="var(--color-risk-low)"
        iconBg="var(--color-risk-low-bg)"
      />

      <MetricCard
        title="Needs Review"
        value={loading ? null : counts?.needs_review}
        subtitle="Decision data unavailable"
        icon={AlertTriangle}
        iconColor="var(--color-risk-med)"
        iconBg="var(--color-risk-med-bg)"
      />

      <MetricCard
        title="Rejected"
        value={loading ? null : counts?.rejected}
        subtitle="Policy non-compliant"
        icon={XCircle}
        iconColor="var(--color-risk-high)"
        iconBg="var(--color-risk-high-bg)"
      />

      <MetricCard
        title="Loss Prevented"
        value={loading ? null : (financials?.loss_prevented !== null && financials?.loss_prevented !== undefined ? formatCurrency(financials.loss_prevented) : '--')}
        subtitle="Estimated savings"
        icon={ShieldAlert}
        iconColor="var(--color-brand-teal)"
        iconBg="var(--color-brand-teal-light)"
      />
    </div>
  );
};
