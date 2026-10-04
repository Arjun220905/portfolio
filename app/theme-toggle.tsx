'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type Theme = 'light' | 'dark';

const storageKey = 'arjun-portfolio-theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const reduced = useReducedMotion();

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) as Theme | null;
    const resolved = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(resolved);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(storageKey, next);
    setTheme(next);
  };

  const isDark = theme === 'dark';
  return (
    <motion.button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span key={theme} aria-hidden="true"
          initial={{ opacity: 0, rotate: reduced ? 0 : -35, scale: reduced ? 1 : 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: reduced ? 0 : 35, scale: reduced ? 1 : 0.8 }}
          transition={{ duration: 0.12 }}>
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
