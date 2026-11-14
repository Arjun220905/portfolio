'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView } from 'motion/react';
import { usePrefersReducedMotion } from './use-reduced-motion';
import s from './hero-atmosphere.module.css';

export function HeroAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!ref.current || reduced || !inView) return;
    const light = ref.current.querySelector<HTMLSpanElement>('span');
    if (!light) return;
    const controls = [animate(light, {
      transform: ['translate(-12%, 5%) scale(.95)', 'translate(12%, -6%) scale(1.08)', 'translate(-12%, 5%) scale(.95)'],
    }, { duration: 22, repeat: Infinity, ease: 'easeInOut' })];
    const visibility = () => { for (const control of controls) { if (document.hidden) control.pause(); else control.play(); } };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      for (const control of controls) control.stop();
    };
  }, [inView, reduced]);

  return <div ref={ref} className={s.atmosphere} aria-hidden="true"><span className={s.light}/></div>;
}
