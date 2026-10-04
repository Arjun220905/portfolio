'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useScroll, useTransform, useInView } from 'motion/react';

/** Pointer-driven gradient field, inspired by the reference's fluid hero behavior. */
export function HeroAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const visible = useInView(ref);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 70, damping: 24 });
  const y = useSpring(pointerY, { stiffness: 70, damping: 24 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const lift = useTransform(scrollYProgress, [0, 1], [0, -65]);
  const counterX = useTransform(x, [-80, 80], [35, -35]);
  const counterY = useTransform(y, [-60, 60], [25, -25]);

  useEffect(() => {
    const hero = ref.current?.closest('.hero');
    if (!hero || reduced || !matchMedia('(pointer: fine)').matches) return;
    const move = (event: Event) => {
      const pointer = event as PointerEvent;
      const bounds = hero.getBoundingClientRect();
      pointerX.set(((pointer.clientX - bounds.left) / bounds.width - 0.5) * 160);
      pointerY.set(((pointer.clientY - bounds.top) / bounds.height - 0.5) * 120);
    };
    const reset = () => { pointerX.set(0); pointerY.set(0); };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
    };
  }, [reduced, pointerX, pointerY]);

  return (
    <div ref={ref} className="hero-atmosphere" data-visible={visible} aria-hidden="true">
      <motion.div className="fluid-field" style={reduced ? undefined : { y: lift }}>
        <motion.div className="fluid-current current-primary" style={reduced ? undefined : { x, y }}>
          <div className="fluid-color" />
        </motion.div>
        <motion.div className="fluid-current current-secondary" style={reduced ? undefined : { x: counterX, y: counterY }}>
          <div className="fluid-color" />
        </motion.div>
        <motion.div className="fluid-current current-highlight" style={reduced ? undefined : { x, y: counterY }}>
          <div className="fluid-color" />
        </motion.div>
      </motion.div>
    </div>
  );
}
