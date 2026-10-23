'use client';

import { useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowRight, Film, Music2, Puzzle, Sun, Moon, Braces, MessageSquare, Sparkles } from 'lucide-react';
import { interests, modes, projects } from './content';
import s from './portfolio.module.css';

const spring = { type: 'spring' as const, bounce: 0.18, duration: 0.7 };
const mobileQuery = '(max-width: 767px)';
function subscribeMobile(notify: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}
const getMobile = () => window.matchMedia(mobileQuery).matches;
const getServerMobile = () => false;

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial="rest" whileInView="visible" viewport={{ once: false, amount: 0 }}>
    <motion.div className={s.revealInner} variants={{
      rest: { transform: reduced ? 'none' : 'translateY(var(--reveal-distance)) rotate(2deg)' },
      visible: { transform: 'translateY(0px) rotate(0deg)' },
    }} transition={reduced ? { duration: 0 } : spring}>{children}</motion.div>
  </motion.div>;
}

export function HeroTitle() {
  const reduced = useReducedMotion();
  return <h1 className={s.headline} aria-label="Building things. Making sense of them.">
    <span className={s.building} aria-hidden="true">{['Building', 'things.'].map((word, i) => <motion.span key={word}
      initial={false} animate={reduced ? undefined : { transform: ['translateY(75px) rotate(6deg)', 'translateY(0px) rotate(0deg)'], opacity: [0, 1] }}
      transition={{ duration: 1, delay: i * 0.16, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduced ? undefined : { x: 14, rotate: -2 }}>{word}{i === 0 ? ' ' : ''}</motion.span>)}</span>
    <motion.span className={s.making} aria-hidden="true" initial={false}
      animate={reduced ? undefined : { transform: ['translateX(-35px)', 'translateX(0px)'], opacity: [0, 1] }}
      transition={{ duration: 0.8, delay: 0.3 }}>Making sense of them.</motion.span>
  </h1>;
}

export function ColorMode() {
  return <button type="button" className={s.themeButton} aria-label="Toggle light and dark mode" onClick={() => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('arjun-portfolio-theme', next); } catch { /* Storage is optional. */ }
  }}><Sun className={s.sun} size={19} /><Moon className={s.moon} size={19} /></button>;
}

const modeIcons = [Braces, MessageSquare, Sparkles];

export function WorkModes() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const mobile = useSyncExternalStore(subscribeMobile, getMobile, getServerMobile);
  const controls = useRef<Array<HTMLButtonElement | null>>([]);
  function nextMode() {
    const next = (active + 1) % modes.length;
    setActive(next);
    controls.current[next]?.focus({ preventScroll: true });
  }
  return <div className={s.modes}>
    <div className={s.cardStack}>
      {modes.map((mode, i) => {
        const depth = (i - active + modes.length) % modes.length;
        const Icon = modeIcons[i];
        return <motion.div key={mode.label} className={s.modeCard} id={`mode-card-${i}`} aria-hidden={depth !== 0} inert={depth !== 0}
          style={{ zIndex: 3 - depth }} initial={false}
          animate={{ transform: reduced ? 'none' : `translate(${(depth === 1 ? 20 : depth === 2 ? -16 : 0) * (mobile ? 0.5 : 1)}px, ${depth * 20}px) rotate(${(depth === 1 ? 7 : depth === 2 ? -7 : -2) * (mobile ? 0.6 : 1)}deg) scale(${1 - depth * 0.035})` }}
          transition={reduced ? { duration: 0 } : spring}>
          <div className={s.cardTop}><span>0{i + 1}</span><Icon size={28} strokeWidth={1.5} /></div>
          <h3>{mode.title}</h3><p>{mode.text}</p>
          <div className={s.cardBottom}><span>{mode.detail}</span><button type="button" aria-label="Next working mode" onClick={nextMode}><ArrowRight size={23} /></button></div>
        </motion.div>;
      })}
    </div>
    <div className={s.modeButtons} aria-label="How I tend to work">
      {modes.map((mode, i) => <button type="button" key={mode.label} ref={(element) => { controls.current[i] = element; }} aria-pressed={active === i} aria-controls={`mode-card-${i}`} onClick={() => setActive(i)}>
        <span>0{i + 1}</span>{mode.label}
      </button>)}
    </div>
  </div>;
}

function ProjectChapter({ index }: { index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const mobile = useSyncExternalStore(subscribeMobile, getMobile, getServerMobile);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.12'] });
  const transform = useTransform(scrollYProgress, [0, 1], mobile
    ? ['translateY(28px)', 'translateY(0px)']
    : ['translateY(80px) scale(0.9) rotate(3deg)', 'translateY(0px) scale(1) rotate(0deg)']);
  const project = projects[index];
  return <article ref={ref} className={s.projectChapter} style={{ '--chapter-top': `${24 + index * 24}px` } as CSSProperties}>
    <motion.div className={s.chapterSurface} style={reduced ? undefined : { transform }}>
      <div className={s.chapterTop}><span>{project.category}</span><span>0{index + 1} / 03</span></div>
      <div className={s.chapterGrid}><h3>{project.title}</h3><p>{project.text}</p></div>
      <div className={s.chapterBottom}><div><span>{project.stack}</span><p>{project.signal}</p></div><a href={project.href} target="_blank" rel="noreferrer">View source <ArrowUpRight size={22} /></a></div>
    </motion.div>
  </article>;
}

export function ProjectIndex() {
  return <div className={s.projectChapters}>{projects.map((project, index) => <ProjectChapter key={project.title} index={index} />)}</div>;
}

const icons = [Film, Music2, Puzzle];

function InterestPoster({ index }: { index: number }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(x, { stiffness: 150, damping: 20 });
  const [turned, setTurned] = useState(false);
  const interest = interests[index];
  const Icon = icons[index];
  function tilt(event: PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * -10);
  }
  return <motion.article className={s.interestPoster} data-poster={index} onPointerMove={tilt} onPointerLeave={() => { x.set(0); y.set(0); }}
    style={reduced ? undefined : { rotateX, rotateY }} initial="rest" whileInView="visible" viewport={{ once: false, amount: 0 }}>
    <motion.div className={s.posterInner} variants={{ rest: { transform: reduced ? 'none' : `translateY(var(--reveal-distance)) rotate(${index % 2 ? 5 : -5}deg)` }, visible: { transform: 'translateY(0px) rotate(0deg)' } }} transition={reduced ? { duration: 0 } : spring}>
      <div className={s.posterTop}><span>0{index + 1} / {interest.category}</span><button type="button" aria-label={`Animate ${interest.category.toLowerCase()} illustration`} aria-pressed={turned} onClick={() => setTurned(!turned)}>
        <motion.span animate={{ rotate: turned && !reduced ? 90 : 0 }} transition={spring}><ArrowUpRight size={23} /></motion.span>
      </button></div>
      <motion.div className={s.posterArt} aria-hidden="true" animate={{ rotate: turned && !reduced ? 360 : 0, scale: turned && !reduced ? 1.12 : 1 }} transition={reduced ? { duration: 0 } : { ...spring, duration: 1.1 }}><Icon strokeWidth={0.8} /></motion.div>
      <div className={s.posterCopy}><h3>{interest.title}</h3><p>{interest.text}</p></div>
    </motion.div>
  </motion.article>;
}

export function OutsideBuild() {
  return <div className={s.interests}>{interests.map((interest, index) => <InterestPoster key={interest.category} index={index} />)}</div>;
}
