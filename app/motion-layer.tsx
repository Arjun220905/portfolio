'use client';

import { useEffect } from 'react';

export function MotionLayer() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    let frame = 0;
    let pointerFrame = 0;
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();
    const cleanup: Array<() => void> = [];

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = Math.max(1, root.scrollHeight - window.innerHeight);
        root.style.setProperty('--scroll-progress', String(window.scrollY / distance));
      });
    };

    const configure = () => {
      cleanup.splice(0).forEach(remove => remove());
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      cancelAnimationFrame(frame);
      if (preference.matches) return;

      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      cleanup.push(() => {
        window.removeEventListener('scroll', updateProgress);
        window.removeEventListener('resize', updateProgress);
      });

      if (window.matchMedia('(pointer: fine)').matches) {
        const moveAmbient = (event: PointerEvent) => {
          cancelAnimationFrame(pointerFrame);
          pointerFrame = requestAnimationFrame(() => {
            root.style.setProperty('--pointer-offset-x', `${((event.clientX / window.innerWidth) - 0.5) * 8}%`);
            root.style.setProperty('--pointer-offset-y', `${((event.clientY / window.innerHeight) - 0.5) * 8}%`);
          });
        };
        window.addEventListener('pointermove', moveAmbient, { passive: true });
        cleanup.push(() => window.removeEventListener('pointermove', moveAmbient));

        document.querySelectorAll<HTMLElement>('.project').forEach(project => {
          const tilt = (event: PointerEvent) => {
            const bounds = project.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            project.style.setProperty('--shine-x', `${x * 100}%`);
            project.style.setProperty('--shine-y', `${y * 100}%`);
            project.style.transform = `translateY(-4px) rotateX(${(0.5 - y) * 1.25}deg) rotateY(${(x - 0.5) * 1.25}deg)`;
          };
          const resetTilt = () => { project.style.removeProperty('transform'); };
          project.addEventListener('pointermove', tilt);
          project.addEventListener('pointerleave', resetTilt);
          cleanup.push(() => {
            project.removeEventListener('pointermove', tilt);
            project.removeEventListener('pointerleave', resetTilt);
            resetTilt();
          });
        });
      }
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
      cancelAnimationFrame(pointerFrame);
      cleanup.splice(0).forEach(remove => remove());
      preference.removeEventListener('change', configure);
      root.style.removeProperty('--scroll-progress');
      root.style.removeProperty('--pointer-offset-x');
      root.style.removeProperty('--pointer-offset-y');
    };
  }, []);

  return null;
}
