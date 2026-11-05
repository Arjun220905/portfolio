'use client';

import { useReducer, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pause, RotateCw, RotateCcw, Star } from 'lucide-react';
import { initialPuzzle, isKnightMove, puzzleReducer, squareName, targetSquare } from './knight-puzzle';
import s from './studio.module.css';

const formats = [
  { ratio: 2.39, text: '2.39:1' },
  { ratio: 1.9, text: '1.90:1' },
  { ratio: 1.43, text: '1.43:1' },
];

export function CinemaFrame() {
  const [format, setFormat] = useState(0);
  const current = formats[format];
  const crop = (1 - 1.43 / current.ratio) * 50;
  return <div className={s.filmObject}>
    <button className={s.filmFrame} onClick={() => setFormat(v => (v + 1) % formats.length)} aria-label={`Cinema frame: ${current.text}. Show next format.`}>
      <span className={s.filmScene} style={{ '--crop': `${crop}%` } as CSSProperties}>
        <span className={s.filmSun}/><span className={s.filmMountain}/><span className={s.filmMountainTwo}/><span className={s.filmPerson}/>
      </span>
    </button>
    <fieldset className={s.formatChoices}><legend className={s.srOnly}>Cinema aspect ratio</legend>
      {formats.map((f, i) => <button key={f.text} aria-pressed={format === i} onClick={() => setFormat(i)}>{f.text}</button>)}
    </fieldset>
  </div>;
}

export function CompactDisc() {
  const [playing, setPlaying] = useState(false);
  return <div className={s.cdObject}>
    <div className={s.jewelCase}>
      <div className={s.caseSpine}/>
      <div className={s.discTray}/>
      <div className={s.compactDisc} data-playing={playing} aria-hidden="true"><div className={s.discTracks}/><div className={s.discHub}/></div>
      <span className={s.caseHinge}/><span className={s.caseHinge}/>
      <span className={s.redTape} aria-hidden="true"/>
    </div>
    <button className={s.objectControl} aria-pressed={playing} onClick={() => setPlaying(v => !v)}>
      {playing ? <Pause size={14}/> : <RotateCw size={14}/>} {playing ? 'Pause the disc' : 'Spin the disc'}
    </button>
  </div>;
}

function Knight() {
  return <svg viewBox="0 0 45 45" aria-hidden="true"><path d="M10 36h25v4H9zm3-3c1-8 7-10 13-13l-3-4-8 7-7-3 3-9 8-3 1-6 5 4 5-2c1 6 5 8 5 16v13H13Z" fill="currentColor" stroke="var(--knight-outline)" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="20" cy="12" r="1.5" fill="var(--knight-outline)"/></svg>;
}

export function KnightPuzzle() {
  const [{ position, moves }, dispatch] = useReducer(puzzleReducer, initialPuzzle);
  const reduced = useReducedMotion();
  const reached = position === targetSquare;
  const solved = reached && moves === 3;
  const status = solved ? 'Three moves. Nicely played.' : reached ? `Reached g5 in ${moves}. Can you do it in three?` : `Reach g5 in three knight moves. Moves: ${moves}.`;
  return <div className={s.chessObject}>
    <fieldset className={s.chessBoard}><legend className={s.srOnly}>Knight puzzle. Move from b1 to g5 in three moves.</legend>
      {Array.from({ length: 64 }, (_, i) => {
        const available = !reached && isKnightMove(position, i);
        return <button key={i} className={s.chessSquare} data-dark={(Math.floor(i / 8) + i % 8) % 2 === 1} data-target={i === targetSquare} data-available={available} disabled={!available} aria-label={`${squareName(i)}${i === position ? ', white knight' : i === targetSquare ? ', target' : ''}${available ? ', move knight here' : ''}`} onClick={() => dispatch({ type: 'move', to: i })}>
          {i === targetSquare && <Star className={s.chessTarget} size={16} aria-hidden="true"/>}
          {available && i !== targetSquare && <span className={s.legalMove}/>}
          {i % 8 === 0 && <small className={s.rankLabel}>{8 - Math.floor(i / 8)}</small>}
          {i >= 56 && <small className={s.fileLabel}>{'abcdefgh'[i % 8]}</small>}
        </button>;
      })}
      <motion.div className={s.knight} initial={false} animate={{ x: `${position % 8 * 100}%`, y: `${Math.floor(position / 8) * 100}%` }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 190, damping: 24 }}><Knight/></motion.div>
    </fieldset>
    <output className={s.chessStatus}>{status}</output>
    <button className={s.objectControl} onClick={() => dispatch({ type: 'reset' })}><RotateCcw size={13}/>{solved ? 'One more round?' : 'Reset the board'}</button>
  </div>;
}
