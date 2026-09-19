import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  Clock,
  Dumbbell,
  Trophy,
  Award,
  Zap,
  Target,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { progressService } from '../services/progressService';
import { useAuth } from '../context/AuthContext';

export const Progress = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('7'); // '7' or '30'

  const [summary, setSummary] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    totalCalories: 0,
    totalVolumeKg: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const generateEmptyDays = (count) => {
    const list = [];
    const today = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      list.push({
        date: d.toISOString().split('T')[0],
        day: daysOfWeek[d.getDay()],
        calories: 0,
        minutes: 0,
        volume: 0,
        workouts: 0,
      });
    }
    return list;
  };

  const [trendData, setTrendData] = useState(generateEmptyDays(7));
  const [categoryData, setCategoryData] = useState([]);
  const [muscleData, setMuscleData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const PIE_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sumRes, weekRes, distRes, achRes] = await Promise.allSettled([
          progressService.getSummary(),
          progressService.getWeekly(timeframe),
          progressService.getDistribution(),
          progressService.getAchievements(),
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value?.data) {
          setSummary(sumRes.value.data);
        }
        if (weekRes.status === 'fulfilled' && weekRes.value?.data?.length) {
          setTrendData(weekRes.value.data);
        }
        if (distRes.status === 'fulfilled') {
          if (distRes.value?.categories) setCategoryData(distRes.value.categories);
          if (distRes.value?.muscles) setMuscleData(distRes.value.muscles);
        }
        if (achRes.status === 'fulfilled' && achRes.value?.data) {
          setAchievements(achRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe, user]);

  const totalCaloriesInPeriod = trendData.reduce((sum, d) => sum + (d.calories || 0), 0);
  const totalVolumeInPeriod = trendData.reduce((sum, d) => sum + (d.volume || 0), 0);
  const totalWorkoutsInPeriod = trendData.reduce((sum, d) => sum + (d.workouts || 0), 0);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalPoints = achievements.filter((a) => a.isUnlocked).reduce((s, a) => s + (a.points || 0), 0);

  return (
    <div className="page-container">
      {/* Header with Timeframe Switcher */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>
            <Activity size={12} /> Advanced Performance Analytics
          </span>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Analytics & Trends</h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface-elevated)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => { setTimeframe('7'); setTrendData(generateEmptyDays(7)); }}
            className={`btn btn-sm ${timeframe === '7' ? 'btn-primary' : ''}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '5px 14px' }}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => { setTimeframe('30'); setTrendData(generateEmptyDays(30)); }}
            className={`btn btn-sm ${timeframe === '30' ? 'btn-primary' : ''}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '5px 14px' }}
          >
            Past 30 Days
          </button>
        </div>
      </div>

      {/* Aggregate KPI Summary Strip */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Volume Lifted</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {totalVolumeInPeriod.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>kg</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sets × Reps × Weight</span>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Calorie Expenditure</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {totalCaloriesInPeriod.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>kcal</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Energy output in period</span>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Workout Frequency</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
            {totalWorkoutsInPeriod} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>sessions</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current streak: {summary.currentStreak} days</span>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Milestone Score</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
            {totalPoints} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>pts</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{unlockedCount} badges unlocked</span>
        </div>
      </div>

      {/* Row 1: Volume Progression Chart & Calorie Burn Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Total Weight Volume Lifted Trend */}
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Total Weight Volume Progression</h3>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Progressive overload volume (kg lifted)</p>
            </div>
            <span className="badge badge-emerald">Volume</span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e131f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(val) => [`${val.toLocaleString()} kg`, 'Volume Lifted']}
                />
                <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} fill="url(#volGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Caloric Burn Rate Trend */}
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Calorie Burn Rates</h3>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Estimated calories burned per session</p>
            </div>
            <span className="badge badge-amber">Energy (kcal)</span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e131f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(val) => [`${val} kcal`, 'Calories Burned']}
                />
                <Bar dataKey="calories" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Muscle Group Distribution & Workout Frequency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', marginBottom: '28px' }}>
        {/* Muscle Group Distribution */}
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Muscle Group Distribution</h3>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Targeted muscle focus across sets</p>
            </div>
          </div>

          {muscleData.length === 0 ? (
            <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Dumbbell size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '0.85rem' }}>Log workouts to see muscle distribution.</p>
            </div>
          ) : (
            <>
              <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={muscleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {muscleData.map((entry, index) => (
                        <Cell key={`muscle-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0e131f',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      formatter={(val) => [`${val} Sets`, 'Target Sets']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                {muscleData.map((item, idx) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Workout Frequency Over Time */}
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Workout Frequency & Consistency</h3>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Daily workout session frequency</p>
            </div>
            <span className="badge badge-purple">Sessions / Day</span>
          </div>

          <div style={{ width: '100%', height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e131f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="workouts" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gamification & Milestone Badges */}
      <div className="glass-card">
        <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-amber" style={{ marginBottom: '6px' }}>
              <Trophy size={13} /> Gamification Milestones
            </div>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Achievements Progress</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SCORE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
                {totalPoints} PTS
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UNLOCKED</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {unlockedCount} / {achievements.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid-cols-3">
          {achievements.map((ach) => (
            <div
              key={ach._id}
              style={{
                backgroundColor: ach.isUnlocked ? 'var(--bg-surface-elevated)' : 'rgba(14, 19, 31, 0.4)',
                border: `1px solid ${ach.isUnlocked ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-subtle)'}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: ach.isUnlocked ? 1 : 0.6,
              }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: ach.isUnlocked ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: ach.isUnlocked ? '#f59e0b' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {ach.isUnlocked ? <Trophy size={18} /> : <Lock size={18} />}
                  </div>

                  <span className={`badge ${ach.isUnlocked ? 'badge-amber' : ''}`} style={{ fontSize: '0.75rem' }}>
                    +{ach.points} pts
                  </span>
                </div>

                <h4 style={{ color: ach.isUnlocked ? '#fff' : 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '4px' }}>
                  {ach.title}
                </h4>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>
                  {ach.description}
                </p>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: ach.isUnlocked ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>
                  {ach.isUnlocked ? '✓ Unlocked' : 'Locked Milestone'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
