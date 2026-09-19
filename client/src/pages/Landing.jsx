import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  User,
  Heart,
  Droplet,
  Footprints,
  Flame,
  Target,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  Dumbbell,
  LineChart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import heroBg from '../assets/fittrack_hero.jpg';

export const Landing = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isBright } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleAction = () => {
    logout();
    navigate('/register');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color var(--transition-normal), color var(--transition-normal)',
      }}
    >
      {/* CSS Keyframes for Jiggle / Jiggle Card Animation */}
      <style>{`
        @keyframes jiggleCard {
          0% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.03) rotate(-1.5deg) translateY(-3px); }
          40% { transform: scale(1.03) rotate(1.5deg) translateY(-3px); }
          60% { transform: scale(1.03) rotate(-1deg) translateY(-3px); }
          80% { transform: scale(1.03) rotate(1deg) translateY(-3px); }
          100% { transform: scale(1.03) rotate(0deg) translateY(-3px); }
        }
        .metric-card-jiggle {
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .metric-card-jiggle:hover {
          animation: jiggleCard 0.45s ease-in-out forwards;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35), 0 0 24px rgba(6, 182, 212, 0.25);
        }
      `}</style>

      {/* Full-Page Background Image (Covers Hero + 3 Core Platform Pillars) */}
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

      {/* Ambient Gradient Overlay across full page for optimal text and card readability */}
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

      {/* Hero Visual Section */}
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        {/* Top Navbar Header */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '24px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* FitTrack Logo */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none',
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
                color: isBright ? '#09111e' : '#ffffff',
              }}
            >
              Fit<span style={{ color: 'var(--accent-cyan)' }}>Track</span>
            </span>
          </div>

          {/* Top Right Buttons: Theme Toggle (beside Dashboard), Dashboard & Sign In */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Dark / Bright Theme Button - Beside Dashboard Button */}
            <ThemeToggle />

            {/* Dashboard Button */}
            <button
              onClick={handleAction}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '999px',
                backgroundColor: isBright ? 'rgba(236, 242, 248, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                border: isBright ? '1px solid rgba(0, 0, 0, 0.16)' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isBright ? '#09111e' : '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isBright ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (isBright) {
                  e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.18)';
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.25)';
                  e.currentTarget.style.borderColor = '#06b6d4';
                }
              }}
              onMouseLeave={(e) => {
                if (isBright) {
                  e.currentTarget.style.backgroundColor = 'rgba(236, 242, 248, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.16)';
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                }
              }}
            >
              <LayoutGrid size={18} color="var(--accent-cyan)" />
              <span>Dashboard</span>
            </button>

            {/* Sign In Button */}
            <button
              onClick={handleAction}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '999px',
                backgroundColor: isBright ? 'rgba(217, 227, 237, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                border: isBright ? '1px solid rgba(0, 0, 0, 0.16)' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isBright ? '#09111e' : '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isBright ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (isBright) {
                  e.currentTarget.style.backgroundColor = '#cad6e3';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.25)';
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (isBright) {
                  e.currentTarget.style.backgroundColor = 'rgba(217, 227, 237, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.16)';
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                }
              }}
            >
              <User size={18} color={isBright ? '#09111e' : '#ffffff'} />
              <span>Sign In</span>
            </button>
          </div>
        </header>

        {/* Main Hero Content Area */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
            padding: '40px 48px 60px',
            gap: '48px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Text Column */}
          <div style={{ flex: '1 1 480px', maxWidth: '620px' }}>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: isBright ? '#0f172a' : '#ffffff',
                marginBottom: '24px',
                textTransform: 'uppercase',
                textShadow: isBright ? '0 2px 10px rgba(255, 255, 255, 0.8)' : '0 4px 20px rgba(0, 0, 0, 0.8)',
              }}
            >
              DISCIPLINE <br />
              TODAY BUILDS <br />
              <span style={{ color: 'var(--accent-cyan)', textShadow: isBright ? 'none' : '0 0 30px rgba(6, 182, 212, 0.5)' }}>THE STRONGER</span> <br />
              YOU TOMORROW.
            </h1>

            <div style={{ marginBottom: '36px' }}>
              <p
                style={{
                  fontSize: '1.25rem',
                  color: isBright ? '#334155' : 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  margin: 0,
                  textShadow: isBright ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                Small steps. Big changes. <br />
                Keep going!
              </p>
              {/* Cyan Accent Bar */}
              <div
                style={{
                  width: '60px',
                  height: '4px',
                  backgroundColor: 'var(--accent-cyan)',
                  borderRadius: '2px',
                  marginTop: '14px',
                  boxShadow: '0 0 14px rgba(6, 182, 212, 0.75)',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAction}
                className="btn btn-primary"
                style={{
                  padding: '14px 30px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                <span>Launch Workout Tracker</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleAction}
                className="btn btn-secondary"
                style={{
                  padding: '14px 26px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                }}
              >
                <Dumbbell size={18} />
                <span>Exercise Library</span>
              </button>
            </div>
          </div>

          {/* Right Column: 5 Metric Cards with Jiggle Animation on Hover */}
          <div
            style={{
              flex: '0 1 430px',
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* 1. Heart Rate Card */}
            <div
              className="metric-card-jiggle"
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-light)',
                borderRadius: '20px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 18px rgba(244, 63, 94, 0.45)',
                  }}
                >
                  <Heart size={24} fill="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Heart Rate
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>72</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>bpm</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingUp size={13} /> 12% vs yesterday
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div>
                <svg width="64" height="30" viewBox="0 0 60 28" fill="none">
                  <path
                    d="M2 18 C 10 8, 20 24, 30 14 C 40 4, 50 20, 58 10"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 2. Blood Pressure Card */}
            <div
              className="metric-card-jiggle"
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-light)',
                borderRadius: '20px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 18px rgba(6, 182, 212, 0.45)',
                  }}
                >
                  <Droplet size={24} fill="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Blood Pressure
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>118/76</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>mmHg</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingDown size={13} /> 5% vs yesterday
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div>
                <svg width="64" height="30" viewBox="0 0 60 28" fill="none">
                  <path
                    d="M2 14 C 15 22, 35 6, 58 14"
                    stroke="var(--accent-cyan)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 3. Steps Walked Card */}
            <div
              className="metric-card-jiggle"
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-light)',
                borderRadius: '20px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#070b14',
                    boxShadow: '0 0 18px rgba(16, 185, 129, 0.45)',
                  }}
                >
                  <Footprints size={24} strokeWidth={2.5} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Steps Walked
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>8,532</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>steps</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingUp size={13} /> 18% vs yesterday
                  </div>
                </div>
              </div>

              {/* Bar Columns Indicator */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px' }}>
                <div style={{ width: '4px', height: '10px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
                <div style={{ width: '4px', height: '18px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
                <div style={{ width: '4px', height: '14px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
                <div style={{ width: '4px', height: '24px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
                <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
              </div>
            </div>

            {/* 4. Calories Burned Card */}
            <div
              className="metric-card-jiggle"
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-light)',
                borderRadius: '20px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 18px rgba(245, 158, 11, 0.45)',
                  }}
                >
                  <Flame size={24} fill="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Calories Burned
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>482</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>kcal</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingUp size={13} /> 22% vs yesterday
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div>
                <svg width="64" height="30" viewBox="0 0 60 28" fill="none">
                  <path
                    d="M2 20 C 12 6, 25 24, 38 12 C 48 4, 54 16, 58 8"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 5. Your Fitness Journey Card */}
            <div
              className="metric-card-jiggle"
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-light)',
                borderRadius: '20px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 18px rgba(139, 92, 246, 0.45)',
                  }}
                >
                  <Target size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    Your Fitness Journey
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Track • Improve • Achieve
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingUp size={13} /> Active Streak: 7 Days
                  </div>
                </div>
              </div>

              {/* Progress Ring / Target Badge Indicator */}
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: 'var(--accent-purple)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                LEVEL 4
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section Below Hero */}
      <section
        style={{
          padding: '80px 48px',
          maxWidth: '1300px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
            Core Platform Pillars
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Engineered for Serious Athletic Progress
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div
            className="glass-card glass-card-glow"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '20px',
              padding: '28px 24px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 0 20px var(--accent-primary-glow)' }}>
              <Dumbbell size={26} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 700 }}>Dynamic Workout Logger</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Log reps, weights (kg), RPE intensity (1-10), and audio-assisted rest timers set-by-set in real time with instant technique instructions.
            </p>
          </div>

          <div
            className="glass-card glass-card-glow"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '20px',
              padding: '28px 24px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
              <Target size={26} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 700 }}>Smart Goal Tracking</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Set weight targets, weekly consistency streaks, and strength milestones with automated workout progress calculations.
            </p>
          </div>

          <div
            className="glass-card glass-card-glow"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: '20px',
              padding: '28px 24px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}>
              <LineChart size={26} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 700 }}>Advanced Analytics</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Visualize total volume progression, caloric burn rates, muscle group distribution, and workout frequency over time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
