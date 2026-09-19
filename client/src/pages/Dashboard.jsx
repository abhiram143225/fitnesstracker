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
  Sparkles,
  CheckCircle2,
  Info,
  Scale,
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
import { getPersonalizedPlan } from '../utils/recommendations';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [summary, setSummary] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    totalCalories: 0,
    currentStreak: 0,
    workoutsThisWeek: 0,
    weeklyGoal: user?.profile?.weeklyWorkoutTarget || 4,
  });

  // Default empty 7 days
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const generateEmptyWeek = () => {
    const list = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      list.push({
        day: daysOfWeek[d.getDay()],
        calories: 0,
        minutes: 0,
        workouts: 0,
      });
    }
    return list;
  };

  const [weeklyData, setWeeklyData] = useState(generateEmptyWeek());
  const [activeGoals, setActiveGoals] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Personalized recommendations from user's BMI and fitnessGoal
  const plan = getPersonalizedPlan(user?.profile);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [sumRes, weekRes, goalRes, workRes] = await Promise.allSettled([
          progressService.getSummary(),
          progressService.getWeekly(),
          goalService.getGoals('in_progress'),
          workoutService.getWorkouts({ limit: 4 }),
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value?.data) {
          setSummary(sumRes.value.data);
        }
        if (weekRes.status === 'fulfilled' && weekRes.value?.data?.length > 0) {
          setWeeklyData(weekRes.value.data);
        }
        if (goalRes.status === 'fulfilled' && goalRes.value?.data) {
          setActiveGoals(goalRes.value.data);
        }
        if (workRes.status === 'fulfilled' && workRes.value?.data) {
          setRecentWorkouts(workRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching real dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleQuickProgress = async (e, goalId) => {
    e.stopPropagation();
    try {
      await goalService.updateGoalProgress(goalId, { increment: 1 });
      showToast('Goal progress recorded and saved to database! +1', 'success');
      setActiveGoals((prev) =>
        prev.map((g) => (g._id === goalId ? { ...g, currentValue: g.currentValue + 1 } : g))
      );
    } catch {
      showToast('Could not save progress', 'error');
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
            <Zap size={13} /> Active Athlete Dashboard
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
            Welcome, {user?.name ? user.name.split(' ')[0] : 'Athlete'}!
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            You've completed <strong style={{ color: '#fff' }}>{summary.workoutsThisWeek} of {summary.weeklyGoal || 4}</strong> workouts this week. All training data is saved to your account.
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

      {/* KPI Stats Grid - Real zero-initialized values */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        <StatCard
          title="Workouts Completed"
          value={summary.totalWorkouts || 0}
          unit="sessions"
          icon={Dumbbell}
          color="emerald"
          subtitle={`${summary.workoutsThisWeek || 0} session(s) this week`}
        />
        <StatCard
          title="Calories Burned"
          value={(summary.totalCalories || 0).toLocaleString()}
          unit="kcal"
          icon={Flame}
          color="amber"
          subtitle="Cumulative energy burned"
        />
        <StatCard
          title="Active Streak"
          value={summary.currentStreak || 0}
          unit="days"
          icon={Zap}
          color="purple"
          subtitle={summary.currentStreak > 0 ? "🔥 Streak in progress" : "Log a workout to ignite streak"}
        />
        <StatCard
          title="Time Trained"
          value={Math.round((summary.totalMinutes || 0) / 60)}
          unit="hours"
          icon={Clock}
          color="cyan"
          subtitle={`${summary.totalMinutes || 0} total active minutes`}
        />
      </div>

      {/* SMART AI RECOMMENDATIONS ACCORDING TO BMI & GOAL */}
      <div
        className="glass-card"
        style={{
          border: '1px solid rgba(6, 182, 212, 0.3)',
          background: 'linear-gradient(135deg, rgba(14, 19, 31, 0.9) 0%, rgba(6, 182, 212, 0.08) 100%)',
          marginBottom: '28px',
          padding: '24px',
        }}
      >
        <div className="flex-between" style={{ marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                Personalized Exercise Recommendations
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tailored for your goal: <strong style={{ color: '#06b6d4', textTransform: 'capitalize' }}>{user?.profile?.fitnessGoal?.replace('_', ' ') || 'Build Muscle'}</strong> • BMI: <strong style={{ color: plan.bmiColor }}>{plan.bmi} ({plan.bmiCategory})</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-cyan">{plan.title}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.5 }}>
          {plan.strategy}
        </p>

        {/* Prescription Parameters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RECOMMENDED SETS</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{plan.targetSets}</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TARGET REP RANGE</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{plan.targetReps}</div>
          </div>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REST INTERVAL</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>{plan.restInterval}</div>
          </div>
        </div>

        {/* Suggested Exercises List */}
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            Suggested Exercises for Your Routine:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {plan.recommendedExercises.map((exName) => (
              <div
                key={exName}
                onClick={() => navigate('/exercises')}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <Dumbbell size={14} color="#10b981" />
                <span>{exName}</span>
              </div>
            ))}
          </div>
        </div>
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
              + Add Goal
            </button>
          </div>

          {activeGoals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)' }}>
              <Target size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>No active goals defined yet.</p>
              <button onClick={() => navigate('/goals')} className="btn btn-primary btn-sm">
                Set Your First Target
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeGoals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) || 0;
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
                        {pct >= 100 ? '🎉 Goal Achieved!' : `${Math.max(0, goal.targetValue - goal.currentValue)} ${goal.unit} remaining`}
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
          )}
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
          <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
            <Dumbbell size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
            <h4 style={{ color: '#fff', marginBottom: '6px' }}>No workouts recorded yet</h4>
            <p style={{ marginBottom: '16px' }}>Log your first training session to track your volume and progressive overload!</p>
            <button onClick={() => navigate('/workouts/new')} className="btn btn-primary btn-sm">
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
