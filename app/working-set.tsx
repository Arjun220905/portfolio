'use client';

import { useState } from 'react';

const modes = [
  {
    id: 'build',
    label: 'Build systems',
    index: '01',
    signal: 'SYSTEMS / IN MOTION',
    title: 'Make the complicated runnable.',
    text: 'Turning meeting APIs, webhooks, and agent workflows into things a developer can actually pick up and run.',
    detail: 'THE DEFAULT: SHIP THE USEFUL THING',
  },
  {
    id: 'explain',
    label: 'Explain systems',
    index: '02',
    signal: 'CONTEXT / INCLUDED',
    title: 'Make the useful obvious.',
    text: 'Writing demos, guides, and notes for the moment when an integration finally clicks because it has been made tangible.',
    detail: 'THE DEFAULT: CLARITY IS PART OF THE BUILD',
  },
  {
    id: 'sidequests',
    label: 'Side quests',
    index: '03',
    signal: 'CURIOSITY / UNRESOLVED',
    title: 'Keep an extra tab open.',
    text: 'Movies, music, puzzles, and the chronic urge to figure out how the magic trick works. Good for the work; excellent for conversation.',
    detail: 'THE DEFAULT: FOLLOW THE INTERESTING THREAD',
  },
];

export function WorkingSet() {
  const [activeId, setActiveId] = useState(modes[0].id);
  const active = modes.find((mode) => mode.id === activeId) ?? modes[0];

  return <section className="working-set shell" aria-labelledby="working-set-title">
    <div className="working-set-label"><span>01.5</span><span>A SMALL OPERATING SYSTEM</span><span className="line" /></div>
    <div className="working-set-grid">
      <div className="mode-controls" aria-label="Choose a perspective">
        <p>Not really interested in picking one lane.</p>
        <div className="mode-buttons">
          {modes.map((mode) => <button key={mode.id} type="button" aria-pressed={active.id === mode.id} onClick={() => setActiveId(mode.id)}><span>{mode.index}</span>{mode.label}</button>)}
        </div>
      </div>
      <div className="mode-output" key={active.id} aria-live="polite">
        <div className="mode-signal"><i /><span>{active.signal}</span></div>
        <h2 id="working-set-title">{active.title}</h2>
        <p>{active.text}</p>
        <small>{active.detail}</small>
      </div>
    </div>
  </section>;
}
