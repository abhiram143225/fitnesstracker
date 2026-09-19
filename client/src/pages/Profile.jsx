import React, { useState } from 'react';
import {
  User,
  Mail,
  Scale,
  Ruler,
  Target,
  Flame,
  Droplets,
  Save,
  LogOut,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    height: user?.profile?.height || 178,
    weight: user?.profile?.weight || 75,
    fitnessLevel: user?.profile?.fitnessLevel || 'intermediate',
    fitnessGoal: user?.profile?.fitnessGoal || 'build_muscle',
    weeklyWorkoutTarget: user?.profile?.weeklyWorkoutTarget || 4,
    dailyCalorieTarget: user?.profile?.dailyCalorieTarget || 2300,
    dailyWaterTarget: user?.profile?.dailyWaterTarget || 2500,
    theme: user?.preferences?.theme || theme || 'dark',
  });

  const [saving, setSaving] = useState(false);

  // BMI Calculation
  const heightM = Number(formData.height) / 100;
  const bmi = heightM > 0 ? (Number(formData.weight) / (heightM * heightM)).toFixed(1) : 22.5;

  const getBmiCategory = (val) => {
    const num = Number(val);
    if (num < 18.5) return { text: 'Underweight', color: '#38bdf8' };
    if (num < 25) return { text: 'Normal / Healthy', color: '#10b981' };
    if (num < 30) return { text: 'Overweight', color: '#f59e0b' };
    return { text: 'Obese', color: '#ef4444' };
  };

  const bmiCat = getBmiCategory(bmi);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'theme') {
      setTheme(value);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        name: formData.name,
        profile: {
          height: Number(formData.height),
          weight: Number(formData.weight),
          fitnessLevel: formData.fitnessLevel,
          fitnessGoal: formData.fitnessGoal,
          weeklyWorkoutTarget: Number(formData.weeklyWorkoutTarget),
          dailyCalorieTarget: Number(formData.dailyCalorieTarget),
          dailyWaterTarget: Number(formData.dailyWaterTarget),
        },
        preferences: {
          theme: formData.theme,
        },
      });
      setTheme(formData.theme);
      showToast('Profile parameters and theme saved successfully!', 'success');
    } catch {
      setTheme(formData.theme);
      showToast('Profile updated locally!', 'info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '4px', color: 'var(--text-primary)' }}>Profile & Settings</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Configure personal biometrics, training targets, and app theme preferences</p>
      </div>

      {/* Top Profile Card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              color: 'var(--btn-primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 900,
              boxShadow: '0 0 20px var(--accent-primary-glow)',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--text-primary)' }}>{user?.name || 'Athlete'}</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email || 'athlete@pulse.dev'}</span>
            <div style={{ marginTop: '6px' }}>
              <span className="badge badge-emerald" style={{ textTransform: 'capitalize' }}>
                {user?.profile?.fitnessLevel || 'Intermediate'} Athlete
              </span>
            </div>
          </div>
        </div>

        <button onClick={logout} className="btn btn-danger">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Biometric Summary Tiles */}
      <div className="grid-cols-3" style={{ marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>BMI Index</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: bmiCat.color }}>{bmiCat.text}</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{bmi}</div>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Height</span>
            <Ruler size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{formData.height} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>cm</span></div>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Weight</span>
            <Scale size={16} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{formData.weight} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>kg</span></div>
        </div>
      </div>

      {/* Edit Settings Form */}
      <form onSubmit={handleSave} className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Personal Information & Fitness Targets</h3>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Theme Preference */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">App Appearance & Theme</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setFormData((p) => ({ ...p, theme: 'dark' }));
                setTheme('dark');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: formData.theme === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
                border: formData.theme === 'dark' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Moon size={18} color={formData.theme === 'dark' ? '#10b981' : 'var(--text-secondary)'} />
              <span>Dark Theme</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData((p) => ({ ...p, theme: 'bright' }));
                setTheme('bright');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: formData.theme === 'bright' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-surface-elevated)',
                border: formData.theme === 'bright' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Sun size={18} color={formData.theme === 'bright' ? '#f59e0b' : 'var(--text-secondary)'} />
              <span>Bright Theme</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              name="height"
              className="form-input"
              value={formData.height}
              onChange={handleChange}
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
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Primary Fitness Goal</label>
            <select
              name="fitnessGoal"
              className="form-select"
              value={formData.fitnessGoal}
              onChange={handleChange}
            >
              <option value="build_muscle">Build Muscle</option>
              <option value="lose_weight">Lose Weight</option>
              <option value="increase_strength">Increase Strength</option>
              <option value="improve_endurance">Improve Endurance</option>
              <option value="maintain_fitness">Maintain Fitness</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Weekly Workout Target (Days)</label>
            <input
              type="number"
              name="weeklyWorkoutTarget"
              className="form-input"
              value={formData.weeklyWorkoutTarget}
              onChange={handleChange}
              min={1}
              max={7}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Daily Calorie Target (kcal)</label>
            <input
              type="number"
              name="dailyCalorieTarget"
              className="form-input"
              value={formData.dailyCalorieTarget}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Daily Water Target (ml)</label>
            <input
              type="number"
              name="dailyWaterTarget"
              className="form-input"
              value={formData.dailyWaterTarget}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          <Save size={18} />
          <span>{saving ? 'Saving changes...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
};
