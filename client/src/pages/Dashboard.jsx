import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Dumbbell,
  Target,
  Clock,
  Zap,
  TrendingUp,
  Plus,
  ArrowRight,
  Award,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/progressService';
import { workoutService } from '../services/workoutService';
import { goalService } from '../services/goalService';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [summary, setSummary] = useState({
    totalWorkouts: 14,
    totalMinutes: 630,
    totalCalories: 4850,
    currentStreak: 5,
    workoutsThisWeek: 3,
    weeklyGoal: 4,
  });

  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', calories: 420, minutes: 45, workouts: 1 },
    { day: 'Tue', calories: 510, minutes: 55, workouts: 1 },
    { day: 'Wed', calories: 0, minutes: 0, workouts: 0 },
    { day: 'Thu', calories: 480, minutes: 50, workouts: 1 },
    { day: 'Fri', calories: 620, minutes: 60, workouts: 1 },
    { day: 'Sat', calories: 350, minutes: 35, workouts: 1 },
    { day: 'Sun', calories: 0, minutes: 0, workouts: 0 },
  ]);

  const [activeGoals, setActiveGoals] = useState([
    { _id: 'g1', title: 'Target Body Weight', targetValue: 75, currentValue: 78, unit: 'kg', type: 'weight' },
    { _id: 'g2', title: 'Bench Press PR', targetValue: 100, currentValue: 85, unit: 'kg', type: 'strength_pr' },
    { _id: 'g3', title: 'Monthly Workouts', targetValue: 20, currentValue: 14, unit: 'sessions', type: 'workouts_per_week' },
  ]);

  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, weekRes, goalRes, workRes] = await Promise.allSettled([
          progressService.getSummary(),
          progressService.getWeekly(),
          goalService.getGoals('in_progress'),
          workoutService.getWorkouts({ limit: 4 }),
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value.data) {
          setSummary(sumRes.value.data);
        }
        if (weekRes.status === 'fulfilled' && weekRes.value.data?.length > 0) {
          setWeeklyData(weekRes.value.data);
        }
        if (goalRes.status === 'fulfilled' && goalRes.value.data?.length > 0) {
          setActiveGoals(goalRes.value.data);
        }
        if (workRes.status === 'fulfilled' && workRes.value.data?.length > 0) {
          setRecentWorkouts(workRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickProgress = async (e, goalId) => {
    e.stopPropagation();
    try {
      await goalService.updateGoalProgress(goalId, { increment: 1 });
      showToast('Goal progress incremented! +1', 'success');
      setActiveGoals((prev) =>
        prev.map((g) => (g._id === goalId ? { ...g, currentValue: g.currentValue + 1 } : g))
      );
    } catch {
      setActiveGoals((prev) =>
        prev.map((g) => (g._id === goalId ? { ...g, currentValue: g.currentValue + 1 } : g))
      );
      showToast('Demo progress logged! +1', 'info');
    }
  };

  return (
    <div className="page-container">
      {/* Top Banner with Greeting & CTA */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: '8px' }}>
            <Zap size={13} /> Active Training Streak
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
            Ready to train, {user?.name ? user.name.split(' ')[0] : 'Athlete'}?
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            You've completed <strong style={{ color: '#fff' }}>{summary.workoutsThisWeek} of {summary.weeklyGoal}</strong> workouts this week. Keep the flame alive!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/workouts/new')}
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: '12px' }}
          >
            <Plus size={18} />
            <span>Start Workout</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        <StatCard
          title="Workouts Completed"
          value={summary.totalWorkouts || 14}
          unit="sessions"
          icon={Dumbbell}
          color="emerald"
          trend="+3 this week"
        />
        <StatCard
          title="Calories Burned"
          value={(summary.totalCalories || 4850).toLocaleString()}
          unit="kcal"
          icon={Flame}
          color="amber"
          subtitle="Estimated metabolic expenditure"
        />
        <StatCard
          title="Active Streak"
          value={summary.currentStreak || 5}
          unit="days"
          icon={Zap}
          color="purple"
          trend="🔥 Consistency on fire"
        />
        <StatCard
          title="Time Trained"
          value={Math.round((summary.totalMinutes || 630) / 60)}
          unit="hours"
          icon={Clock}
          color="cyan"
          subtitle={`${summary.totalMinutes || 630} total active minutes`}
        />
      </div>

      {/* Main Grid: Weekly Chart & Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '24px', marginBottom: '28px' }}>
        {/* Weekly Activity Chart */}
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Weekly Workout Volume</h3>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Calories burned per day</p>
            </div>
            <span className="badge badge-cyan">Past 7 Days</span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e131f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                />
                <Bar dataKey="calories" fill="url(#emeraldGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Goals Section */}
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Active Fitness Goals</h3>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Target metrics & progression</p>
            </div>
            <button onClick={() => navigate('/goals')} className="btn btn-outline btn-sm">
              Manage
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              return (
                <div
                  key={goal._id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{goal.title}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {goal.currentValue} / {goal.targetValue} {goal.unit} ({pct}%)
                    </span>
                  </div>

                  <div className="progress-container" style={{ marginBottom: '8px' }}>
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>

                  <div className="flex-between">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {pct >= 100 ? '🎉 Goal Achieved!' : `${goal.targetValue - goal.currentValue} ${goal.unit} remaining`}
                    </span>
                    <button
                      onClick={(e) => handleQuickProgress(e, goal._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                    >
                      +1 Log
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Workouts Feed */}
      <div className="glass-card">
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Workout Logs</h3>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>Your latest completed gym and training sessions</p>
          </div>
          <button onClick={() => navigate('/workouts')} className="btn btn-secondary btn-sm">
            View All Workouts
            <ArrowRight size={14} />
          </button>
        </div>

        {recentWorkouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
            <Dumbbell size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p>No workouts recorded yet. Complete your first session to see it here!</p>
            <button onClick={() => navigate('/workouts/new')} className="btn btn-primary btn-sm" style={{ marginTop: '8px' }}>
              Log Your First Workout
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {recentWorkouts.map((workout) => (
              <div
                key={workout._id}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div className="flex-between" style={{ marginBottom: '10px' }}>
                  <h4 style={{ color: '#fff', fontSize: '1rem', margin: 0 }}>{workout.title}</h4>
                  <span className="badge badge-emerald">
                    <CheckCircle2 size={12} /> {workout.feeling || 'Completed'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <span>⏱️ {workout.duration} mins</span>
                  <span>🔥 {workout.caloriesBurned} kcal</span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {workout.exercises?.length || 0} Exercises logged
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
