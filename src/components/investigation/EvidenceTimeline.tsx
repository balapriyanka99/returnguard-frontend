import React from 'react';
import { TimelineEvent } from '../../api/types';
import { History, CheckCircle2, AlertOctagon } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export interface EvidenceTimelineProps {
  events: TimelineEvent[];
}

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="rg-card" style={{ marginBottom: '20px' }}>
        <div className="rg-card-header">
          <span className="rg-card-title">
            <History size={16} color="var(--color-brand-teal)" />
            Evidence Timeline
          </span>
        </div>
        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
          No timeline events recorded for this return.
        </div>
      </div>
    );
  }

  return (
    <div className="rg-card" style={{ marginBottom: '20px' }}>
      <div className="rg-card-header">
        <span className="rg-card-title">
          <History size={16} color="var(--color-brand-teal)" />
          Evidence Timeline
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {events.length} Recorded Events
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '8px' }}>
        {events.map((evt, idx) => {
          const isLast = idx === events.length - 1;
          const isFlag = evt.severity === 'flag';
          const isSuccess = evt.severity === 'success';
          const accent = isFlag ? 'var(--color-risk-high)' : isSuccess ? 'var(--color-risk-low)' : 'var(--color-brand-teal)';
          const background = isFlag ? '#FFF8F8' : isSuccess ? '#F3FBF7' : 'var(--color-bg-subtle)';
          const border = isFlag ? 'var(--color-risk-high-border)' : isSuccess ? 'var(--color-risk-low-border)' : 'var(--color-border-subtle)';

          return (
            <div key={evt.id || idx} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
              {/* Timeline Connector Dot & Line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isFlag ? 'var(--color-risk-high-bg)' : isSuccess ? 'var(--color-risk-low-bg)' : 'var(--color-brand-teal-light)',
                    border: `1.5px solid ${accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accent,
                    flexShrink: 0
                  }}
                >
                  {isFlag ? <AlertOctagon size={13} /> : <CheckCircle2 size={13} />}
                </div>

                {!isLast && (
                  <div
                    style={{
                      width: '2px',
                      flex: 1,
                      backgroundColor: 'var(--color-border-subtle)',
                      marginTop: '4px',
                      marginBottom: '4px'
                    }}
                  />
                )}
              </div>

              {/* Event Content Card */}
              <div
                className={`timeline-event timeline-${evt.severity || 'normal'}`}
                style={{
                  flex: 1,
                  backgroundColor: background,
                  border: `1px solid ${border}`,
                  borderLeft: `4px solid ${accent}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  marginBottom: isLast ? 0 : '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {evt.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border-subtle)',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {evt.source_indicator}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      {formatDateTime(evt.timestamp)}
                    </span>
                  </div>
                </div>

                {evt.facts && evt.facts.length > 0 && (
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {evt.facts.map((fact, fIdx) => (
                      <li key={fIdx} style={{ marginBottom: '2px' }}>
                        {fact}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
