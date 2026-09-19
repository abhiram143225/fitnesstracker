import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({
  style = {},
  className = '',
  showLabel = true,
  size = 'md', // 'sm' | 'md' | 'lg'
}) => {
  const { isBright, toggleTheme } = useTheme();

  // When page is in bright theme -> button says "Dark" with Moon icon
  // When page is in dark theme -> button says "Bright" with Sun icon
  const labelText = isBright ? 'Dark' : 'Bright';

  const defaultStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 24px' : '10px 20px',
    borderRadius: '999px',
    backgroundColor: isBright ? '#e2eaf3' : 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(16px)',
    border: isBright ? '1px solid rgba(0, 0, 0, 0.14)' : '1px solid rgba(255, 255, 255, 0.18)',
    color: isBright ? '#0f172a' : '#ffffff',
    fontSize: size === 'sm' ? '0.82rem' : '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isBright ? '0 2px 8px rgba(0, 0, 0, 0.06)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
    userSelect: 'none',
    ...style,
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      style={defaultStyle}
      title={`Switch to ${labelText} Theme`}
      aria-label={`Switch to ${labelText} Theme`}
      onMouseEnter={(e) => {
        if (isBright) {
          e.currentTarget.style.backgroundColor = '#d2dee9';
          e.currentTarget.style.borderColor = '#059669';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else {
          e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
          e.currentTarget.style.borderColor = '#10b981';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (isBright) {
          e.currentTarget.style.backgroundColor = '#e2eaf3';
          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.14)';
          e.currentTarget.style.transform = 'translateY(0)';
        } else {
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {isBright ? (
        <Moon size={size === 'sm' ? 15 : 18} color="#0f172a" strokeWidth={2.3} />
      ) : (
        <Sun size={size === 'sm' ? 15 : 18} color="#fbbf24" strokeWidth={2.3} />
      )}
      {showLabel && (
        <span style={{ color: isBright ? '#0f172a' : '#ffffff', letterSpacing: '0.01em' }}>
          {labelText}
        </span>
      )}
    </button>
  );
};
