import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Dumbbell,
  Calendar,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { workoutService } from '../services/workoutService';
import { useToast } from '../context/ToastContext';

export const Workouts = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await workoutService.getWorkouts({ limit: 50 });
      if (res.data) {
        setWorkouts(res.data);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this workout log?')) return;

    try {
      await workoutService.deleteWorkout(id);
      showToast('Workout deleted successfully', 'success');
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch {
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
      showToast('Workout deleted (local)', 'info');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px', color: 'var(--text-primary)' }}>Workout History</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Review all logged training sessions and progressive overload</p>
        </div>
        <button onClick={() => navigate('/workouts/new')} className="btn btn-primary">
          <Plus size={18} />
          <span>Log New Workout</span>
        </button>
      </div>

      {/* Aggregate Stats Banner */}
      <div className="grid-cols-3" style={{ marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Sessions</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{workouts.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Duration</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>{totalMinutes} mins</div>
        </div>
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Calories Burned</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>{totalCalories.toLocaleString()} kcal</div>
        </div>
      </div>

      {/* Workouts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your workouts...</p>
        </div>
      ) : workouts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Dumbbell size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ color: 'var(--text-primary)' }}>No workout logs yet</h3>
          <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Start your first training session and log your sets.</p>
          <button onClick={() => navigate('/workouts/new')} className="btn btn-primary">
            Log Workout Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {workouts.map((workout) => {
            const isExpanded = expandedId === workout._id;
            const dateStr = new Date(workout.date).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={workout._id}
                className="glass-card"
                style={{ padding: '20px', cursor: 'pointer' }}
                onClick={() => toggleExpand(workout._id)}
              >
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Dumbbell size={20} />
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>{workout.title}</h3>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> {dateStr}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {workout.duration} min
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Flame size={13} color="var(--accent-amber)" /> {workout.caloriesBurned} kcal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge badge-emerald">{workout.feeling || 'Completed'}</span>
                    <button
                      onClick={(e) => handleDeleteWorkout(e, workout._id)}
                      className="btn-icon"
                      title="Delete workout"
                      style={{ color: 'var(--accent-danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Expanded Sets Detail View */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '20px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
                      Logged Exercises & Performance ({workout.exercises?.length || 0})
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {workout.exercises?.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          style={{
                            background: 'var(--bg-surface-elevated)',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <div className="flex-between" style={{ marginBottom: '8px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                              {ex.exerciseName || ex.exercise?.name || `Exercise #${exIdx + 1}`}
                            </span>
                            <span className="badge badge-cyan">{ex.category || 'Strength'}</span>
                          </div>

                          {/* Sets Badges */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {ex.sets?.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                style={{
                                  background: 'var(--bg-surface)',
                                  border: '1px solid var(--border-subtle)',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                <strong>Set {s.setNumber}:</strong> {s.weight ? `${s.weight}kg × ` : ''}{s.reps} reps
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {workout.notes && (
                      <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <strong>Notes:</strong> {workout.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
