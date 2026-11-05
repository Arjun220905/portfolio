'use client';

import { usePrefersReducedMotion } from './use-reduced-motion';

import { useId, useRef, useState, type PointerEvent } from 'react';
import { motion, useSpring, useTransform, type MotionValue } from 'motion/react';
import s from './trojan-horse.module.css';

const silhouette = 'M144 264 169 243 291 251 312 221 330 169 351 136 349 107 373 126 393 117 402 142 455 168 449 194 423 201 387 184 381 234 400 275 390 324 360 355 200 355 161 334 145 299Z';
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

function Wheel({ x, rotation, rim }: { x: number; rotation: MotionValue<number> | number; rim: string }) {
  return <g transform={`translate(${x} 438)`}>
    <circle cx="-9" cy="-7" r="29" fill="var(--horse-dark)" />
    <path d="M-29 0 -38-7M29 0 20-7" stroke="var(--horse-dark)" strokeWidth="4" />
    <motion.g className={s.wheel} style={{ rotate: rotation }}>
      <circle r="29" fill={rim} stroke="var(--horse-dark)" strokeWidth="3" />
      <circle r="23" fill="var(--horse-dark)" stroke="var(--horse-light)" strokeWidth="1" />
      {[0, 45, 90, 135].map(angle => <path key={angle} d="M-22 0H22" transform={`rotate(${angle})`} stroke="var(--horse-mid)" strokeWidth="5" />)}
      <circle r="8" fill={rim} stroke="var(--horse-dark)" strokeWidth="2" />
      <circle r="3" fill="var(--horse-light)" />
    </motion.g>
  </g>;
}

export function TrojanHorse() {
  const id = useId().replace(/:/g, '');
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const gesture = useRef<{ pointer: number; x: number; y: number; scale: number } | null>(null);
  const bounds = useRef<DOMRect | null>(null);
  const ignoreClick = useRef(false);
  const roll = useSpring(0, { stiffness: 180, damping: 15, mass: .8 });
  const yaw = useSpring(0, { stiffness: 110, damping: 17 });
  const pitch = useSpring(0, { stiffness: 110, damping: 17 });
  const wheel = useTransform(roll, [-65, 65], [-128, 128]);
  const lean = useTransform(roll, [-65, 65], [-2, 2]);
  const reset = () => { roll.set(0); yaw.set(0); pitch.set(0); };
  const finish = () => { gesture.current = null; reset(); };

  function move(event: PointerEvent<HTMLButtonElement>) {
    const active = gesture.current;
    if (active && active.pointer === event.pointerId) {
      const dx = event.clientX - active.x;
      const dy = event.clientY - active.y;
      if (Math.hypot(dx, dy) > 6) ignoreClick.current = true;
      if (!reduced) {
        roll.set(clamp(dx * active.scale, 65));
        yaw.set(clamp(dx / 7, 14));
        pitch.set(clamp(-dy / 12, 6));
      }
    } else if (!reduced && event.pointerType === 'mouse' && bounds.current) {
      const rect = bounds.current;
      yaw.set(((event.clientX - rect.left) / rect.width - .5) * 20);
      pitch.set(-((event.clientY - rect.top) / rect.height - .5) * 12);
    }
  }

  return <button
    type="button"
    className={s.horse}
    aria-label="Open the Trojan horse"
    aria-pressed={open}
    aria-describedby={`${id}-instructions`}
    title="Drag to roll. Tap to open."
    onPointerEnter={event => { bounds.current = event.currentTarget.getBoundingClientRect(); }}
    onPointerDown={event => {
      if (!event.isPrimary || event.button !== 0) return;
      const rect = event.currentTarget.getBoundingClientRect();
      bounds.current = rect;
      ignoreClick.current = false;
      gesture.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, scale: 480 / rect.width };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={move}
    onPointerUp={event => {
      if (gesture.current?.pointer !== event.pointerId) return;
      finish();
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }}
    onPointerCancel={() => { ignoreClick.current = true; finish(); }}
    onLostPointerCapture={finish}
    onPointerLeave={() => { if (!gesture.current) reset(); }}
    onBlur={finish}
    onClick={event => {
      if (event.detail === 0 || !ignoreClick.current) setOpen(value => !value);
      ignoreClick.current = false;
    }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        if (!reduced) roll.set(event.key === 'ArrowLeft' ? -45 : 45);
      }
    }}
    onKeyUp={event => { if (event.key.startsWith('Arrow')) reset(); }}
  >
    <span id={`${id}-instructions`} className={s.srOnly}>Drag sideways or use the left and right arrow keys to roll the horse. Click, Enter, or Space opens and closes its hidden hatch.</span>
    <motion.div className={s.tilt} style={reduced ? undefined : { rotateX: pitch, rotateY: yaw }}>
      <svg className={s.art} viewBox="60 60 480 480" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-timber`} x1=".15" y1="0" x2=".8" y2="1">
            <stop stopColor="var(--horse-light)" /><stop offset=".48" stopColor="var(--horse-mid)" /><stop offset="1" stopColor="var(--horse-edge)" />
          </linearGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--horse-light)" /><stop offset=".5" stopColor="var(--horse-edge)" /><stop offset="1" stopColor="var(--horse-mid)" />
          </linearGradient>
          <pattern id={`${id}-grain`} width="78" height="17" patternUnits="userSpaceOnUse">
            <path d="M0 1H78" stroke="var(--horse-dark)" strokeWidth="1.5" opacity=".65" />
            <path d="M0 3H78" stroke="var(--horse-light)" opacity=".7" />
            <path d="M2 8Q19 5 38 9T78 7M12 13Q38 10 68 13" stroke="var(--horse-dark)" strokeWidth=".65" fill="none" opacity=".27" />
          </pattern>
          <clipPath id={`${id}-body`}><path d={silhouette} /></clipPath>
          <radialGradient id={`${id}-shadow`}><stop stopColor="var(--horse-dark)" stopOpacity=".25" /><stop offset="1" stopColor="var(--horse-dark)" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="285" cy="477" rx="205" ry="25" fill={`url(#${id}-shadow)`} />
        <motion.g style={reduced ? undefined : { x: roll, rotate: lean, originX: .5, originY: 1 }}>
          {/* The far side and connecting faces give the timber model its depth. */}
          <g transform="translate(-24 -16)" fill="var(--horse-dark)">
            <path d="M171 326H199L190 416H161ZM337 323H360L378 416H350Z" />
            <path d={silhouette} stroke="var(--horse-edge)" strokeWidth="2" />
          </g>
          <path d="M144 264 120 248 145 227 169 243 291 251 267 235 288 205 306 153 327 120 351 136 330 169 312 221 291 251 169 243Z" fill={`url(#${id}-rim)`} />
          <path d="M298 194 322 210M306 173 330 189M314 151 338 167M323 134 347 150" stroke="var(--horse-dark)" strokeWidth="1.5" opacity=".5" />
          <path d="M351 136 327 120 325 91 349 107 373 126 369 101 393 117 402 142 455 168 431 152 378 126 369 101 373 126 349 107Z" fill="var(--horse-mid)" />
          <path d="M455 168 431 152 425 178 449 194Z" fill="var(--horse-edge)" />
          {/* Tail, legs and the wooden axle platform. */}
          <path d="M149 265 126 284 111 338 102 359 123 350 142 294 162 284Z" fill={`url(#${id}-timber)`} stroke="var(--horse-dark)" strokeWidth="2" />
          <path d="M137 282 119 337M143 285 126 337" fill="none" stroke="var(--horse-dark)" opacity=".5" />
          <path d="M176 325 207 340 193 414 168 414ZM328 338 357 330 375 414 349 414Z" fill={`url(#${id}-timber)`} stroke="var(--horse-dark)" strokeWidth="2" />
          <path d="M182 348 176 405M346 351 359 406" stroke="var(--horse-light)" strokeWidth="3" opacity=".5" />
          <path d="M140 410 116 394H385L409 410V427H140Z" fill="var(--horse-dark)" />
          <path d="M140 410 116 394H385L409 410Z" fill="var(--horse-light)" />
          <path d="M140 413H409V425H140Z" fill={`url(#${id}-timber)`} />
          {/* Clipped plank courses and joinery stay crisp at every screen size. */}
          <path d={silhouette} fill={`url(#${id}-timber)`} stroke="var(--horse-dark)" strokeWidth="2" strokeLinejoin="round" />
          <path d={silhouette} fill={`url(#${id}-grain)`} />
          <g clipPath={`url(#${id}-body)`}>
            <path d="M171 244 191 351M353 224 370 348" stroke="var(--horse-dark)" strokeWidth="12" opacity=".75" />
            <path d="M169 244 189 351M351 224 368 348" stroke="var(--horse-light)" strokeWidth="2" opacity=".55" />
            {[263, 286, 309, 332].map((y, i) => <g key={y} fill="var(--horse-light)"><circle cx={175 + i * 4.4} cy={y} r="1.9" /><circle cx={358 + i * 2.9} cy={y} r="1.9" /></g>)}
            <path d="M300 251 341 165 356 148M309 255 349 172" fill="none" stroke="var(--horse-dark)" strokeWidth="3" opacity=".5" />
          </g>
          <path d="M374 151 384 154 380 161 372 159Z" fill="var(--horse-dark)" />
          <path d="M429 180 443 184M417 193 441 190" stroke="var(--horse-dark)" strokeWidth="2" />
          <path d="M394 147 384 178 422 197" fill="none" stroke="var(--horse-light)" strokeWidth="3" opacity=".7" />
          {/* A tiny hidden crew, revealed by the lower-hinged hatch. */}
          <path d="M216 278H310V344H216Z" fill="var(--horse-dark)" stroke="var(--horse-edge)" strokeWidth="4" />
          <g fill="var(--horse-mid)" stroke="var(--horse-light)" strokeWidth="1">
            {[235, 263, 291].map((x, i) => <g key={x} transform={`translate(${x} ${i === 1 ? 308 : 313})`}>
              <path d="M-5-7Q-6-17 0-17T6-7Z" /><path d="M-5-6H5L8 13H-8ZM-4 13V25M4 13V25" />
              <ellipse cx="-6" cy="5" rx="6" ry="10" fill="var(--horse-edge)" /><path d="M10 17V-23L8-19M10-23 12-19" fill="none" />
            </g>)}
          </g>
          <motion.g style={{ originX: .5, originY: 1 }} animate={{ scaleY: open ? -.45 : 1, skewX: open ? -12 : 0 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 125, damping: 18 }}>
            <path d="M216 278H310V344H216Z" fill={`url(#${id}-timber)`} stroke="var(--horse-dark)" strokeWidth="2" />
            <path d="M216 278H310V344H216Z" fill={`url(#${id}-grain)`} />
            <path d="M226 284 300 338M226 338 300 284" stroke="var(--horse-dark)" strokeWidth="5" opacity=".65" />
            <path d="M229 284 301 336" stroke="var(--horse-light)" opacity=".65" />
            <path d="M255 285H271" stroke="var(--horse-dark)" strokeWidth="4" strokeLinecap="round" />
          </motion.g>
          <path d="M224 342H239M288 342H303" stroke="var(--horse-light)" strokeWidth="4" />
          <Wheel x={184} rotation={reduced ? 0 : wheel} rim={`url(#${id}-rim)`} />
          <Wheel x={365} rotation={reduced ? 0 : wheel} rim={`url(#${id}-rim)`} />
        </motion.g>
      </svg>
    </motion.div>
  </button>;
}
