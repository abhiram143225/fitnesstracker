import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Lock, Dumbbell, Target, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    height: 175,
    weight: 72,
    fitnessLevel: 'intermediate',
    fitnessGoal: 'build_muscle',
    weeklyWorkoutTarget: 4,
  });
  const [loading, setLoading] = useState(false);

  const { register, demoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please provide your name, email, and password', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profile: {
          height: Number(formData.height),
          weight: Number(formData.weight),
          fitnessLevel: formData.fitnessLevel,
          fitnessGoal: formData.fitnessGoal,
          weeklyWorkoutTarget: Number(formData.weeklyWorkoutTarget),
        },
      });
      showToast('Welcome to Pulse! Your fitness profile has been initialized.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please check your details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Create Account</h2>
        <p style={{ fontSize: '0.85rem' }}>Personalize your training parameters</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="athlete@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password (Min. 6 chars)</label>
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              name="height"
              className="form-input"
              value={formData.height}
              onChange={handleChange}
              min={100}
              max={250}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              className="form-input"
              value={formData.weight}
              onChange={handleChange}
              min={30}
              max={300}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Primary Fitness Goal</label>
          <select
            name="fitnessGoal"
            className="form-select"
            value={formData.fitnessGoal}
            onChange={handleChange}
          >
            <option value="build_muscle">💪 Build Muscle & Hypertrophy</option>
            <option value="lose_weight">🔥 Lose Fat & Weight</option>
            <option value="increase_strength">🏋️ Maximize Pure Strength</option>
            <option value="improve_endurance">🏃 Cardio & Athletic Endurance</option>
            <option value="maintain_fitness">⚡ General Health & Fitness</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Experience Level</label>
          <select
            name="fitnessLevel"
            className="form-select"
            value={formData.fitnessLevel}
            onChange={handleChange}
          >
            <option value="beginner">Beginner (0-1 years)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', marginTop: '12px', borderRadius: '10px' }}
        >
          {loading ? 'Creating Profile...' : 'Complete Registration'}
          <ArrowRight size={16} />
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};
