import React from 'react';
import { EvidenceData, VisionData } from '../../api/types';
import { Image, Eye } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { formatDateTime } from '../../utils/formatters';

export interface EvidenceCardProps {
  evidence: EvidenceData | null;
  vision?: VisionData | null;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, vision }) => {
  if (!evidence || !evidence.available || !evidence.items?.length) {
    return (
      <div className="rg-card">
        <div className="rg-card-header">
          <span className="rg-card-title">
            <Image size={16} color="var(--color-brand-teal)" />
            Evidence &amp; Photos
          </span>
        </div>
        <EmptyState
          title="Evidence Store"
          message="No uploaded customer or warehouse media attachments recorded for this return."
          icon={Image}
          variant="subtle"
        />
      </div>
    );
  }

  return (
    <div className="rg-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <Image size={16} color="var(--color-brand-teal)" />
          Evidence Attachments
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {evidence.items.length} Files
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Evidence Items Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {evidence.items.map((item) => (
            <div
              key={item.evidence_id}
              style={{
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                backgroundColor: 'var(--color-bg-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  {item.stage.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--color-text-subtle)' }}>
                  {formatDateTime(item.observed_at)}
                </span>
              </div>

              {/* Visual preview or placeholder box */}
              <div
                style={{
                  height: '90px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-subtle)',
                  overflow: 'hidden'
                }}
              >
                {item.display_url && !item.display_url.startsWith('gs://') ? (
                  <img
                    src={item.display_url}
                    alt={item.title || 'Evidence file'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <Image size={24} />
                    <span style={{ fontSize: '11px' }}>{item.title || 'Attached Media'}</span>
                  </div>
                )}
              </div>

              {item.notes && (
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                  {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vision AI Section */}
        <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Eye size={13} color="var(--color-brand-teal)" />
            <span>Vision AI Analysis</span>
          </div>

          {!vision ? (
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              Visual assessment has not been performed yet.
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {vision.summary || 'Vision analysis completed.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
