import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in both email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      showToast('Welcome back! Logged in successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Check your credentials or try Demo Mode.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    demoLogin();
    showToast('Logged in with Demo Athlete profile!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Welcome Back</h2>
        <p style={{ fontSize: '0.85rem' }}>Sign in to continue your fitness journey</p>
      </div>

      {/* Demo Account Quick Access */}
      <div
        onClick={handleDemoAccess}
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          border: '1px dashed var(--accent-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>1-Click Instant Demo</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Explore without creating an account</div>
          </div>
        </div>
        <ArrowRight size={16} color="#10b981" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              className="form-input"
              placeholder="athlete@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="flex-between" style={{ marginBottom: '4px' }}>
            <label className="form-label">Password</label>
          </div>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', marginTop: '12px', borderRadius: '10px' }}
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight size={16} />
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Don't have an account yet?{' '}
        <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
          Create Account
        </Link>
      </div>
    </div>
  );
};
