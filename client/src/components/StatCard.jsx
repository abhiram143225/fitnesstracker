import React from 'react';

export const StatCard = ({ title, value, unit, icon: Icon, color = 'emerald', trend, subtitle }) => {
  const colorMap = {
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      color: '#10b981',
      shadow: '0 0 15px rgba(16, 185, 129, 0.15)',
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)',
      color: '#06b6d4',
      shadow: '0 0 15px rgba(6, 182, 212, 0.15)',
    },
    purple: {
      bg: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.25)',
      color: '#8b5cf6',
      shadow: '0 0 15px rgba(139, 92, 246, 0.15)',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      color: '#f59e0b',
      shadow: '0 0 15px rgba(245, 158, 11, 0.15)',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className="glass-card glass-card-glow" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: scheme.bg,
              border: `1px solid ${scheme.border}`,
              color: scheme.color,
              boxShadow: scheme.shadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{unit}</span>}
      </div>

      {(trend || subtitle) && (
        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {trend && (
            <span style={{ color: trend.startsWith('+') ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
              {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
