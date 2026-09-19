import api from './api';

export const progressService = {
  async getSummary() {
    const res = await api.get('/progress/summary');
    return res.data;
  },

  async getWeekly() {
    const res = await api.get('/progress/weekly');
    return res.data;
  },

  async getDistribution() {
    const res = await api.get('/progress/distribution');
    return res.data;
  },

  async getAchievements() {
    const res = await api.get('/progress/achievements');
    return res.data;
  },
};
