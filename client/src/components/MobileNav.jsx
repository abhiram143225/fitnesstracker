import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Target,
  LineChart,
  Plus,
} from 'lucide-react';

export const MobileNav = () => {
  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        backgroundColor: 'rgba(14, 19, 31, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        padding: '0 8px',
      }}
    >
      <NavLink
        to="/dashboard"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: 600,
        })}
      >
        <LayoutDashboard size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/workouts"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: 600,
        })}
      >
        <Dumbbell size={20} />
        <span>Workouts</span>
      </NavLink>

      {/* Central Floating Plus */}
      <NavLink
        to="/workouts/new"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          color: '#051a14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px var(--accent-primary-glow)',
          transform: 'translateY(-12px)',
          border: '3px solid var(--bg-dark)',
        }}
      >
        <Plus size={24} strokeWidth={3} />
      </NavLink>

      <NavLink
        to="/goals"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: 600,
        })}
      >
        <Target size={20} />
        <span>Goals</span>
      </NavLink>

      <NavLink
        to="/progress"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontSize: '0.7rem',
          fontWeight: 600,
        })}
      >
        <LineChart size={20} />
        <span>Analytics</span>
      </NavLink>
    </nav>
  );
};
