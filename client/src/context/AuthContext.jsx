import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useTheme } from './ThemeContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('pulse_token');
      if (token) {
        try {
          const data = await authService.getMe();
          setUser(data.user);
          if (data.user?.preferences?.theme) {
            setTheme(data.user.preferences.theme);
          }
        } catch {
          // Token invalid or network issue, fallback to stored user if any
          const stored = authService.getStoredUser();
          if (stored) {
            setUser(stored);
            if (stored.preferences?.theme) {
              setTheme(stored.preferences.theme);
            }
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
    if (data.user?.preferences?.theme) {
      setTheme(data.user.preferences.theme);
    }
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    setUser(data.user);
    if (data.user?.preferences?.theme) {
      setTheme(data.user.preferences.theme);
    }
    return data;
  };

  const updateProfile = async (profileData) => {
    const data = await authService.updateProfile(profileData);
    setUser(data.user);
    if (data.user?.preferences?.theme) {
      setTheme(data.user.preferences.theme);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Demo guest login for fast testing
  const demoLogin = () => {
    const demoUser = {
      id: 'demo_user_12345',
      name: 'Alex Mercer',
      email: 'alex.fitness@pulse.dev',
      role: 'user',
      profile: {
        avatar: '',
        height: 182,
        weight: 78,
        fitnessLevel: 'intermediate',
        fitnessGoal: 'build_muscle',
        weeklyWorkoutTarget: 5,
        dailyCalorieTarget: 2400,
        dailyWaterTarget: 3000,
      },
      preferences: {
        unitSystem: 'metric',
        theme: 'dark',
      },
    };
    localStorage.setItem('pulse_token', 'demo_jwt_token_sample');
    localStorage.setItem('pulse_user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateProfile,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
