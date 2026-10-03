'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useScroll, useTransform, useInView } from 'motion/react';

/** Decorative light study: pointer and scroll motion never change the text layout. */
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
  const rotate = useTransform(scrollYProgress, [0, 1], [-18, 12]);

  useEffect(() => {
    const hero = ref.current?.closest('.hero');
    if (!hero || reduced || !matchMedia('(pointer: fine)').matches) return;
    const move = (event: Event) => {
      const pointer = event as PointerEvent;
      const bounds = hero.getBoundingClientRect();
      pointerX.set(((pointer.clientX - bounds.left) / bounds.width - 0.5) * 36);
      pointerY.set(((pointer.clientY - bounds.top) / bounds.height - 0.5) * 28);
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
      <motion.div className="atmosphere-parallax" style={reduced ? undefined : { y: lift, rotate }}>
        <motion.div className="light-sculpture" style={reduced ? undefined : { x, y }}
          initial={false} animate={reduced ? undefined : { opacity: [0, 1], scale: [0.86, 1] }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}>
          <div className="light-core" />
          <div className="light-contour contour-one" />
          <div className="light-contour contour-two" />
          <div className="light-contour contour-three" />
          <div className="light-axis" />
        </motion.div>
      </motion.div>
    </div>
  );
}
