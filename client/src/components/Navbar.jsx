import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, Bell, Plus, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
        backgroundColor: 'rgba(14, 19, 31, 0.7)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
          {getPageTitle(location.pathname)}
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Welcome back, {user?.name || 'Athlete'} 👋
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: '#051a14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
            {user?.name?.split(' ')[0] || 'Profile'}
          </span>
        </div>
      </div>
    </header>
  );
};
