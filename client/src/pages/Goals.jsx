import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Trophy,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { goalService } from '../services/goalService';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

export const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in_progress, completed
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'weight',
    startValue: 80,
    currentValue: 80,
    targetValue: 75,
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
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
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

      showToast('New fitness goal established!', 'success');
      setIsCreateModalOpen(false);
      setGoals((prev) => [res.data, ...prev]);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create goal', 'error');
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
        showToast('🏆 Milestone Reached! Goal Marked Completed!', 'success');
      }

      await goalService.updateGoalProgress(id, { value: nextVal });
      setGoals((prev) =>
        prev.map((g) => (g._id === id ? { ...g, currentValue: nextVal, status: isCompleted ? 'completed' : g.status } : g))
      );
    } catch {
      setGoals((prev) =>
        prev.map((g) => (g._id === id ? { ...g, currentValue: g.currentValue + delta } : g))
      );
      showToast('Progress updated (local)', 'info');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalService.deleteGoal(id);
      showToast('Goal removed', 'success');
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch {
      setGoals((prev) => prev.filter((g) => g._id !== id));
      showToast('Goal removed (local)', 'info');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Fitness Goals</h1>
          <p style={{ margin: 0 }}>Set milestones, monitor progression, and celebrate achievements</p>
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
          <p>Loading goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Target size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3>No goals found</h3>
          <p style={{ marginBottom: '20px' }}>Define your target metrics to keep motivation high!</p>
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
                        <span className="badge badge-cyan">In Progress</span>
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
                    {isCompleted ? 'Goal Crushed! 🏆' : `${Math.max(0, goal.targetValue - goal.currentValue)} ${goal.unit} left`}
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

      {/* Create Goal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Fitness Goal"
      >
        <form onSubmit={handleCreateGoal}>
          <div className="form-group">
            <label className="form-label">Goal Title</label>
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
              <label className="form-label">Goal Type</label>
              <select
                className="form-select"
                value={newGoal.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              >
                <option value="weight">Body Weight</option>
                <option value="workouts_per_week">Weekly Workouts</option>
                <option value="strength_pr">Strength PR (Lift)</option>
                <option value="distance">Cardio Distance</option>
                <option value="calories">Calorie Burn Target</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
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
              <label className="form-label">Target Value</label>
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
            Set Fitness Goal
          </button>
        </form>
      </Modal>
    </div>
  );
};
