import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if we're in browser environment and get stored theme preference
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      }

      // Set initial class on html element
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, []);

  // Update theme when darkMode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Set theme
  const setTheme = (isDark) => {
    setDarkMode(isDark);
  };

  // Theme context value
  const value = {
    darkMode,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;