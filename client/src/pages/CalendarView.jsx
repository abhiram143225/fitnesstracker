import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Clock,
  Flame,
  Calendar as CalendarIcon,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/workoutService';

export const CalendarView = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [workouts, setWorkouts] = useState([]);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [currentYear, currentMonth]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const res = await workoutService.getCalendarWorkouts(currentYear, currentMonth);
      if (res.data) {
        setWorkouts(res.data);
      } else {
        setWorkouts([]);
      }
    } catch {
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar math
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Group workouts by day
  const workoutsByDay = {};
  workouts.forEach((w) => {
    const d = new Date(w.date).getDate();
    if (!workoutsByDay[d]) workoutsByDay[d] = [];
    workoutsByDay[d].push(w);
  });

  const selectedDayWorkouts = workoutsByDay[selectedDay] || [];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Workout Calendar</h1>
          <p style={{ margin: 0 }}>View your training schedule, consistency dates, and history</p>
        </div>
        <button onClick={() => navigate('/workouts/new')} className="btn btn-primary">
          <Plus size={18} />
          <span>Log Workout for Today</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Calendar Grid Box */}
        <div className="glass-card" style={{ padding: '24px' }}>
          {/* Month Navigation */}
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
              {monthNames[currentMonth - 1]} {currentYear}
            </h2>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handlePrevMonth} className="btn-icon">
                <ChevronLeft size={18} />
              </button>
              <button onClick={handleNextMonth} className="btn-icon">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Calendar Days Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {/* Empty slots for prior month days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '70px', opacity: 0.2 }} />
            ))}

            {/* Actual Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasWorkouts = Boolean(workoutsByDay[day]?.length);
              const isSelected = selectedDay === day;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    height: '70px',
                    borderRadius: '10px',
                    padding: '8px',
                    background: isSelected
                      ? 'rgba(16, 185, 129, 0.15)'
                      : hasWorkouts
                      ? 'var(--bg-surface-elevated)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${
                      isSelected
                        ? 'var(--accent-primary)'
                        : hasWorkouts
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'var(--border-subtle)'
                    }`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#10b981' : '#fff' }}>
                    {day}
                  </span>

                  {hasWorkouts && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          background: 'var(--accent-primary)',
                          color: '#051a14',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}
                      >
                        {workoutsByDay[day].length} Session
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CalendarIcon size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
              {monthNames[currentMonth - 1]} {selectedDay}, {currentYear}
            </h3>
          </div>

          {selectedDayWorkouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)' }}>
              <Dumbbell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '0.85rem' }}>No workouts logged on this day.</p>
              <button onClick={() => navigate('/workouts/new')} className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>
                + Log for this date
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {selectedDayWorkouts.map((w) => (
                <div
                  key={w._id}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px' }}>{w.title}</h4>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    <span>⏱️ {w.duration} mins</span>
                    <span>🔥 {w.caloriesBurned} kcal</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {w.exercises?.map((ex, idx) => (
                      <div key={idx} style={{ marginBottom: '4px' }}>
                        • {ex.exerciseName || ex.exercise?.name} ({ex.sets?.length || 0} sets)
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
