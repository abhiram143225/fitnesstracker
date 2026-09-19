import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem('pulse_theme');
      if (stored === 'bright' || stored === 'light') return 'bright';
      if (stored === 'dark') return 'dark';
    } catch {
      // fallback
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);

    if (theme === 'bright' || theme === 'light') {
      root.classList.add('theme-bright');
      root.classList.remove('theme-dark');
      body.classList.add('theme-bright');
      body.classList.remove('theme-dark');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-bright');
      body.classList.add('theme-dark');
      body.classList.remove('theme-bright');
    }

    try {
      localStorage.setItem('pulse_theme', theme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'bright' || prev === 'light' ? 'dark' : 'bright'));
  };

  const setTheme = (newTheme) => {
    const normalized = (newTheme === 'bright' || newTheme === 'light') ? 'bright' : 'dark';
    setThemeState(normalized);
  };

  const isBright = theme === 'bright' || theme === 'light';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isBright,
        isDark: !isBright,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
