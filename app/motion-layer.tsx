'use client';

import { useEffect } from 'react';

export function MotionLayer() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = Math.max(1, root.scrollHeight - window.innerHeight);
        root.style.setProperty('--scroll-progress', String(window.scrollY / distance));
      });
    };

    const configure = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      cancelAnimationFrame(frame);
      if (preference.matches) return;

      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer?.unobserve(entry.target);
          // Animate only when reached; content stays readable if scripting fails.
          const animation = entry.target.animate([
            { opacity: 0.25, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 650, easing: 'cubic-bezier(.16, 1, .3, 1)' });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.section-intro, .project, .working-set-grid, .off-clock-head, .off-clock-card, .about-grid, .notes-grid, .footer').forEach(element => observer?.observe(element));
    };

    configure();
    preference.addEventListener('change', configure);
    return () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      preference.removeEventListener('change', configure);
      root.style.removeProperty('--scroll-progress');
    };
  }, []);

  return null;
}
