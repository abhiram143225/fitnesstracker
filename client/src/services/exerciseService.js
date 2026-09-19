import api from './api';

export const exerciseService = {
  async getExercises(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.muscle && filters.muscle !== 'All') params.append('muscle', filters.muscle);
    if (filters.equipment && filters.equipment !== 'All') params.append('equipment', filters.equipment);
    if (filters.difficulty && filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
    if (filters.search) params.append('search', filters.search);

    const res = await api.get(`/exercises?${params.toString()}`);
    return res.data;
  },

  async getExerciseById(id) {
    const res = await api.get(`/exercises/${id}`);
    return res.data;
  },

  async createExercise(exerciseData) {
    const res = await api.post('/exercises', exerciseData);
    return res.data;
  },

  async deleteExercise(id) {
    const res = await api.delete(`/exercises/${id}`);
    return res.data;
  },
};
