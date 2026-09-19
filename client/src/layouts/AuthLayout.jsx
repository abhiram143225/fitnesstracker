import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroBg from '../assets/fittrack_hero.jpg';

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
        backgroundColor: '#070b14',
      }}
    >
      {/* Full-Page Background Image matching Frontend */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: 'center 38%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.95,
          filter: 'brightness(1.06) contrast(1.06) saturate(1.12)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Subtle Ambient Gradient Overlay across full page */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 11, 20, 0.45) 0%, rgba(7, 11, 20, 0.25) 35%, rgba(7, 11, 20, 0.6) 70%, rgba(7, 11, 20, 0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Brand Header */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
          textDecoration: 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#06b6d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#070b14',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.55)',
          }}
        >
          <Activity size={24} strokeWidth={2.8} />
        </div>
        <span
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          Fit<span style={{ color: '#06b6d4' }}>Track</span>
        </span>
      </Link>

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </div>

      <footer style={{ marginTop: '32px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', position: 'relative', zIndex: 1 }}>
        © {new Date().getFullYear()} FitTrack. All rights reserved.
      </footer>
    </div>
  );
};
