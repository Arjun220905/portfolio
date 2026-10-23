'use client';

import { useEffect } from 'react';
import { animate } from 'motion/react';

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
          root.style.setProperty('--hero-lift', `${Math.max(-24, -window.scrollY * .055)}px`);
      });
    };

    const configure = () => {
      cleanup.splice(0).forEach(remove => remove());
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pointerFrame);
      if (preference.matches) return;

      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      cleanup.push(() => {
        window.removeEventListener('scroll', updateProgress);
        window.removeEventListener('resize', updateProgress);
      });

      if (window.matchMedia('(pointer: fine)').matches) {
        // Move only the contents: the hit target stays stable under the pointer.
        document.querySelectorAll<HTMLElement>('.hero-bottom .text-link, .socials a, .off-clock-card').forEach(target => {
          const subject = target.querySelector<HTMLElement | SVGElement>('svg') ?? target;
          let motion: ReturnType<typeof animate> | undefined;
          const move = (event: PointerEvent) => {
            const bounds = target.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width - .5) * 12;
            const y = ((event.clientY - bounds.top) / bounds.height - .5) * 10;
            motion?.stop();
            motion = animate(subject, { x, y, rotate: target.matches('.off-clock-card') ? x : 0 }, { type: 'spring', stiffness: 220, damping: 22 });
          };
          const reset = () => {
            motion?.stop();
            motion = animate(subject, { x: 0, y: 0, rotate: 0 }, { type: 'spring', stiffness: 260, damping: 18 });
          };
          target.addEventListener('pointermove', move, { passive: true });
          target.addEventListener('pointerleave', reset);
          cleanup.push(() => {
            target.removeEventListener('pointermove', move);
            target.removeEventListener('pointerleave', reset);
            motion?.stop();
            subject.style.removeProperty('transform');
          });
        });
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
      const revealed = new WeakSet<Element>();
      const arriving = new WeakSet<Element>();
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const replay = entry.target.matches('.project, .off-clock-card, .off-clock-head');
          if (!entry.isIntersecting) {
            // Rearm only after fully leaving, never at the reveal threshold.
            if (replay && !arriving.has(entry.target)) revealed.delete(entry.target);
            return;
          }
          if (entry.intersectionRatio < .18 || revealed.has(entry.target)) return;
          revealed.add(entry.target);
          if (!replay) observer?.unobserve(entry.target);
          entry.target.classList.add('is-visible');
          // Animate only when reached; content stays readable if scripting fails.
          const isLabel = entry.target.matches('.section-label, .working-set-label');
          const isCard = entry.target.matches('.project, .off-clock-card');
          const index = Array.from(entry.target.parentElement?.children ?? []).indexOf(entry.target);
          const isProject = entry.target.matches('.project');
          const isHobby = entry.target.matches('.off-clock-card');
          const isOutsideHeading = entry.target.matches('.off-clock-head');
          if (isProject || isHobby || isOutsideHeading) {
            const mobile = window.matchMedia('(max-width: 700px)').matches;
            const direction = entry.boundingClientRect.top < 0 ? -1 : 1;
            const distance = (mobile ? 28 : 76) * direction;
            const rotation = isHobby && !mobile ? (index - 1) * 2.5 : 0;
            const start = isOutsideHeading
              ? `translateX(${mobile ? -24 : -56}px)`
              : `translateY(${distance}px) scale(${isProject ? .95 : .92}) rotate(${rotation}deg)`;
            const arrival = entry.target.animate([
              { opacity: 0, transform: start },
              { opacity: 1, transform: 'translate(0, 0) scale(1) rotate(0deg)' },
            ], {
              duration: mobile ? 600 : isOutsideHeading ? 1100 : 950,
              delay: isHobby && !mobile ? index * 150 : 0,
              easing: 'cubic-bezier(.16, 1, .3, 1)',
              fill: 'backwards',
            });
            animations.add(arrival);
            arriving.add(entry.target);
            arrival.onfinish = () => {
              animations.delete(arrival);
              arriving.delete(entry.target);
              const bounds = entry.target.getBoundingClientRect();
              if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) revealed.delete(entry.target);
            };
            // One coordinated card entrance avoids competing nested transforms.
            return;
          }
          const animation = entry.target.animate([
            { opacity: isLabel ? 0.45 : 0.22, transform: `translateY(${isLabel ? 8 : isCard ? 18 : 14}px)` },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: isLabel ? 380 : isCard ? 560 : 500, delay: isCard ? Math.max(0, index) * 65 : 0, easing: 'cubic-bezier(.16, 1, .3, 1)' });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);

          entry.target.querySelectorAll<HTMLElement>('h2, h3').forEach((heading, headingIndex) => {
            const headingAnimation = heading.animate([
              { opacity: 0.3, transform: 'translateY(18px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ], { duration: 620, delay: 120 + headingIndex * 70, easing: 'cubic-bezier(.16, 1, .3, 1)' });
            animations.add(headingAnimation);
            headingAnimation.onfinish = () => animations.delete(headingAnimation);
          });
          entry.target.querySelectorAll('.principles > div, .article-links > a, .signal-strip > div, .project-copy > p, .project-meta, .project-signal').forEach((row, rowIndex) => {
            const reveal = row.animate([
              { opacity: 0, transform: 'translateX(-12px)' },
              { opacity: 1, transform: 'translateX(0)' },
            ], { duration: 460, delay: 100 + rowIndex * 75, fill: 'backwards', easing: 'cubic-bezier(.16, 1, .3, 1)' });
            animations.add(reveal);
            reveal.onfinish = () => animations.delete(reveal);
          });
        });
      }, { threshold: [0, 0.18] });
      document.querySelectorAll('.section-label, .working-set-label, .section-intro, .signal-strip, .project, .working-set-grid, .off-clock-head, .off-clock-card, .about-grid, .notes-grid, .footer').forEach(element => observer?.observe(element));
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
      root.style.removeProperty('--hero-lift');
    };
  }, []);

  return null;
}
