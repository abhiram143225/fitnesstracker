import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Dumbbell,
  Target,
  LineChart,
  Trophy,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { user, demoLogin } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleDemoAccess = () => {
    demoLogin();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          height: '80px',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(7, 9, 14, 0.8)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#051a14',
              boxShadow: '0 0 15px var(--accent-primary-glow)',
            }}
          >
            <Flame size={24} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff' }}>
            PULSE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Open Dashboard
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-secondary">
                Sign In
              </button>
              <button onClick={handleGetStarted} className="btn btn-primary">
                Get Started Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '80px 24px 60px',
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <div
          className="badge badge-emerald"
          style={{ marginBottom: '20px', padding: '6px 16px', fontSize: '0.85rem' }}
        >
          <Zap size={14} /> Full-Stack Fitness Operating System
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '24px',
            background: 'linear-gradient(180deg, #ffffff 30%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Track Workouts with Precision. <br />
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Crush Your Limits.
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          An elite fitness companion with set-by-set workout logging, progressive overload tracking, 
          intelligent goal monitoring, and performance analytics powered by React, Express, and MongoDB.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            Start Your Journey
            <ArrowRight size={18} />
          </button>
          <button
            onClick={handleDemoAccess}
            className="btn btn-secondary"
            style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '14px' }}
          >
            ⚡ Try Instant Demo
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '70px',
            textAlign: 'left',
          }}
        >
          <div className="glass-card glass-card-glow">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Dumbbell size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Dynamic Workout Logger</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Log reps, weight, RPE, and rest intervals set-by-set in real time. Full exercise database with step instructions.
            </p>
          </div>

          <div className="glass-card glass-card-glow">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#06b6d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Smart Goal Tracking</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Set weight targets, weekly consistency streaks, and strength milestones with automatic progress calculations.
            </p>
          </div>

          <div className="glass-card glass-card-glow">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <LineChart size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Advanced Analytics</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Visualize volume trends, calorie burn rates, muscle group distribution, and workout frequency over time.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '40px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
          <span>⚛️ React 18 & Vite</span>
          <span>⚡ Express.js REST API</span>
          <span>🍃 MongoDB Atlas & Mongoose</span>
          <span>🔒 JWT Authentication</span>
          <span>📊 Recharts Data Visualizations</span>
        </div>
      </section>
    </div>
  );
};
