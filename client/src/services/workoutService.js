import api from './api';

export const workoutService = {
  async getWorkouts(params = {}) {
    const res = await api.get('/workouts', { params });
    return res.data;
  },

  async getWorkoutById(id) {
    const res = await api.get(`/workouts/${id}`);
    return res.data;
  },

  async createWorkout(workoutData) {
    const res = await api.post('/workouts', workoutData);
    return res.data;
  },

  async updateWorkout(id, workoutData) {
    const res = await api.put(`/workouts/${id}`, workoutData);
    return res.data;
  },

  async deleteWorkout(id) {
    const res = await api.delete(`/workouts/${id}`);
    return res.data;
  },

  async getCalendarWorkouts(year, month) {
    const res = await api.get('/workouts/calendar', { params: { year, month } });
    return res.data;
  },
};
