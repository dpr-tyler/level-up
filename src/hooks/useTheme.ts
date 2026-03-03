'use client';
import { useEffect, useState, useCallback } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('level-up-theme');
    const initial = (stored === 'light') ? 'light' : 'dark';
    setThemeState(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const setTheme = useCallback((t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('level-up-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
