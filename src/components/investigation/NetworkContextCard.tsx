import React from 'react';
import { NetworkContextData } from '../../api/types';
import { Network, Link2, Info } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export interface NetworkContextCardProps {
  network: NetworkContextData | null;
}

export const NetworkContextCard: React.FC<NetworkContextCardProps> = ({ network }) => {
  if (!network || !network.available || network.relationship_count === 0) {
    return (
      <div className="rg-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="rg-card-header">
          <span className="rg-card-title">
            <Network size={16} color="var(--color-brand-teal)" />
            Network Context
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
            Contextual Only
          </span>
        </div>
        <EmptyState
          title="No relevant relationships"
          message="No relevant network relationships found."
          icon={Network}
          variant="subtle"
        />
      </div>
    );
  }

  const { relationships, relationship_count, cluster_notes } = network;

  return (
    <div className="rg-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <Network size={16} color="var(--color-brand-teal)" />
          Network Context
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-brand-teal-light)',
            color: 'var(--color-brand-teal-hover)',
            border: '1px solid var(--color-brand-teal-border)'
          }}
        >
          {relationship_count} Linked {relationship_count === 1 ? 'Entity' : 'Entities'}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cluster_notes && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            {cluster_notes}
          </div>
        )}

        {/* Relationships List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {relationships.map((rel, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-brand-teal)',
                  flexShrink: 0
                }}
              >
                <Link2 size={14} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {rel.relationship_type}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border-subtle)',
                      color: 'var(--color-text-muted)'
                    }}
                  >
                    Target: {rel.target_id}
                  </span>
                </div>

                {rel.details && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    {rel.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer / Contextual Callout */}
        <div
          style={{
            marginTop: 'auto',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--color-text-muted)'
          }}
        >
          <Info size={14} color="var(--color-text-subtle)" />
          <span>Network relationships provide contextual correlation only and do not establish fraud independently.</span>
        </div>
      </div>
    </div>
  );
};
