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
  Legend,
  CartesianGrid,
} from 'recharts';
import { progressService } from '../services/progressService';
import { useAuth } from '../context/AuthContext';

export const Progress = () => {
  const { user } = useAuth();
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
      });
    }
    return list;
  };

  const [weeklyData, setWeeklyData] = useState(generateEmptyWeek());
  const [categoryData, setCategoryData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const PIE_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [wRes, dRes, aRes] = await Promise.allSettled([
          progressService.getWeekly(),
          progressService.getDistribution(),
          progressService.getAchievements(),
        ]);

        if (wRes.status === 'fulfilled' && wRes.value?.data?.length) {
          setWeeklyData(wRes.value.data);
        }
        if (dRes.status === 'fulfilled' && dRes.value?.categories) {
          setCategoryData(dRes.value.categories);
        }
        if (aRes.status === 'fulfilled' && aRes.value?.data) {
          setAchievements(aRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalPoints = achievements.filter((a) => a.isUnlocked).reduce((s, a) => s + (a.points || 0), 0);
  const totalCaloriesThisWeek = weeklyData.reduce((sum, d) => sum + (d.calories || 0), 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Performance Analytics</h1>
        <p style={{ margin: 0 }}>Understand your training patterns, volume distribution, and badges</p>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', marginBottom: '28px' }}>
        {/* Calorie Burn & Training Volume Area Chart */}
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Metabolic Output (Calorie Trend)</h3>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>
                {totalCaloriesThisWeek > 0 ? `${totalCaloriesThisWeek} kcal burned past 7 days` : 'Log workouts to record caloric expenditure'}
              </p>
            </div>
            <span className="badge badge-emerald">🔥 Weekly Active</span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e131f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#areaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Category Distribution Donut Chart */}
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Training Focus</h3>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Discipline Breakdown</p>
            </div>
          </div>

          {categoryData.length === 0 ? (
            <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Dumbbell size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '0.85rem' }}>No exercise category data yet.</p>
            </div>
          ) : (
            <>
              <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0e131f',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                {categoryData.map((item, idx) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gamification & Achievements Section */}
      <div className="glass-card">
        <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-amber" style={{ marginBottom: '6px' }}>
              <Trophy size={13} /> Gamification & Badges
            </div>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Fitness Milestones</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACHIEVEMENT SCORE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                {totalPoints} PTS
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UNLOCKED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
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
                position: 'relative',
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
