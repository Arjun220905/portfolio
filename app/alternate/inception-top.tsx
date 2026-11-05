'use client';

import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import { animate, motion, useMotionValue, useSpring, useTransform, type AnimationPlaybackControls } from 'motion/react';
import { usePrefersReducedMotion } from './use-reduced-motion';
import type { TopScene } from './top-scene';
import s from './inception-top.module.css';

export function InceptionTop() {
  const id = useId().replace(/:/g, '');
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLButtonElement>(null);
  const animation = useRef<AnimationPlaybackControls | null>(null);
  const visible = useRef(true);
  const gesture = useRef<{ pointer: number; x: number; y: number; lastX: number; lastTime: number; velocity: number; angle: number } | null>(null);
  const ignoreClick = useRef(false);
  const bounds = useRef<DOMRect | null>(null);
  const [ready, setReady] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const reduced = usePrefersReducedMotion();
  const angle = useMotionValue(.3);
  const tiltX = useMotionValue(.04);
  const tiltZ = useMotionValue(-.12);
  const viewX = useSpring(0, { stiffness: 110, damping: 20 });
  const viewY = useSpring(0, { stiffness: 110, damping: 20 });
  const fallbackTilt = useTransform(tiltZ, [-1, 1], [-57.3, 57.3]);

  function stop() {
    animation.current?.stop();
    animation.current = null;
    setSpinning(false);
  }

  function spin(strength = 1, direction = 1) {
    stop();
    if (reduced) {
      tiltX.set(0);
      tiltZ.set(tiltZ.get() < -.4 ? 0 : -.85);
      return;
    }
    const base = angle.get(), startX = tiltX.get(), startZ = tiltZ.get();
    const turns = (14 + strength * 13) * Math.PI * 2 * direction;
    setSpinning(true);
    animation.current = animate(0, 1, {
      duration: 8 + strength * 3,
      ease: 'linear',
      onUpdate(p) {
        const rotation = base + turns * (1 - (1 - p) ** 3);
        const lift = Math.min(1, p / .1);
        const upright = 1 - (1 - lift) ** 3;
        const wobble = .025 + .22 * p ** 4;
        const fall = Math.max(0, (p - .86) / .14);
        const settle = fall * fall * (3 - 2 * fall);
        const precession = rotation * .24;
        angle.set(rotation);
        tiltX.set(startX * (1 - upright) + Math.sin(precession) * wobble * upright * (1 - settle));
        tiltZ.set(startZ * (1 - upright) + Math.cos(precession) * wobble * upright * (1 - settle) - .85 * settle);
      },
      onComplete() { animation.current = null; setSpinning(false); },
    });
  }

  useEffect(() => {
    if (!canvas.current || !stage.current) return;
    const element = canvas.current;
    let scene: TopScene | undefined;
    let cancelled = false, failed = false, inView = true, frame = 0;
    const schedule = () => {
      if (frame || !scene || failed || !visible.current) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scene?.draw(angle.get(), tiltX.get(), tiltZ.get(), viewX.get(), viewY.get());
      });
    };
    const resize = () => { scene?.resize(element.clientWidth); schedule(); };
    const theme = () => { scene?.theme(document.documentElement.dataset.theme === 'dark'); schedule(); };
    const visibility = () => {
      visible.current = inView && !document.hidden;
      if (visible.current) { animation.current?.play(); schedule(); }
      else { animation.current?.pause(); cancelAnimationFrame(frame); frame = 0; }
    };
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); });
    intersection.observe(stage.current);
    const size = new ResizeObserver(resize);
    size.observe(element);
    const themeObserver = new MutationObserver(theme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('visibilitychange', visibility);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      if (!preference.matches) return;
      animation.current?.stop(); animation.current = null; setSpinning(false);
      viewX.jump(0); viewY.jump(0);
    };
    preference.addEventListener('change', onMotionChange);
    const onLost = (event: Event) => {
      event.preventDefault(); failed = true; setReady(false);
      animation.current?.stop(); animation.current = null; setSpinning(false);
    };
    element.addEventListener('webglcontextlost', onLost);
    const unsubscribe = [angle, tiltX, tiltZ, viewX, viewY].map(value => value.on('change', schedule));
    import('./top-scene').then(({ createTopScene }) => {
      if (cancelled) return;
      try {
        scene = createTopScene(element);
        resize(); theme();
        scene.draw(angle.get(), tiltX.get(), tiltZ.get(), viewX.get(), viewY.get());
        setReady(true);
      } catch { failed = true; }
    }).catch(() => { failed = true; });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      animation.current?.stop(); animation.current = null;
      unsubscribe.forEach(dispose => dispose());
      intersection.disconnect(); size.disconnect(); themeObserver.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      preference.removeEventListener('change', onMotionChange);
      element.removeEventListener('webglcontextlost', onLost);
      scene?.dispose();
    };
  }, [angle, tiltX, tiltZ, viewX, viewY]);

  function move(event: PointerEvent<HTMLButtonElement>) {
    const active = gesture.current;
    if (active?.pointer === event.pointerId) {
      const dx = event.clientX - active.x;
      if (Math.hypot(dx, event.clientY - active.y) > 6) ignoreClick.current = true;
      if (event.clientX !== active.lastX) {
        const velocity = (event.clientX - active.lastX) / Math.max(8, event.timeStamp - active.lastTime);
        active.velocity = active.velocity * .35 + velocity * .65;
        active.lastX = event.clientX;
        active.lastTime = event.timeStamp;
      }
      if (!reduced) { angle.set(active.angle + dx * .025); viewX.set(Math.max(-.8, Math.min(.8, dx / 100))); }
    } else if (!reduced && event.pointerType === 'mouse' && bounds.current) {
      const rect = bounds.current;
      viewX.set(((event.clientX - rect.left) / rect.width - .5) * 1.2);
      viewY.set(-((event.clientY - rect.top) / rect.height - .5) * .6);
    }
  }

  return <button ref={stage} className={s.stage} type="button" data-renderer={ready ? 'webgl' : 'fallback'} data-state={spinning ? 'spinning' : 'rest'}
    aria-label="Spin the Inception-style top" aria-describedby={`${id}-instructions`} title="Flick or tap to spin. Press Escape to stop."
    onPointerEnter={event => { bounds.current = event.currentTarget.getBoundingClientRect(); }}
    onPointerDown={event => {
      if (!event.isPrimary || event.button !== 0) return;
      stop(); ignoreClick.current = false;
      gesture.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, angle: angle.get() };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={move}
    onPointerUp={event => {
      const active = gesture.current;
      if (active?.pointer !== event.pointerId) return;
      if (ignoreClick.current) {
        const velocity = event.timeStamp - active.lastTime > 120 ? 0 : active.velocity;
        spin(Math.max(.4, Math.min(2, Math.abs(velocity) * 1.4)), Math.sign(velocity || event.clientX - active.x) || 1);
      }
      gesture.current = null; viewX.set(0); viewY.set(0);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }}
    onPointerCancel={() => { gesture.current = null; ignoreClick.current = true; viewX.set(0); viewY.set(0); }}
    onLostPointerCapture={() => { gesture.current = null; }}
    onPointerLeave={() => { if (!gesture.current) { viewX.set(0); viewY.set(0); } }}
    onClick={event => { if (event.detail === 0 || !ignoreClick.current) spin(); ignoreClick.current = false; }}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); stop(); } }}
  >
    <span id={`${id}-instructions`} className={s.srOnly}>Flick sideways or tap to spin. A faster flick spins longer. Enter or Space also spins; Escape stops it. With reduced motion enabled, tap to change its resting position.</span>
    <output className={s.srOnly}>{spinning ? 'Spinning.' : 'Ready for another spin.'}</output>
    <div className={s.fallback} aria-hidden="true">
      <svg viewBox="0 0 600 600" focusable="false">
        <defs><linearGradient id={`${id}-steel`}><stop stopColor="#475461"/><stop offset=".25" stopColor="#d2d9e0"/><stop offset=".48" stopColor="#7b8794"/><stop offset=".7" stopColor="#e1e7ed"/><stop offset="1" stopColor="#566270"/></linearGradient></defs>
        <ellipse cx="300" cy="465" rx="100" ry="13" fill="currentColor" opacity=".08"/>
        <motion.g style={{ rotate: fallbackTilt, originX: .5, originY: 1 }}>
          <path d="M300 460C287 418 223 375 180 346Q170 335 183 330L281 285 286 172Q270 155 283 149Q300 140 317 149Q330 155 314 172L319 285 417 330Q430 335 420 346C377 375 313 418 300 460Z" fill={`url(#${id}-steel)`}/>
          <ellipse cx="300" cy="337" rx="122" ry="26" fill={`url(#${id}-steel)`} stroke="#cad4dd" strokeWidth="2"/>
          <path d="M181 337Q300 373 419 337" fill="none" stroke="#4d5966" strokeWidth="2"/>
        </motion.g>
      </svg>
    </div>
    <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
  </button>;
}
