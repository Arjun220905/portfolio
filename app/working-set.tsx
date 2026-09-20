"use client";

import { useState } from "react";

const modes = [
  {
    id: "build",
    label: "Build systems",
    index: "01",
    signal: "BUILDING SYSTEMS",
    title: "Build things people can run.",
    text: "Turning meeting APIs, webhooks, and agent workflows into useful starting points for developers.",
    detail: "A preference for practical first steps",
  },
  {
    id: "explain",
    label: "Explain systems",
    index: "02",
    signal: "EXPLAINING SYSTEMS",
    title: "Give the work some context.",
    text: "Writing demos, guides, and notes that make an integration easier to understand and use.",
    detail: "Clarity belongs in the build",
  },
  {
    id: "sidequests",
    label: "Side quests",
    index: "03",
    signal: "FOLLOWING CURIOSITY",
    title: "Keep an extra tab open",
    text: "Movies, music, puzzles, and the urge to figure out how the magic trick works. It keeps the work interesting and gives us something to talk about.",
    detail: "Follow the interesting thread",
  },
];

export function WorkingSet() {
  const [activeId, setActiveId] = useState(modes[0].id);
  const active = modes.find((mode) => mode.id === activeId) ?? modes[0];

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
              <button
                key={mode.id}
                type="button"
                aria-pressed={active.id === mode.id}
                onClick={() => setActiveId(mode.id)}
              >
                <span>{mode.index}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <div
          className="mode-output"
          data-index={active.index}
          key={active.id}
          aria-live="polite"
        >
          <div className="mode-signal">
            <i />
            <span>{active.signal}</span>
          </div>
          <h2 id="working-set-title">{active.title}</h2>
          <p>{active.text}</p>
          <small>{active.detail}</small>
        </div>
      </div>
    </section>
  );
}
