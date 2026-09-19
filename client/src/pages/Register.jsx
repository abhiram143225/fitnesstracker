import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Lock, Dumbbell, Target, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    height: 175,
    weight: 70,
    fitnessLevel: 'intermediate',
    fitnessGoal: 'build_muscle',
    weeklyWorkoutTarget: 4,
    dailyCalorieTarget: 2200,
    dailyWaterTarget: 2500,
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Strict validation
    if (!formData.name.trim()) {
      showToast('Full Name is required', 'error');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      showToast('A valid email address is required', 'error');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (!formData.height || Number(formData.height) <= 50) {
      showToast('Please provide a valid height in cm', 'error');
      return;
    }
    if (!formData.weight || Number(formData.weight) <= 20) {
      showToast('Please provide a valid weight in kg', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        profile: {
          height: Number(formData.height),
          weight: Number(formData.weight),
          fitnessLevel: formData.fitnessLevel,
          fitnessGoal: formData.fitnessGoal,
          weeklyWorkoutTarget: Number(formData.weeklyWorkoutTarget),
          dailyCalorieTarget: Number(formData.dailyCalorieTarget),
          dailyWaterTarget: Number(formData.dailyWaterTarget),
        },
      });
      showToast('Account successfully created! Starting with clean 0 stats.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please check all fields.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '36px 32px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '24px',
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.15)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px', color: '#ffffff' }}>Create Account</h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>All fields are required to calculate your BMI and recommendations</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
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
          <label className="form-label">Email Address *</label>
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
          <label className="form-label">Password * (Min. 6 chars)</label>
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
            <label className="form-label">Height (cm) *</label>
            <input
              type="number"
              name="height"
              className="form-input"
              value={formData.height}
              onChange={handleChange}
              min={100}
              max={250}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Weight (kg) *</label>
            <input
              type="number"
              name="weight"
              className="form-input"
              value={formData.weight}
              onChange={handleChange}
              min={30}
              max={300}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Primary Fitness Goal *</label>
          <select
            name="fitnessGoal"
            className="form-select"
            value={formData.fitnessGoal}
            onChange={handleChange}
            required
          >
            <option value="build_muscle">💪 Build Muscle & Hypertrophy</option>
            <option value="lose_weight">🔥 Lose Fat & Weight</option>
            <option value="increase_strength">🏋️ Maximize Pure Strength</option>
            <option value="improve_endurance">🏃 Cardio & Athletic Endurance</option>
            <option value="maintain_fitness">⚡ General Health & Fitness</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Experience Level *</label>
            <select
              name="fitnessLevel"
              className="form-select"
              value={formData.fitnessLevel}
              onChange={handleChange}
              required
            >
              <option value="beginner">Beginner (0-1 yrs)</option>
              <option value="intermediate">Intermediate (1-3 yrs)</option>
              <option value="advanced">Advanced (3+ yrs)</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Target Workouts/Wk *</label>
            <input
              type="number"
              name="weeklyWorkoutTarget"
              className="form-input"
              value={formData.weeklyWorkoutTarget}
              onChange={handleChange}
              min={1}
              max={7}
              required
            />
          </div>
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
