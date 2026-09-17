'use client';

import { useEffect } from 'react';

export function MotionLayer() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    const root = document.documentElement;
    const updateProgress = () => {
      const distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty('--scroll-progress', String(window.scrollY / distance));
    };

    let pointerFrame = 0;
    const updatePointer = (event: PointerEvent) => {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', String(event.clientX / window.innerWidth));
        root.style.setProperty('--pointer-y', String(event.clientY / window.innerHeight));
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('pointermove', updatePointer, { passive: true });

    const projectCards = Array.from(document.querySelectorAll<HTMLElement>('.project'));
    const canTilt = window.matchMedia('(pointer: fine)').matches;
    const cleanups = projectCards.map((card) => {
      if (!canTilt) return () => undefined;

      let tiltFrame = 0;
      const reset = () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--shine-x', '50%');
        card.style.setProperty('--shine-y', '50%');
      };
      const tilt = (event: PointerEvent) => {
        cancelAnimationFrame(tiltFrame);
        tiltFrame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          card.style.setProperty('--tilt-x', `${(x - 0.5) * 1.8}deg`);
          card.style.setProperty('--tilt-y', `${(0.5 - y) * 1.2}deg`);
          card.style.setProperty('--shine-x', `${x * 100}%`);
          card.style.setProperty('--shine-y', `${y * 100}%`);
        });
      };

      card.addEventListener('pointermove', tilt);
      card.addEventListener('pointerleave', reset);
      return () => {
        cancelAnimationFrame(tiltFrame);
        card.removeEventListener('pointermove', tilt);
        card.removeEventListener('pointerleave', reset);
        reset();
      };
    });

    return () => {
      cancelAnimationFrame(pointerFrame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('pointermove', updatePointer);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
