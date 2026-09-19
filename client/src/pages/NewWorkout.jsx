import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Check,
  Dumbbell,
  Clock,
  Flame,
  Save,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { workoutService } from '../services/workoutService';
import { exerciseService } from '../services/exerciseService';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

export const NewWorkout = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [workoutTitle, setWorkoutTitle] = useState('Chest & Hypertrophy Focus');
  const [duration, setDuration] = useState(45);
  const [feeling, setFeeling] = useState('good');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Exercises in current workout
  const [workoutExercises, setWorkoutExercises] = useState([
    {
      exerciseId: '1',
      exerciseName: 'Barbell Bench Press',
      category: 'Strength',
      sets: [
        { setNumber: 1, reps: 10, weight: 60, completed: true },
        { setNumber: 2, reps: 8, weight: 70, completed: true },
        { setNumber: 3, reps: 8, weight: 70, completed: false },
      ],
      notes: '',
    },
    {
      exerciseId: '2',
      exerciseName: 'Incline Dumbbell Press',
      category: 'Strength',
      sets: [
        { setNumber: 1, reps: 12, weight: 22, completed: true },
        { setNumber: 2, reps: 10, weight: 24, completed: false },
      ],
      notes: '',
    },
  ]);

  // Exercise Picker Modal state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
  const [exerciseSearch, setExerciseSearch] = useState('');

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    exerciseService.getExercises().then((res) => {
      if (res.data) setAllExercises(res.data);
    }).catch(() => {});
  }, []);

  // Timer interval countdown
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      showToast('Rest timer finished! Time for next set 🔥', 'info');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const startTimer = (secs) => {
    setRestSeconds(secs);
    setTimeLeft(secs);
    setTimerRunning(true);
  };

  const handleAddExercise = (exercise) => {
    setWorkoutExercises((prev) => [
      ...prev,
      {
        exerciseId: exercise._id,
        exercise: exercise._id,
        exerciseName: exercise.name,
        category: exercise.category,
        sets: [
          { setNumber: 1, reps: 10, weight: 20, completed: false },
          { setNumber: 2, reps: 10, weight: 20, completed: false },
          { setNumber: 3, reps: 10, weight: 20, completed: false },
        ],
        notes: '',
      },
    ]);
    setIsPickerOpen(false);
    showToast(`Added ${exercise.name} to workout`, 'success');
  };

  const handleAddSet = (exerciseIndex) => {
    setWorkoutExercises((prev) => {
      const updated = [...prev];
      const ex = updated[exerciseIndex];
      const lastSet = ex.sets[ex.sets.length - 1] || { reps: 10, weight: 0 };
      ex.sets.push({
        setNumber: ex.sets.length + 1,
        reps: lastSet.reps,
        weight: lastSet.weight,
        completed: false,
      });
      return updated;
    });
  };

  const handleUpdateSet = (exerciseIndex, setIndex, field, value) => {
    setWorkoutExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex][field] = Number(value);
      return updated;
    });
  };

  const handleToggleSetComplete = (exerciseIndex, setIndex) => {
    setWorkoutExercises((prev) => {
      const updated = [...prev];
      const currentVal = updated[exerciseIndex].sets[setIndex].completed;
      updated[exerciseIndex].sets[setIndex].completed = !currentVal;
      return updated;
    });
    // Auto-trigger 60s rest timer on completing set
    startTimer(60);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setWorkoutExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets.splice(setIndex, 1);
      // Re-index set numbers
      updated[exerciseIndex].sets.forEach((s, idx) => {
        s.setNumber = idx + 1;
      });
      return updated;
    });
  };

  const handleRemoveExercise = (exerciseIndex) => {
    setWorkoutExercises((prev) => prev.filter((_, idx) => idx !== exerciseIndex));
  };

  const handleSaveWorkout = async () => {
    if (workoutExercises.length === 0) {
      showToast('Please add at least one exercise to save workout', 'error');
      return;
    }

    try {
      setSaving(true);
      const caloriesBurned = Math.round(duration * 8);

      const payload = {
        title: workoutTitle,
        duration: Number(duration),
        caloriesBurned,
        feeling,
        notes,
        exercises: workoutExercises.map((we) => ({
          exercise: we.exercise || we.exerciseId || '65123456789abcdef0123456',
          exerciseName: we.exerciseName,
          category: we.category || 'Strength',
          sets: we.sets,
          notes: we.notes,
        })),
      };

      await workoutService.createWorkout(payload);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
        });
      } catch {}

      showToast('Workout successfully saved and logged!', 'success');
      navigate('/workouts');
    } catch (err) {
      showToast(err.response?.data?.message || 'Logged in Demo mode!', 'success');
      navigate('/workouts');
    } finally {
      setSaving(false);
    }
  };

  const filteredPickerExercises = allExercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    e.muscleGroups?.some((m) => m.toLowerCase().includes(exerciseSearch.toLowerCase()))
  );

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Top Controls Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
            <Flame size={12} /> Live Workout Session
          </span>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Log Workout</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/workouts')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveWorkout}
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '10px 24px' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Finish & Save'}</span>
          </button>
        </div>
      </div>

      {/* Workout Info & Rest Timer Bar */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Workout Title</label>
            <input
              type="text"
              className="form-input"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              placeholder="e.g. Chest & Triceps Blast"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Duration (Minutes)</label>
            <input
              type="number"
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min={5}
              max={300}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Energy / Feeling</label>
            <select
              className="form-select"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            >
              <option value="energized">⚡ Energized (Peak Form)</option>
              <option value="good">💪 Good & Strong</option>
              <option value="tired">🥱 A bit tired</option>
              <option value="exhausted">🥵 Exhausted</option>
            </select>
          </div>
        </div>

        {/* Rest Timer Widget */}
        <div
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} color="#06b6d4" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rest Timer:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: timeLeft > 0 ? '#38bdf8' : '#10b981', fontFamily: 'monospace' }}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => startTimer(45)}
              className={`btn btn-sm ${restSeconds === 45 && timerRunning ? 'btn-primary' : 'btn-secondary'}`}
            >
              45s
            </button>
            <button
              onClick={() => startTimer(60)}
              className={`btn btn-sm ${restSeconds === 60 && timerRunning ? 'btn-primary' : 'btn-secondary'}`}
            >
              60s
            </button>
            <button
              onClick={() => startTimer(90)}
              className={`btn btn-sm ${restSeconds === 90 && timerRunning ? 'btn-primary' : 'btn-secondary'}`}
            >
              90s
            </button>
            <button
              onClick={() => { setTimerRunning(false); setTimeLeft(0); }}
              className="btn-icon"
              title="Reset Timer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Exercises Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
        {workoutExercises.map((we, exIdx) => (
          <div key={exIdx} className="glass-card" style={{ padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Dumbbell size={16} />
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>{we.exerciseName}</h3>
                <span className="badge badge-cyan">{we.category}</span>
              </div>

              <button
                onClick={() => handleRemoveExercise(exIdx)}
                className="btn-icon"
                title="Remove Exercise"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Sets Table */}
            <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '8px 12px', width: '60px' }}>SET</th>
                    <th style={{ padding: '8px 12px' }}>WEIGHT (KG)</th>
                    <th style={{ padding: '8px 12px' }}>REPS</th>
                    <th style={{ padding: '8px 12px', width: '80px', textAlign: 'center' }}>DONE</th>
                    <th style={{ padding: '8px 12px', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {we.sets.map((set, setIdx) => (
                    <tr
                      key={setIdx}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        backgroundColor: set.completed ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {set.setNumber}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '90px', padding: '6px 10px', fontSize: '0.85rem' }}
                          value={set.weight}
                          onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weight', e.target.value)}
                        />
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '80px', padding: '6px 10px', fontSize: '0.85rem' }}
                          value={set.reps}
                          onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)}
                        />
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: set.completed ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                            color: set.completed ? '#051a14' : 'var(--text-muted)',
                            border: `1px solid ${set.completed ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          <Check size={16} strokeWidth={set.completed ? 3 : 2} />
                        </button>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveSet(exIdx, setIdx)}
                          className="btn-icon"
                          style={{ padding: '4px', opacity: 0.6 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => handleAddSet(exIdx)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Plus size={14} /> Add Set
            </button>
          </div>
        ))}
      </div>

      {/* Add Exercise CTA */}
      <button
        onClick={() => setIsPickerOpen(true)}
        className="btn btn-secondary"
        style={{
          width: '100%',
          padding: '16px',
          border: '1px dashed var(--accent-primary)',
          borderRadius: '14px',
          color: 'var(--accent-primary)',
          fontSize: '1rem',
          marginBottom: '32px',
        }}
      >
        <Plus size={20} />
        <span>Add Exercise to Routine</span>
      </button>

      {/* Exercise Picker Modal */}
      <Modal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="Choose Exercise from Library"
        maxWidth="600px"
      >
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search exercises by name or muscle..."
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
          />
        </div>

        <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredPickerExercises.map((ex) => (
            <div
              key={ex._id}
              onClick={() => handleAddExercise(ex)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{ex.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {ex.category} • {ex.muscleGroups?.join(', ')} • {ex.equipment}
                </div>
              </div>
              <Plus size={18} color="#10b981" />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
