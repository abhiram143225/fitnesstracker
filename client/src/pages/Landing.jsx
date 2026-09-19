import React from 'react';
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
import heroBg from '../assets/fittrack_hero.jpg';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDashboardClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleSignInClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070b14',
        color: '#ffffff',
        fontFamily: 'var(--font-body)',
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hero Visual Section with Background Image */}
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Subtle Dark Gradient Overlay for optimal readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(7, 11, 20, 0.4) 0%, rgba(7, 11, 20, 0.7) 60%, #070b14 100%)',
            zIndex: 1,
          }}
        />

        {/* Top Navbar Header matching the UI image */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '24px 40px',
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
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#070b14',
                boxShadow: '0 0 16px rgba(6, 182, 212, 0.5)',
              }}
            >
              <Activity size={22} strokeWidth={2.8} />
            </div>
            <span
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              Fit<span style={{ color: '#06b6d4' }}>Track</span>
            </span>
          </div>

          {/* Top Right Buttons: Dashboard & Sign In matching the image */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Dashboard Button */}
            <button
              onClick={handleDashboardClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '999px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.25)';
                e.currentTarget.style.borderColor = '#06b6d4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <LayoutGrid size={17} color="#06b6d4" />
              <span>Dashboard</span>
            </button>

            {/* Sign In Button */}
            <button
              onClick={handleSignInClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '999px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <User size={17} color="#ffffff" />
              <span>{user ? user.name?.split(' ')[0] || 'Profile' : 'Sign In'}</span>
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
            padding: '40px 40px 60px',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Text Column matching the image */}
          <div style={{ flex: '1 1 450px', maxWidth: '580px' }}>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '20px',
                textTransform: 'uppercase',
              }}
            >
              DISCIPLINE <br />
              TODAY BUILDS <br />
              <span style={{ color: '#06b6d4' }}>THE STRONGER</span> <br />
              YOU TOMORROW.
            </h1>

            <div style={{ marginBottom: '32px' }}>
              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Small steps. Big changes. <br />
                Keep going!
              </p>
              {/* Cyan Accent Bar */}
              <div
                style={{
                  width: '56px',
                  height: '4px',
                  backgroundColor: '#06b6d4',
                  borderRadius: '2px',
                  marginTop: '12px',
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={handleDashboardClick}
                className="btn btn-primary"
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  color: '#070b14',
                  boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)',
                }}
              >
                <span>Launch Workout Tracker</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate('/exercises')}
                className="btn btn-secondary"
                style={{
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Dumbbell size={18} />
                <span>Exercise Library</span>
              </button>
            </div>
          </div>

          {/* Right Column: 5 Glassmorphism UI Metric Cards matching the image */}
          <div
            style={{
              flex: '0 1 420px',
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* 1. Heart Rate Card */}
            <div
              onClick={handleDashboardClick}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 16px rgba(244, 63, 94, 0.4)',
                  }}
                >
                  <Heart size={22} fill="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 500 }}>
                    Heart Rate
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>72</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>bpm</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingUp size={12} /> 12% vs yesterday
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
                  <path
                    d="M2 18 C 10 8, 20 24, 30 14 C 40 4, 50 20, 58 10"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <ChevronRight size={18} color="rgba(255, 255, 255, 0.4)" />
              </div>
            </div>

            {/* 2. Blood Pressure Card */}
            <div
              onClick={handleDashboardClick}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
                  }}
                >
                  <Droplet size={22} fill="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 500 }}>
                    Blood Pressure
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>118/76</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>mmHg</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingDown size={12} /> 5% vs yesterday
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
                  <path
                    d="M2 14 C 15 22, 35 6, 58 14"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <ChevronRight size={18} color="rgba(255, 255, 255, 0.4)" />
              </div>
            </div>

            {/* 3. Steps Walked Card */}
            <div
              onClick={handleDashboardClick}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#070b14',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Footprints size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 500 }}>
                    Steps Walked
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>8,532</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>steps</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingUp size={12} /> 18% vs yesterday
                  </div>
                </div>
              </div>

              {/* Bar Columns Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px' }}>
                  <div style={{ width: '4px', height: '10px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                  <div style={{ width: '4px', height: '16px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                  <div style={{ width: '4px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                  <div style={{ width: '4px', height: '22px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                  <div style={{ width: '4px', height: '18px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                </div>
                <ChevronRight size={18} color="rgba(255, 255, 255, 0.4)" />
              </div>
            </div>

            {/* 4. Calories Burned Card */}
            <div
              onClick={handleDashboardClick}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <Flame size={22} fill="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 500 }}>
                    Calories Burned
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>482</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>kcal</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                    <TrendingUp size={12} /> 22% vs yesterday
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
                  <path
                    d="M2 20 C 12 6, 25 24, 38 12 C 48 4, 54 16, 58 8"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <ChevronRight size={18} color="rgba(255, 255, 255, 0.4)" />
              </div>
            </div>

            {/* 5. Your Fitness Journey Card */}
            <div
              onClick={handleDashboardClick}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#06b6d4',
                  }}
                >
                  <Target size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>
                    Your Fitness Journey
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                    Track • Improve • Achieve
                  </div>
                </div>
              </div>

              <ChevronRight size={18} color="rgba(255, 255, 255, 0.4)" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section Below Hero */}
      <section
        style={{
          padding: '80px 40px',
          maxWidth: '1300px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
            Core Platform Pillars
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
            Engineered for Serious Athletic Progress
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass-card glass-card-glow">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Dumbbell size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#fff' }}>Dynamic Workout Logger</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Log reps, weights (kg), RPE intensity (1-10), and audio-assisted rest timers set-by-set in real time with instant technique instructions.
            </p>
          </div>

          <div className="glass-card glass-card-glow">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#fff' }}>Smart Goal Tracking</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Set weight targets, weekly consistency streaks, and strength milestones with automated workout progress calculations.
            </p>
          </div>

          <div className="glass-card glass-card-glow">
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <LineChart size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#fff' }}>Advanced Analytics</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Visualize total volume progression, caloric burn rates, muscle group distribution, and workout frequency over time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
