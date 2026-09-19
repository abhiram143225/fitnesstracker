import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  Target,
  LineChart,
  Trophy,
  User,
  PlusCircle,
  LogOut,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/workouts', label: 'Workouts', icon: Dumbbell },
    { to: '/exercises', label: 'Exercise Library', icon: Dumbbell },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/progress', label: 'Analytics', icon: LineChart },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside
      style={{
        width: '260px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        zIndex: 40,
      }}
      className="desktop-sidebar"
    >
      {/* Brand Logo */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 8px',
          marginBottom: '32px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#051a14',
            boxShadow: '0 0 15px var(--accent-primary-glow)',
          }}
        >
          <Flame size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: '#fff' }}>
            PULSE
          </span>
          <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.1em' }}>
            FITNESS OS
          </span>
        </div>
      </div>

      {/* Quick Action: Log Workout */}
      <div style={{ marginBottom: '24px', padding: '0 4px' }}>
        <button
          onClick={() => navigate('/workouts/new')}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', borderRadius: '12px', justifyContent: 'center' }}
        >
          <PlusCircle size={18} />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-surface-hover)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all var(--transition-fast)',
              })}
            >
              <Icon size={19} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          onClick={() => navigate('/profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', overflow: 'hidden' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {user?.name || 'Athlete'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user?.profile?.fitnessLevel || 'Intermediate'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          className="btn-icon"
          style={{ padding: '8px', color: '#94a3b8' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
