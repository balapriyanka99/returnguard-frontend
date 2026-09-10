import React from 'react';
import { SourceType } from '../../api/types';
import { ShieldCheck, Database, Layers } from 'lucide-react';

export interface SourceFilterProps {
  selectedSource: SourceType | 'all';
  onChange: (source: SourceType | 'all') => void;
  controlledCount?: number;
  sourceBackedCount?: number;
  totalCount?: number;
}

export const SourceFilter: React.FC<SourceFilterProps> = ({
  selectedSource,
  onChange,
  controlledCount,
  sourceBackedCount,
  totalCount
}) => {
  const options: Array<{ id: SourceType | 'all'; label: string; icon: React.ElementType; count?: number }> = [
    { id: 'all', label: 'All Returns', icon: Layers, count: totalCount },
    { id: 'controlled', label: 'Controlled Demo', icon: ShieldCheck, count: controlledCount },
    { id: 'source_backed', label: 'Source-backed', icon: Database, count: sourceBackedCount }
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        backgroundColor: 'var(--color-bg-subtle)',
        padding: '3px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-subtle)',
        gap: '2px'
      }}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selectedSource === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: isSelected ? 600 : 500,
              color: isSelected ? 'var(--color-brand-navy-dark)' : 'var(--color-text-secondary)',
              backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
              boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
              border: isSelected ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon
              size={13}
              color={isSelected ? 'var(--color-brand-teal)' : 'currentColor'}
            />
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isSelected ? 'var(--color-brand-teal-light)' : 'rgba(0,0,0,0.05)',
                  color: isSelected ? 'var(--color-brand-teal-hover)' : 'inherit'
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
