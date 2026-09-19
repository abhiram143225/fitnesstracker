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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
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
      });
      showToast('Profile parameters updated successfully!', 'success');
    } catch {
      showToast('Profile updated locally!', 'info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Profile & Settings</h1>
        <p style={{ margin: 0 }}>Configure personal biometrics, training targets, and preferences</p>
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
              color: '#051a14',
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
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>{user?.name || 'Athlete'}</h2>
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
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{bmi}</div>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Height</span>
            <Ruler size={16} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#06b6d4' }}>{formData.height} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>cm</span></div>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Weight</span>
            <Scale size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{formData.weight} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>kg</span></div>
        </div>
      </div>

      {/* Edit Settings Form */}
      <form onSubmit={handleSave} className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '20px' }}>Personal Information & Fitness Targets</h3>

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
