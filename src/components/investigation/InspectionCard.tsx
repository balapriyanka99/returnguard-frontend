import React from 'react';
import { InspectionData } from '../../api/types';
import { ClipboardCheck } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { formatDateTime } from '../../utils/formatters';

export interface InspectionCardProps {
  inspection: InspectionData | null;
}

export const InspectionCard: React.FC<InspectionCardProps> = ({ inspection }) => {
  if (!inspection || !inspection.available) {
    return (
      <div className="rg-card">
        <div className="rg-card-header">
          <span className="rg-card-title">
            <ClipboardCheck size={16} color="var(--color-brand-teal)" />
            Physical Inspection
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-subtle)',
              color: 'var(--color-text-muted)'
            }}
          >
            Pending
          </span>
        </div>
        <EmptyState
          title="Inspection Pending"
          message="No warehouse inspection is available yet. Physical verification will be recorded upon parcel intake."
          icon={ClipboardCheck}
          variant="subtle"
        />
      </div>
    );
  }

  const {
    item_present,
    condition,
    expected_weight_kg,
    actual_weight_kg,
    weight_delta_kg,
    serial_comparison_performed,
    serial_mismatch,
    accessory_comparison_performed,
    missing_accessories,
    inspected_at
  } = inspection;

  return (
    <div className="rg-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <ClipboardCheck size={16} color="var(--color-brand-teal)" />
          Warehouse Inspection
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
          {formatDateTime(inspected_at)}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Verification Checkpoints */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {/* Item Presence */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: item_present ? 'var(--color-risk-low-bg)' : 'var(--color-risk-high-bg)',
              border: `1px solid ${item_present ? 'var(--color-risk-low-border)' : 'var(--color-risk-high-border)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: item_present ? 'var(--color-risk-low-text)' : 'var(--color-risk-high-text)' }}>
              Item Present
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: item_present ? 'var(--color-risk-low-text)' : 'var(--color-risk-high-text)' }}>
              {item_present ? 'Verified present' : 'Not present'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
              Condition: {condition.replace('_', ' ')}
            </div>
          </div>

          {/* Serial Number Check */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: !serial_comparison_performed ? 'var(--color-bg-subtle)' : serial_mismatch ? 'var(--color-risk-high-bg)' : 'var(--color-risk-low-bg)',
              border: `1px solid ${!serial_comparison_performed ? 'var(--color-border-subtle)' : serial_mismatch ? 'var(--color-risk-high-border)' : 'var(--color-risk-low-border)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: !serial_comparison_performed ? 'var(--color-text-muted)' : serial_mismatch ? 'var(--color-risk-high-text)' : 'var(--color-risk-low-text)' }}>
              Serial Matching
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: !serial_comparison_performed ? 'var(--color-text-primary)' : serial_mismatch ? 'var(--color-risk-high-text)' : 'var(--color-risk-low-text)' }}>
              {serial_comparison_performed ? (serial_mismatch ? 'Mismatch: Yes' : 'Mismatch: No') : 'Not compared'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
              {!serial_comparison_performed ? 'No serial result available' : serial_mismatch ? 'Returned item differs from shipped record' : 'Compared with shipped record'}
            </div>
          </div>

          {/* Weight Delta Check */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Weight Telemetry
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {actual_weight_kg !== null ? `${actual_weight_kg.toFixed(3)} kg` : '--'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
              Expected: {expected_weight_kg ? `${expected_weight_kg.toFixed(2)} kg` : '--'} (
              {weight_delta_kg !== null ? `${weight_delta_kg > 0 ? '+' : ''}${weight_delta_kg}kg` : '--'}
              )
            </div>
          </div>
        </div>

        {/* Accessory verification details */}
        {accessory_comparison_performed && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', padding: '8px 12px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontWeight: 600 }}>Accessories Verification: </span>
            {missing_accessories && missing_accessories.length > 0 ? (
              <span style={{ color: 'var(--color-risk-high-text)', fontWeight: 600 }}>
                Missing: {missing_accessories.join(', ')}
              </span>
            ) : (
              <span style={{ color: 'var(--color-risk-low-text)', fontWeight: 500 }}>
                All in-box standard accessories accounted for
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
