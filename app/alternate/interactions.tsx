'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Film, Music2, Puzzle, Plus, Sun, Moon } from 'lucide-react';
import { interests, modes, projects } from './content';
import s from './portfolio.module.css';

const spring = { type: 'spring' as const, bounce: 0.12, duration: 0.55 };

// Intersection state lives on a stable wrapper, not the moving child.
// A zero threshold resets only once the wrapper has fully left the viewport.
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial="rest" whileInView="visible" viewport={{ once: false, amount: 0 }}>
    <motion.div className={s.revealInner} variants={{
      rest: { opacity: 1, transform: reduced ? 'none' : 'translateY(var(--reveal-offset))' },
      visible: { opacity: 1, transform: 'translateY(0px)' },
    }} transition={reduced ? { duration: 0 } : spring}>{children}</motion.div>
  </motion.div>;
}

export function HeroTitle() {
  const reduced = useReducedMotion();
  return <h1 className={s.headline}>
    {['Building things.', 'Making sense of them.'].map((line, index) => <motion.span
      className={index ? s.accentLine : s.titleLine} key={line}
      initial={false} animate={reduced ? undefined : { transform: ['translateY(24px)', 'translateY(0px)'], opacity: [0, 1] }}
      transition={{ duration: 0.8, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}>
      {line.split(' ').map((word) => <motion.span key={word} className={s.word}
        whileHover={reduced ? undefined : { y: -6, rotate: -1.5 }} transition={spring}>{word}{' '}</motion.span>)}
    </motion.span>)}
  </h1>;
}

export function ColorMode() {
  return <button type="button" className={s.themeButton} aria-label="Toggle light and dark mode" onClick={() => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('arjun-portfolio-theme', next); } catch { /* Theme still works without storage. */ }
  }}><Sun className={s.sun} size={19} /><Moon className={s.moon} size={19} /></button>;
}

export function WorkModes() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = modes[active];
  return <div className={s.modes}>
    <div className={s.modeButtons} aria-label="How I tend to work">
      {modes.map((mode, i) => <button type="button" key={mode.label} aria-pressed={active === i} aria-controls="work-mode-detail" onClick={() => setActive(i)}>
        <span className={s.number}>0{i + 1}</span>{mode.label}<ArrowDown size={15} />
      </button>)}
    </div>
    <div className={s.modePanel} id="work-mode-detail" aria-live="polite">
      <AnimatePresence initial={false} mode="wait"><motion.div key={active}
        initial={{ opacity: 0, transform: reduced ? 'none' : 'translateY(12px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.18 }}>
        <h3>{current.title}</h3><p>{current.text}</p><span className={s.modeDetail}>{current.detail}</span>
      </motion.div></AnimatePresence>
    </div>
  </div>;
}

export function ProjectIndex() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = projects[active];
  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % projects.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + projects.length - 1) % projects.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = projects.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  return <div className={s.projectIndex}>
    <div className={s.projectTabs} role="tablist" aria-label="Selected projects" aria-orientation="vertical">
      {projects.map((project, i) => <button type="button" key={project.title} role="tab"
        ref={(element) => { tabs.current[i] = element; }} id={`project-tab-${i}`} aria-controls={`project-panel-${i}`}
        aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={(event) => move(event, i)}>
        <span className={s.number}>0{i + 1}</span><span>{project.title}</span><ArrowUpRight size={19} />
        {active === i && <motion.span className={s.tabMarker} layoutId="selected-project" transition={reduced ? { duration: 0 } : spring} />}
      </button>)}
    </div>
    {projects.map((project, i) => <div key={project.title} role="tabpanel" id={`project-panel-${i}`} aria-labelledby={`project-tab-${i}`} hidden={active !== i} tabIndex={0} className={s.projectPanel}>
      {active === i && <motion.div className={s.projectContent} key={active} initial={false}
        animate={reduced ? undefined : { transform: ['translateY(20px)', 'translateY(0px)'], opacity: [0, 1] }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
        <div className={s.projectTopline}><span>{current.category}</span><span>0{active + 1} / 03</span></div>
        <h3>{current.title}</h3><p>{current.text}</p>
        <div className={s.projectBottom}><span>{current.stack}</span><a href={current.href} target="_blank" rel="noreferrer">View source <ArrowUpRight size={18} /></a></div>
        <div className={s.projectCaption}>{current.signal}</div>
      </motion.div>}
    </div>)}
  </div>;
}

const icons = [Film, Music2, Puzzle];

export function OutsideBuild() {
  const [active, setActive] = useState<number | null>(0);
  const reduced = useReducedMotion();
  return <div className={s.interests}>
    {interests.map((interest, i) => {
      const Icon = icons[i];
      const expanded = active === i;
      return <Reveal key={interest.category}><article className={s.interest} data-expanded={expanded}>
        <h3><button type="button" aria-expanded={expanded} aria-controls={`interest-${i}`} onClick={() => setActive(expanded ? null : i)}>
          <span className={s.interestMeta}>0{i + 1} / {interest.category}</span><span className={s.interestTitle}>{interest.title}</span>
          <motion.span animate={{ rotate: expanded ? 45 : 0 }} transition={reduced ? { duration: 0 } : spring}><Plus size={26} /></motion.span>
        </button></h3>
        <div id={`interest-${i}`} className={s.interestBody} aria-hidden={!expanded} inert={!expanded}>
          <div className={s.interestClip}><div className={s.interestInner}>
            <Icon className={s.interestIcon} size={72} strokeWidth={1} aria-hidden="true" /><p>{interest.text}</p>
          </div></div>
        </div>
      </article></Reveal>;
    })}
  </div>;
}
