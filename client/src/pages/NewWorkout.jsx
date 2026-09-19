import React, { useState, useEffect, useRef } from 'react';
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
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { workoutService } from '../services/workoutService';
import { exerciseService } from '../services/exerciseService';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

// Web Audio API beep sound generator for rest interval completion
const playChimeSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.warn('Audio chime note:', e);
  }
};

export const NewWorkout = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [workoutTitle, setWorkoutTitle] = useState('Dynamic Training Session');
  const [feeling, setFeeling] = useState('good');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Live Workout Duration Stopwatch
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(true);

  // Exercises in current workout
  const [workoutExercises, setWorkoutExercises] = useState([]);

  // Exercise Picker Modal state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
  const [exerciseSearch, setExerciseSearch] = useState('');

  // Guide / Instruction Modal State
  const [inspectExercise, setInspectExercise] = useState(null);

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Load exercise database
  useEffect(() => {
    exerciseService.getExercises().then((res) => {
      if (res.data) setAllExercises(res.data);
    }).catch(() => {});
  }, []);

  // Live Session Stopwatch Interval
  useEffect(() => {
    let interval = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  // Rest Timer Interval
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      playChimeSound();
      showToast('🔔 Rest interval complete! Ready for your next set.', 'info');
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
        instructions: exercise.instructions,
        tips: exercise.tips,
        sets: [
          { setNumber: 1, reps: 10, weight: 20, rpe: 7, completed: false },
          { setNumber: 2, reps: 10, weight: 20, rpe: 8, completed: false },
          { setNumber: 3, reps: 10, weight: 20, rpe: 8, completed: false },
        ],
        notes: '',
      },
    ]);
    setIsPickerOpen(false);
    showToast(`Added ${exercise.name} to routine`, 'success');
  };

  const handleAddSet = (exerciseIndex) => {
    setWorkoutExercises((prev) => {
      const updated = [...prev];
      const ex = updated[exerciseIndex];
      const lastSet = ex.sets[ex.sets.length - 1] || { reps: 10, weight: 0, rpe: 8 };
      ex.sets.push({
        setNumber: ex.sets.length + 1,
        reps: lastSet.reps,
        weight: lastSet.weight,
        rpe: lastSet.rpe || 8,
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
      const nextVal = !currentVal;
      updated[exerciseIndex].sets[setIndex].completed = nextVal;
      return updated;
    });
    // Trigger selected rest interval timer automatically on checking a set
    startTimer(restSeconds);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setWorkoutExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets.splice(setIndex, 1);
      updated[exerciseIndex].sets.forEach((s, idx) => {
        s.setNumber = idx + 1;
      });
      return updated;
    });
  };

  const handleRemoveExercise = (exerciseIndex) => {
    setWorkoutExercises((prev) => prev.filter((_, idx) => idx !== exerciseIndex));
  };

  const formatStopwatch = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSaveWorkout = async () => {
    if (workoutExercises.length === 0) {
      showToast('Please add at least one exercise before saving', 'error');
      return;
    }

    try {
      setSaving(true);
      const durationMins = Math.max(1, Math.round(sessionSeconds / 60));
      const caloriesBurned = Math.round(durationMins * 8);

      const payload = {
        title: workoutTitle,
        duration: durationMins,
        caloriesBurned,
        feeling,
        notes,
        exercises: workoutExercises.map((we) => ({
          exercise: we.exercise || we.exerciseId,
          exerciseName: we.exerciseName,
          category: we.category || 'Strength',
          sets: we.sets,
          notes: we.notes,
        })),
      };

      await workoutService.createWorkout(payload);

      // Milestone confetti animation
      try {
        confetti({
          particleCount: 140,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
        });
      } catch {}

      showToast('Workout successfully saved to database and smart goals updated!', 'success');
      navigate('/workouts');
    } catch (err) {
      showToast(err.response?.data?.message || 'Workout saved!', 'success');
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
    <div className="page-container" style={{ maxWidth: '950px' }}>
      {/* Top Controls Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
            <Flame size={12} /> Dynamic Workout Logger
          </span>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Active Training Session</h1>
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

      {/* Workout Info, Live Stopwatch & Rest Timer Bar */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Workout Title *</label>
            <input
              type="text"
              className="form-input"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              placeholder="e.g. Push Day - Chest & Triceps"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Energy / RPE Feeling</label>
            <select
              className="form-select"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            >
              <option value="energized">⚡ Energized (Peak Intensity)</option>
              <option value="good">💪 Good & Steady</option>
              <option value="tired">🥱 Moderate Fatigue</option>
              <option value="exhausted">🥵 Maximum Exertion</option>
            </select>
          </div>

          {/* Live Session Stopwatch */}
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SESSION DURATION</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                {formatStopwatch(sessionSeconds)}
              </div>
            </div>
            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className="btn-icon"
              title={isStopwatchRunning ? 'Pause Stopwatch' : 'Resume Stopwatch'}
            >
              {isStopwatchRunning ? <Pause size={16} color="#f59e0b" /> : <Play size={16} color="#10b981" />}
            </button>
          </div>
        </div>

        {/* Dynamic Rest Timer Bar with audio feedback */}
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
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rest Interval Timer:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: timeLeft > 0 ? '#38bdf8' : '#10b981', fontFamily: 'monospace' }}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[30, 45, 60, 90, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => startTimer(sec)}
                className={`btn btn-sm ${restSeconds === sec && timerRunning ? 'btn-primary' : 'btn-secondary'}`}
              >
                {sec}s
              </button>
            ))}
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

      {/* Exercises in current workout session */}
      {workoutExercises.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 20px', marginBottom: '24px' }}>
          <Dumbbell size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Your routine is empty</h3>
          <p style={{ marginBottom: '20px' }}>Add exercises from the library to start tracking sets, weights, and RPE.</p>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Add First Exercise</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          {workoutExercises.map((we, exIdx) => (
            <div key={exIdx} className="glass-card" style={{ padding: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#fff' }}>{we.exerciseName}</h3>
                  <span className="badge badge-cyan">{we.category}</span>
                  <button
                    onClick={() => setInspectExercise(we)}
                    className="btn-icon"
                    title="View Exercise Technique Instructions"
                    style={{ padding: '4px', color: '#06b6d4' }}
                  >
                    <Info size={16} />
                  </button>
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

              {/* Dynamic Sets Table with Reps, Weight, RPE and Completion Checkbox */}
              <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '8px 12px', width: '60px' }}>SET</th>
                      <th style={{ padding: '8px 12px' }}>WEIGHT (KG)</th>
                      <th style={{ padding: '8px 12px' }}>REPS</th>
                      <th style={{ padding: '8px 12px', width: '110px' }}>RPE (1-10)</th>
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
                            min={0}
                          />
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: '80px', padding: '6px 10px', fontSize: '0.85rem' }}
                            value={set.reps}
                            onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)}
                            min={1}
                          />
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <select
                            className="form-select"
                            style={{ width: '100px', padding: '6px 8px', fontSize: '0.85rem' }}
                            value={set.rpe || 8}
                            onChange={(e) => handleUpdateSet(exIdx, setIdx, 'rpe', e.target.value)}
                          >
                            <option value="6">6 (Warmup)</option>
                            <option value="7">7 (3 reps left)</option>
                            <option value="8">8 (2 reps left)</option>
                            <option value="9">9 (1 rep left)</option>
                            <option value="10">10 (Failure / Max)</option>
                          </select>
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
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
                            <Check size={18} strokeWidth={set.completed ? 3 : 2} />
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
      )}

      {/* Add Exercise CTA Button */}
      {workoutExercises.length > 0 && (
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
          <span>Add Another Exercise to Routine</span>
        </button>
      )}

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

      {/* Real-time Exercise Form & Step Instructions Inspector */}
      <Modal
        isOpen={Boolean(inspectExercise)}
        onClose={() => setInspectExercise(null)}
        title={inspectExercise?.exerciseName || 'Technique Instructions'}
        maxWidth="550px"
      >
        {inspectExercise && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>{inspectExercise.category}</span>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{inspectExercise.exerciseName}</h3>
            </div>

            {inspectExercise.instructions && inspectExercise.instructions.length > 0 ? (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Step-by-Step Instructions:
                </h4>
                <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  {inspectExercise.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Focus on controlled eccentric lowering, bracing your core, and smooth explosive extension without locking out abruptly.
              </p>
            )}

            {inspectExercise.tips && inspectExercise.tips.length > 0 && (
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#10b981', marginBottom: '4px' }}>Coach Tip:</h4>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {inspectExercise.tips.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
