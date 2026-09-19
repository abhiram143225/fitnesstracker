import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import heroBg from '../assets/fittrack_hero.jpg';

export const AuthLayout = () => {
  const { user } = useAuth();
  const { isBright } = useTheme();

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
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-primary)',
        transition: 'background-color var(--transition-normal), color var(--transition-normal)',
      }}
    >
      {/* Top Floating Theme Toggle */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 20 }}>
        <ThemeToggle size="sm" />
      </div>

      {/* Full-Page Background Image matching Frontend */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: 'center 38%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: isBright ? 0.88 : 0.95,
          filter: isBright ? 'brightness(0.78) contrast(1.08) saturate(1.05)' : 'brightness(1.06) contrast(1.06) saturate(1.12)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'opacity 0.3s ease, filter 0.3s ease',
        }}
      />

      {/* Ambient Gradient Overlay across full page for optimal readability and reduced brightness */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: isBright
            ? 'linear-gradient(180deg, rgba(215, 225, 238, 0.45) 0%, rgba(215, 225, 238, 0.25) 35%, rgba(200, 215, 230, 0.55) 70%, rgba(185, 202, 220, 0.85) 100%)'
            : 'linear-gradient(180deg, rgba(7, 11, 20, 0.45) 0%, rgba(7, 11, 20, 0.25) 35%, rgba(7, 11, 20, 0.6) 70%, rgba(7, 11, 20, 0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 0.3s ease',
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
            background: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isBright ? '#ffffff' : '#070b14',
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
            color: isBright ? '#0f172a' : '#ffffff',
          }}
        >
          Fit<span style={{ color: 'var(--accent-cyan)' }}>Track</span>
        </span>
      </Link>

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </div>

      <footer style={{ marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.8rem', position: 'relative', zIndex: 1 }}>
        © {new Date().getFullYear()} FitTrack. All rights reserved.
      </footer>
    </div>
  );
};
