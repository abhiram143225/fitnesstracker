import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields validation
    if (!email.trim()) {
      showToast('Email address is required to log in', 'error');
      return;
    }
    if (!password) {
      showToast('Password is required to log in', 'error');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      showToast('Logged in successfully! Fetching your real account data.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Athlete Sign In</h2>
        <p style={{ fontSize: '0.85rem' }}>Enter your credentials to access your fitness records</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address *</label>
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
            <label className="form-label">Password *</label>
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
          {loading ? 'Verifying Credentials...' : 'Sign In'}
          <ArrowRight size={16} />
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Don't have an account yet?{' '}
        <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
          Create New Account
        </Link>
      </div>
    </div>
  );
};
