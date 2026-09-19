import api from './api';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('pulse_token', res.data.token);
      localStorage.setItem('pulse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('pulse_token', res.data.token);
      localStorage.setItem('pulse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    if (res.data.user) {
      localStorage.setItem('pulse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.user) {
      localStorage.setItem('pulse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('pulse_token');
    localStorage.removeItem('pulse_user');
  },

  getStoredUser() {
    try {
      const user = localStorage.getItem('pulse_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('pulse_token'));
  },
};
