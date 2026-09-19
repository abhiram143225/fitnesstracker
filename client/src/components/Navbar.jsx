import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Dashboard Overview';
      case '/workouts': return 'Workout History';
      case '/workouts/new': return 'Log New Workout';
      case '/exercises': return 'Exercise Directory';
      case '/goals': return 'Fitness Goals & Targets';
      case '/progress': return 'Performance Analytics';
      case '/calendar': return 'Workout Calendar';
      case '/profile': return 'User Profile & Settings';
      default: return 'Fitness Tracker';
    }
  };

  return (
    <header
      style={{
        height: '70px',
        padding: '0 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-nav)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          {getPageTitle(location.pathname)}
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Welcome back, {user?.name || 'Athlete'} 👋
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme Toggle Button */}
        <ThemeToggle size="sm" />

        <button
          onClick={() => navigate('/workouts/new')}
          className="btn btn-primary btn-sm hide-desktop-btn"
          style={{ display: 'none' }}
        >
          <Plus size={16} />
          <span>Log</span>
        </button>

        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-surface-elevated)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: 'var(--btn-primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.name?.split(' ')[0] || 'Profile'}
          </span>
        </div>
      </div>
    </header>
  );
};
