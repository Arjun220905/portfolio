import {
  ArrowUpRight,
  Film,
  Music2,
  Puzzle,
  Radio,
  Terminal,
} from "lucide-react";
import { MotionLayer } from "./motion-layer";
import { WorkingSet } from "./working-set";

const projects = [
  {
    number: "01",
    title: "MeetStream Labs",
    eyebrow: "OPEN SOURCE · DEVELOPER EXPERIENCE",
    text: "Runnable examples for building meeting bots and AI agents across Zoom, Google Meet, and Microsoft Teams.",
    stack: "Webhooks · real-time media · Node.js",
    href: "https://github.com/meetstream-ai/labs",
    signal: "Meeting tools and developer resources",
  },
  {
    number: "02",
    title: "MIA Chat Agent",
    eyebrow: "MEETSTREAM · AGENT WORKFLOW",
    text: "A meeting chat agent that listens for a wake phrase, routes a request through a hosted agent, and posts the answer back into the call.",
    stack: "Webhooks · ngrok · Node.js",
    href: "https://github.com/meetstream-ai/labs/tree/main/MIA-chat-agent",
    signal: "A meeting chat assistant",
  },
  {
    number: "03",
    title: "Interview Copilot",
    eyebrow: "PERSONAL BUILD · AI PRODUCT",
    text: "An experiment in turning high-pressure interview moments into useful, context-aware feedback.",
    stack: "TypeScript · AI workflows · product thinking",
    href: "https://github.com/Arjun220905",
    signal: "An interview-feedback experiment",
  },
];

export default function Home() {
  return (
    <main>
      <MotionLayer />
      <div className="scroll-progress" aria-hidden="true" />
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Arjun M home">
          <span>A</span>
          <i>Arjun M</i>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#sidequests">Side quests</a>
          <a href="#about">About</a>
          <a href="#notes">Notes</a>
        </div>
        <a
          className="nav-cta"
          href="https://www.linkedin.com/in/arjun-m-39b317290/"
          target="_blank"
          rel="noreferrer"
        >
          Let&apos;s talk <ArrowUpRight size={15} />
        </a>
      </nav>
      <section id="top" className="hero shell">
        <div className="hero-kicker">
          <span className="pulse" /> DEVELOPER RELATIONS × BACKEND SYSTEMS
        </div>
        <h1>
          Building things.
          <br />
          <em>Making sense of them.</em>
        </h1>
        <div className="hero-bottom">
          <p>
            I build backend tools and explain how to use them, so a good idea
            can become a working integration.
          </p>
          <a className="text-link" href="#work">
            View selected work <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section id="work" className="work section shell">
        <div className="section-label">
          <span>01</span>
          <span>SELECTED WORK</span>
          <span className="line" />
        </div>
        <div className="section-intro">
          <h2>
            A few systems I&apos;ve helped
            <br />
            <em>make easier to use.</em>
          </h2>
          <p>
            Backend work, AI workflows, and the developer experience around
            them.
          </p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" key={project.number}>
              <div className="project-index">{project.number}</div>
              <div className="project-copy">
                <div className="eyebrow">{project.eyebrow}</div>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                <div className="project-meta">
                  <span>{project.stack}</span>
                  <a href={project.href} target="_blank" rel="noreferrer">
                    View source <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
              <div className="project-signal">
                <Radio size={16} />
                <span>{project.signal}</span>
                <div className="signal-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="signal-strip shell" aria-label="What I work across">
        <div>
          <span>01</span>
          <strong>APIs and webhooks</strong>
          <small>Turning moving parts into useful starting points.</small>
        </div>
        <div>
          <span>02</span>
          <strong>Real-time media</strong>
          <small>Meetings, agents, and the moments between them.</small>
        </div>
        <div>
          <span>03</span>
          <strong>Build, write, explain</strong>
          <small>The work and the documentation around it.</small>
        </div>
      </section>
      <WorkingSet />
      <section id="sidequests" className="off-clock">
        <div className="off-clock-inner shell">
          <div className="section-label">
            <span>01.75</span>
            <span>OUTSIDE THE BUILD</span>
            <span className="line" />
          </div>
          <div className="off-clock-head">
            <div>
              <p className="off-clock-kicker">
                THE SAME CURIOSITY, OFF THE CLOCK
              </p>
              <h2>
                Movies. Music.
                <br />
                <em>Puzzles.</em>
              </h2>
            </div>
            <p>
              I like looking for patterns in places that are meant to be fun. It
              keeps the work fresh and usually gives us something better to talk
              about.
            </p>
          </div>
          <div className="off-clock-grid">
            <article className="off-clock-card">
              <Film size={22} aria-hidden="true" />
              <span>01 / FILM</span>
              <h3>Frame by frame.</h3>
              <p>
                Villeneuve could film a parking lot and I&apos;d cry about
                scale.
              </p>
            </article>
            <article className="off-clock-card">
              <Music2 size={22} aria-hidden="true" />
              <span>02 / MUSIC</span>
              <h3>Sound opinions.</h3>
              <p>
                Ranking Kanye albums is basically a personality test at this
                point.
              </p>
            </article>
            <article className="off-clock-card">
              <Puzzle size={22} aria-hidden="true" />
              <span>03 / PUZZLES</span>
              <h3>Happily stuck.</h3>
              <p>
                The pleasure of a hard problem, a wrong turn, and the very
                satisfying click when the pieces line up.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section id="about" className="about section shell">
        <div className="section-label">
          <span>02</span>
          <span>THE THROUGH-LINE</span>
          <span className="line" />
        </div>
        <div className="about-grid">
          <h2>
            Make unfamiliar work
            <br />
            <em>easier to start.</em>
          </h2>
          <div className="about-copy">
            <p>
              I&apos;m Arjun, a Computer Science student and Developer Relations
              &amp; Go-to-Market intern at{" "}
              <a href="https://meetstream.ai" target="_blank" rel="noreferrer">
                MeetStream
              </a>
              .
            </p>
            <p>
              I work across backend engineering, developer experience, technical
              content, and go-to-market. I&apos;m interested in the practical
              details that help developers move from an API reference to
              something running.
            </p>
            <div className="principles">
              <div>
                <span>01</span>
                <strong>Start with something runnable.</strong>
              </div>
              <div>
                <span>02</span>
                <strong>Make the next step clear.</strong>
              </div>
              <div>
                <span>03</span>
                <strong>Let good defaults do some work.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="notes" className="notes section shell">
        <div className="section-label">
          <span>03</span>
          <span>NOTES</span>
          <span className="line" />
        </div>
        <div className="notes-grid">
          <div>
            <div className="now-tag">
              <span className="pulse" /> CURRENTLY EXPLORING
            </div>
            <h2>
              Meeting agents and
              <br />
              <em>developer adoption.</em>
            </h2>
          </div>
          <div className="note-card">
            <Terminal size={17} />
            <p>
              Writing about APIs, webhooks, real-time media, and the small
              decisions that help infrastructure feel more approachable.
            </p>
            <div className="article-links">
              <a
                href="https://meetstream.ai/blog/how-to-build-an-ai-meeting-agent-that-generates-designs-on-command-and-shares-them-in-chat-2/"
                target="_blank"
                rel="noreferrer"
              >
                <span>01</span>AI meeting agents that take action{" "}
                <ArrowUpRight size={14} />
              </a>
              <a
                href="https://meetstream.ai/blog/how-to-build-a-live-meeting-chat-agent/"
                target="_blank"
                rel="noreferrer"
              >
                <span>02</span>Live meeting chat agents{" "}
                <ArrowUpRight size={14} />
              </a>
              <a
                href="https://meetstream.ai/blog/how-to-record-each-participant-separately-in-a-video-call/"
                target="_blank"
                rel="noreferrer"
              >
                <span>03</span>Per-participant recording{" "}
                <ArrowUpRight size={14} />
              </a>
              <a
                href="https://meetstream.ai/blog/how-to-build-a-post-call-transcription-bot-with-meetstream/"
                target="_blank"
                rel="noreferrer"
              >
                <span>04</span>Post-call transcription bots{" "}
                <ArrowUpRight size={14} />
              </a>
            </div>
            <a
              className="text-link"
              href="https://meetstream.ai/blog/author/arjun/"
              target="_blank"
              rel="noreferrer"
            >
              View all writing <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <footer className="footer shell">
        <div>
          <div className="footer-kicker">INTERESTED IN WORKING TOGETHER?</div>
          <h2>
            Let&apos;s start a
            <br />
            <em>conversation.</em>
          </h2>
        </div>
        <div className="footer-right">
          <a
            href="https://www.linkedin.com/in/arjun-m-39b317290/"
            target="_blank"
            rel="noreferrer"
            className="email-link"
          >
            Connect on LinkedIn <ArrowUpRight size={17} />
          </a>
          <div className="socials">
            <a
              href="https://github.com/Arjun220905"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              GH
            </a>
            <a
              href="https://www.linkedin.com/in/arjun-m-39b317290/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              in
            </a>
            <a
              href="https://x.com/arjunnn2209"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              𝕏
            </a>
          </div>
          <small>© 2026 ARJUN M / BUILT WITH INTENT</small>
        </div>
      </footer>
    </main>
  );
}
