import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Trophy,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Sparkles,
  Zap,
  Dumbbell,
  Scale,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { goalService } from '../services/goalService';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in_progress, completed
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'weight',
    startValue: user?.profile?.weight || 70,
    currentValue: user?.profile?.weight || 70,
    targetValue: (user?.profile?.weight || 70) - 3,
    unit: 'kg',
    targetDate: '',
    category: 'Weight Management',
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, [filter]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalService.getGoals(filter);
      if (res.data) {
        setGoals(res.data);
      } else {
        setGoals([]);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await goalService.createGoal({
        ...newGoal,
        startValue: Number(newGoal.startValue),
        currentValue: Number(newGoal.currentValue),
        targetValue: Number(newGoal.targetValue),
      });

      showToast('Smart fitness goal established and saved to database!', 'success');
      setIsCreateModalOpen(false);
      setGoals((prev) => [res.data, ...prev]);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create goal', 'error');
    }
  };

  const applyPreset = (presetType) => {
    const userWeight = user?.profile?.weight || 70;
    switch (presetType) {
      case 'weight_loss':
        setNewGoal({
          title: 'Target Body Weight',
          type: 'weight',
          startValue: userWeight,
          currentValue: userWeight,
          targetValue: userWeight - 5,
          unit: 'kg',
          category: 'Weight Management',
        });
        break;
      case 'bench_pr':
        setNewGoal({
          title: 'Bench Press PR Milestone',
          type: 'strength_pr',
          startValue: 60,
          currentValue: 60,
          targetValue: 100,
          unit: 'kg',
          category: 'Strength PR',
        });
        break;
      case 'weekly_streak':
        setNewGoal({
          title: 'Weekly Workout Consistency Streak',
          type: 'workouts_per_week',
          startValue: 0,
          currentValue: 0,
          targetValue: user?.profile?.weeklyWorkoutTarget || 4,
          unit: 'sessions',
          category: 'Consistency',
        });
        break;
      case 'calorie_milestone':
        setNewGoal({
          title: 'Monthly Calorie Burn Target',
          type: 'calories',
          startValue: 0,
          currentValue: 0,
          targetValue: 10000,
          unit: 'kcal',
          category: 'Cardio & Burn',
        });
        break;
      default:
        break;
    }
  };

  const handleUpdateProgress = async (id, delta) => {
    try {
      const targetGoal = goals.find((g) => g._id === id);
      if (!targetGoal) return;

      const nextVal = Math.max(0, targetGoal.currentValue + delta);
      const isCompleted = nextVal >= targetGoal.targetValue;

      if (isCompleted && targetGoal.status !== 'completed') {
        try {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}
        showToast('🏆 Milestone Reached! Goal Marked Completed in Database!', 'success');
      }

      await goalService.updateGoalProgress(id, { value: nextVal });
      setGoals((prev) =>
        prev.map((g) => (g._id === id ? { ...g, currentValue: nextVal, status: isCompleted ? 'completed' : g.status } : g))
      );
    } catch {
      showToast('Could not update progress', 'error');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalService.deleteGoal(id);
      showToast('Goal removed from database', 'success');
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch {
      showToast('Could not delete goal', 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
            <Target size={12} /> Smart Goal Tracking
          </span>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Goals & Milestones</h1>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['all', 'in_progress', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize', padding: '6px 16px', borderRadius: 'var(--radius-full)' }}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p>Loading your goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Target size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>No active goals</h3>
          <p style={{ marginBottom: '20px' }}>
            Set a body weight target, weekly workout frequency streak, or strength PR. Workouts will automatically progress your goals!
          </p>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid-cols-2">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) || 0;
            const isCompleted = goal.status === 'completed' || pct >= 100;

            return (
              <div
                key={goal._id}
                className="glass-card glass-card-glow"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: isCompleted ? '4px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <span className="badge badge-purple">{goal.category || 'Fitness'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isCompleted ? (
                        <span className="badge badge-emerald">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      ) : (
                        <span className="badge badge-cyan">
                          <Sparkles size={11} /> Auto-Tracking
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteGoal(goal._id)}
                        className="btn-icon"
                        style={{ padding: '4px', color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
                    {goal.title}
                  </h3>

                  {/* Numbers & Progress */}
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Current: <strong style={{ color: '#fff' }}>{goal.currentValue} {goal.unit}</strong>
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      Target: {goal.targetValue} {goal.unit} ({pct}%)
                    </span>
                  </div>

                  <div className="progress-container" style={{ height: '10px', marginBottom: '16px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: isCompleted ? 'linear-gradient(90deg, #10b981, #059669)' : 'var(--gradient-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Progress Controls */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {isCompleted ? 'Goal Crushed! 🏆' : `${Math.max(0, goal.targetValue - goal.currentValue)} ${goal.unit} remaining`}
                  </span>

                  {!isCompleted && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleUpdateProgress(goal._id, -1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 10px' }}
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleUpdateProgress(goal._id, 1)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 12px' }}
                      >
                        +1 Log
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal with 1-Click Smart Presets */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Establish Smart Fitness Goal"
      >
        {/* Quick Presets */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            Quick Smart Presets:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button type="button" onClick={() => applyPreset('weight_loss')} className="btn btn-secondary btn-sm">
              <Scale size={14} color="#10b981" /> Weight Loss (-5kg)
            </button>
            <button type="button" onClick={() => applyPreset('bench_pr')} className="btn btn-secondary btn-sm">
              <Dumbbell size={14} color="#06b6d4" /> 100kg Bench PR
            </button>
            <button type="button" onClick={() => applyPreset('weekly_streak')} className="btn btn-secondary btn-sm">
              <Zap size={14} color="#f59e0b" /> Weekly Consistency
            </button>
            <button type="button" onClick={() => applyPreset('calorie_milestone')} className="btn btn-secondary btn-sm">
              <Flame size={14} color="#ec4899" /> 10k Calories Burned
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateGoal}>
          <div className="form-group">
            <label className="form-label">Goal Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Bench Press 100kg, Run 50km this month"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Goal Type *</label>
              <select
                className="form-select"
                value={newGoal.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              >
                <option value="weight">Body Weight</option>
                <option value="workouts_per_week">Weekly Workout Sessions</option>
                <option value="strength_pr">Strength PR (Lift)</option>
                <option value="distance">Cardio Distance</option>
                <option value="calories">Calorie Burn Target</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure *</label>
              <input
                type="text"
                className="form-input"
                placeholder="kg, reps, km, sessions"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Current Value</label>
              <input
                type="number"
                className="form-input"
                value={newGoal.currentValue}
                onChange={(e) => setNewGoal({ ...newGoal, currentValue: e.target.value, startValue: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Value *</label>
              <input
                type="number"
                className="form-input"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Set & Save Fitness Goal
          </button>
        </form>
      </Modal>
    </div>
  );
};
