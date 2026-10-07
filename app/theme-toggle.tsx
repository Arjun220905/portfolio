'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type Theme = 'light' | 'dark';

const storageKey = 'arjun-portfolio-theme';

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'light' as Theme);
  const reduced = useReducedMotion();

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { window.localStorage.setItem(storageKey, next); } catch { /* Theme still works when storage is unavailable. */ }
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
