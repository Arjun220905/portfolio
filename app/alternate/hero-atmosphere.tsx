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
    const arcs = ref.current.querySelectorAll<HTMLSpanElement>('span');
    const controls = [
      animate(arcs[0], { transform: ['rotate(-24deg) scale(.94)', 'rotate(18deg) scale(1.06)', 'rotate(-24deg) scale(.94)'] }, { duration: 26, repeat: Infinity, ease: 'easeInOut' }),
      animate(arcs[1], { transform: ['rotate(32deg) scale(1.04)', 'rotate(-20deg) scale(.92)', 'rotate(32deg) scale(1.04)'] }, { duration: 34, repeat: Infinity, ease: 'easeInOut' }),
    ];
    const visibility = () => { for (const control of controls) { if (document.hidden) control.pause(); else control.play(); } };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      for (const control of controls) control.stop();
    };
  }, [inView, reduced]);

  return <div ref={ref} className={s.atmosphere} aria-hidden="true"><div className={s.orbit}><span className={s.arc}/><span className={`${s.arc} ${s.counterArc}`}/></div></div>;
}
