import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthLayout = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Brand Header */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#051a14',
            boxShadow: '0 0 20px var(--accent-primary-glow)',
          }}
        >
          <Flame size={24} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff' }}>
          PULSE
        </span>
      </Link>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Outlet />
      </div>

      <footer style={{ marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} Pulse Fitness Tracking. All rights reserved.
      </footer>
    </div>
  );
};
