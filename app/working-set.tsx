'use client';

import { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'motion/react';

const modes = [
  {
    id: 'build',
    label: 'Build systems',
    index: '01',
    signal: 'BUILDING SYSTEMS',
    title: 'Build things people can run.',
    text: 'Turning meeting APIs, webhooks, and agent workflows into useful starting points for developers.',
    detail: 'A preference for practical first steps',
  },
  {
    id: 'explain',
    label: 'Explain systems',
    index: '02',
    signal: 'EXPLAINING SYSTEMS',
    title: 'Give the work some context.',
    text: 'Writing demos, guides, and notes that make an integration easier to understand and use.',
    detail: 'Clarity belongs in the build',
  },
  {
    id: 'sidequests',
    label: 'Side quests',
    index: '03',
    signal: 'FOLLOWING CURIOSITY',
    title: 'Keep an extra tab open',
    text: 'Movies, music, puzzles, and the urge to figure out how the magic trick works. It keeps the work interesting and gives us something to talk about.',
    detail: 'Follow the interesting thread',
  },
];

const outputContent: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delayChildren: 0.08, staggerChildren: 0.055 },
  },
};

const outputItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function WorkingSet() {
  const [activeId, setActiveId] = useState(modes[0].id);
  const active = modes.find((mode) => mode.id === activeId) ?? modes[0];
  const reduceMotion = useReducedMotion();

  return (
    <section className="working-set shell" aria-labelledby="working-set-title">
      <div className="working-set-label">
        <span>01.5</span>
        <span>HOW I TEND TO WORK</span>
        <span className="line" />
      </div>
      <div className="working-set-grid">
        <div className="mode-controls" aria-label="Choose a perspective">
          <p>
            I like working across the technical work and the explanation around
            it.
          </p>
          <div className="mode-buttons">
            {modes.map((mode) => (
              <motion.button
                key={mode.id}
                type="button"
                aria-pressed={active.id === mode.id}
                onClick={() => setActiveId(mode.id)}
                whileHover={reduceMotion ? undefined : { x: 4 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              >
                {active.id === mode.id && (
                  <motion.i
                    className="mode-highlight"
                    layoutId="selected-work-mode"
                    aria-hidden="true"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 380, damping: 36 }
                    }
                  />
                )}
                <span>{mode.index}</span>
                {mode.label}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="mode-output"
            data-mode={active.id}
            key={active.id}
            aria-live="polite"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 18, scale: 0.985 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.99 }
            }
            transition={{
              duration: reduceMotion ? 0.18 : 0.36,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.div
              className="mode-output-content"
              variants={reduceMotion ? undefined : outputContent}
              initial={reduceMotion ? false : 'hidden'}
              animate={reduceMotion ? undefined : 'visible'}
            >
              <motion.div
                className="mode-signal"
                variants={reduceMotion ? undefined : outputItem}
              >
                <i />
                <span>{active.signal}</span>
              </motion.div>
              <motion.h2
                id="working-set-title"
                variants={reduceMotion ? undefined : outputItem}
              >
                {active.title}
              </motion.h2>
              <motion.p variants={reduceMotion ? undefined : outputItem}>
                {active.text}
              </motion.p>
              <motion.small variants={reduceMotion ? undefined : outputItem}>
                {active.detail}
              </motion.small>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
