import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Dumbbell,
  Flame,
  Activity,
  Shield,
  Zap,
  Info,
  ChevronRight,
} from 'lucide-react';
import { exerciseService } from '../services/exerciseService';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

export const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [muscle, setMuscle] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: 'Strength',
    muscleGroups: ['Chest'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: '',
    caloriesPerMinute: 7,
  });

  const { showToast } = useToast();

  const categories = ['All', 'Strength', 'Cardio', 'Core', 'HIIT', 'Calisthenics'];
  const muscles = ['All', 'Chest', 'Back', 'Quads', 'Hamstrings', 'Shoulders', 'Arms', 'Core'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchExercises();
  }, [category, muscle, difficulty]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await exerciseService.getExercises({ category, muscle, difficulty, search });
      if (res.data) {
        setExercises(res.data);
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExercises();
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    try {
      const instructionsArr = newExercise.instructions.split('\n').filter((s) => s.trim());
      const res = await exerciseService.createExercise({
        ...newExercise,
        instructions: instructionsArr,
      });
      showToast('Custom exercise added successfully!', 'success');
      setIsAddModalOpen(false);
      setExercises((prev) => [res.data, ...prev]);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create exercise', 'error');
    }
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Strength': return 'badge-emerald';
      case 'Cardio': return 'badge-amber';
      case 'HIIT': return 'badge-rose';
      case 'Core': return 'badge-cyan';
      default: return 'badge-purple';
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Exercise Library</h1>
          <p style={{ margin: 0 }}>Explore movements, execution instructions, and target muscles</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Custom Exercise</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by exercise name (e.g., Bench Press, Squats, Pull-ups)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '70px' }}>Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '70px' }}>Muscle:</span>
            {muscles.map((mus) => (
              <button
                key={mus}
                onClick={() => setMuscle(mus)}
                className={`btn btn-sm ${muscle === mus ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)' }}
              >
                {mus}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
          <p>Loading exercise database...</p>
        </div>
      ) : exercises.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 16px' }}>
          <Dumbbell size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <h3>No exercises found</h3>
          <p>Try clearing your filters or adding a custom exercise.</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {exercises.map((ex) => (
            <div
              key={ex._id}
              className="glass-card glass-card-glow"
              onClick={() => setSelectedExercise(ex)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span className={`badge ${getCategoryBadgeClass(ex.category)}`}>
                    {ex.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {ex.equipment}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '8px' }}>
                  {ex.name}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {ex.muscleGroups?.map((m) => (
                    <span
                      key={m}
                      style={{
                        fontSize: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>🔥 ~{ex.caloriesPerMinute || 7} kcal/min</span>
                <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                  View Guide <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal */}
      <Modal
        isOpen={Boolean(selectedExercise)}
        onClose={() => setSelectedExercise(null)}
        title={selectedExercise?.name || 'Exercise Details'}
        maxWidth="600px"
      >
        {selectedExercise && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className={`badge ${getCategoryBadgeClass(selectedExercise.category)}`}>
                {selectedExercise.category}
              </span>
              <span className="badge badge-cyan">{selectedExercise.difficulty}</span>
              <span className="badge badge-purple">{selectedExercise.equipment}</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px', textTransform: 'uppercase' }}>
                Primary Target Muscles
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedExercise.muscleGroups?.map((m) => (
                  <span key={m} className="badge badge-emerald">{m}</span>
                ))}
                {selectedExercise.secondaryMuscles?.map((m) => (
                  <span key={m} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '999px', color: '#cbd5e1' }}>
                    {m} (Secondary)
                  </span>
                ))}
              </div>
            </div>

            {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '10px' }}>
                  Execution Instructions
                </h4>
                <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {selectedExercise.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {selectedExercise.tips && selectedExercise.tips.length > 0 && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                }}
              >
                <h4 style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={16} /> Coach Pro Tips
                </h4>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {selectedExercise.tips.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Custom Exercise Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Exercise"
      >
        <form onSubmit={handleCreateExercise}>
          <div className="form-group">
            <label className="form-label">Exercise Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Bulgarian Split Squats"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newExercise.category}
                onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Core">Core</option>
                <option value="HIIT">HIIT</option>
                <option value="Calisthenics">Calisthenics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Equipment</label>
              <select
                className="form-select"
                value={newExercise.equipment}
                onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
              >
                <option value="Barbell">Barbell</option>
                <option value="Dumbbell">Dumbbell</option>
                <option value="Machine">Machine</option>
                <option value="Cable">Cable</option>
                <option value="Bodyweight">Bodyweight</option>
                <option value="Kettlebell">Kettlebell</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Muscle Group</label>
            <select
              className="form-select"
              value={newExercise.muscleGroups[0]}
              onChange={(e) => setNewExercise({ ...newExercise, muscleGroups: [e.target.value] })}
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Quads">Quads</option>
              <option value="Hamstrings">Hamstrings</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Arms">Arms</option>
              <option value="Core">Core</option>
              <option value="Glutes">Glutes</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Instructions (One step per line)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Step 1: Set up the bench...&#10;Step 2: Lower the weight..."
              value={newExercise.instructions}
              onChange={(e) => setNewExercise({ ...newExercise, instructions: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Save Exercise to Library
          </button>
        </form>
      </Modal>
    </div>
  );
};
