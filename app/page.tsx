import { ArrowDownRight, ArrowUpRight, Clapperboard, Headphones, Radio, Sparkles } from 'lucide-react';

const projects = [
  {
    tag: 'OPEN SOURCE / DEV EXPERIENCE',
    number: '01',
    title: 'MeetStream Labs',
    description: 'Runnable examples for building meeting bots and AI agents across Zoom, Google Meet, and Microsoft Teams. Less “read the docs”, more “it works on my machine.”',
    stack: 'Webhooks · real-time media · Node.js',
    href: 'https://github.com/Arjun220905',
  },
  {
    tag: 'MEETSTREAM / AGENT WORKFLOW',
    number: '02',
    title: 'MIA Chat Agent',
    description: 'A meeting agent that hears a wake phrase, routes a request to an agent, then posts the useful bit back into the call. Meetings, but with a second brain.',
    stack: 'Webhooks · ngrok · Node.js',
    href: 'https://meetstream.ai/blog/how-to-build-a-live-meeting-chat-agent/',
  },
  {
    tag: 'PERSONAL BUILD / AI PRODUCT',
    number: '03',
    title: 'Interview Copilot',
    description: 'An experiment in turning stressful interview moments into context-aware feedback — because “just be confident” is not a feature.',
    stack: 'TypeScript · AI workflows · product thinking',
    href: 'https://github.com/Arjun220905',
  },
];

const notes = [
  ['How to build a live meeting chat agent', 'https://meetstream.ai/blog/how-to-build-a-live-meeting-chat-agent/'],
  ['AI meeting agents that generate and share designs', 'https://meetstream.ai/blog/how-to-build-an-ai-meeting-agent-that-generates-designs-on-command-and-shares-them-in-chat-2/'],
  ['Record each participant separately in a video call', 'https://meetstream.ai/blog/how-to-record-each-participant-separately-in-a-video-call/'],
  ['Build a post-call transcription bot', 'https://meetstream.ai/blog/how-to-build-a-post-call-transcription-bot-with-meetstream/'],
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Arjun M home"><b>AM</b><span>arjun m.</span></a>
        <div className="nav-links"><a href="#work">work</a><a href="#about">about</a><a href="#notes">notes</a></div>
        <a className="nav-cta" href="https://www.linkedin.com/in/arjun-m-39b317290/" target="_blank" rel="noreferrer">Say hello <ArrowUpRight size={15} /></a>
      </nav>

      <section id="top" className="hero">
        <img className="hero-art" src="/hero-signal.png" alt="Abstract visual of meeting signals becoming an idea in a dark studio" />
        <div className="hero-overlay" />
        <div className="shell hero-content">
          <div className="status"><span /> available for interesting problems</div>
          <p className="eyebrow">DEVELOPER RELATIONS · BACKEND · GTM</p>
          <h1>I make APIs feel<br /><em>less like a boss fight.</em></h1>
          <div className="hero-foot">
            <p>Arjun M is a developer relations &amp; GTM intern building the path from <strong>“interesting API”</strong> to <strong>“actually shipped.”</strong></p>
            <a className="round-link" href="#work" aria-label="See selected work"><ArrowDownRight size={28} /></a>
          </div>
        </div>
        <div className="timecode">REEL 01 · 2026</div>
      </section>

      <section id="work" className="section shell work">
        <div className="section-label"><span>01 / SELECTED SCENES</span><i /></div>
        <div className="section-heading"><h2>Systems with a<br /><em>human instruction manual.</em></h2><p>I like backend work best when someone else can pick it up and run with it.</p></div>
        <div className="project-grid">
          {projects.map((project) => <article className="project-card" key={project.number}>
            <div className="project-top"><span>{project.tag}</span><b>{project.number}</b></div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-bottom"><span>{project.stack}</span><a href={project.href} target="_blank" rel="noreferrer">Open project <ArrowUpRight size={15} /></a></div>
          </article>)}
        </div>
      </section>

      <section id="about" className="about">
        <div className="shell about-grid">
          <div className="about-mark"><Sparkles size={28} /><span>THE<br />THROUGH<br />LINE</span></div>
          <div><p className="eyebrow">THE HUMAN BEHIND THE TABS</p><h2>Curious enough to<br /><em>go down the rabbit hole.</em></h2></div>
          <div className="about-copy">
            <p>I&apos;m a Computer Science student at Sri Krishna College of Engineering and Technology, currently doing Developer Relations &amp; Go-to-Market at <a href="https://meetstream.ai" target="_blank" rel="noreferrer">MeetStream</a>.</p>
            <p>I work across APIs, webhooks, Dockerized backends, real-time audio/video, and the developer experience around them. The fun part is translating the complicated bit without flattening it.</p>
            <div className="truths"><span><b>01</b> Runnable beats theoretical.</span><span><b>02</b> Clarity is a product feature.</span><span><b>03</b> Good defaults earn trust.</span></div>
          </div>
        </div>
      </section>

      <section className="offscreen shell">
        <div className="offscreen-copy"><p className="eyebrow">OFF-SCREEN, STILL ON-BRAND</p><h2>Movies. Music.<br /><em>Useful side quests.</em></h2><p>When I&apos;m not untangling a webhook, I&apos;m usually somewhere between a good film, a better playlist, and a new thing that looked too interesting to ignore.</p></div>
        <div className="playlist-card"><div className="playlist-head"><Headphones size={19} /><span>NOW PLAYING</span><Radio size={15} /></div><div className="equalizer" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} />)}</div><p>building things with<br />a little more character</p><small>genre: ambitious side quest</small></div>
        <div className="film-card"><Clapperboard size={24} /><p>Favourite genre?</p><strong>“The project started as a weekend experiment.”</strong><small>usually a lie, always worth it.</small></div>
      </section>

      <section id="notes" className="section notes shell">
        <div className="section-label"><span>02 / FIELD NOTES</span><i /></div>
        <div className="notes-layout"><div><p className="eyebrow">WRITING AT MEETSTREAM</p><h2>I write the<br /><em>missing middle.</em></h2><p className="notes-intro">Practical guides for the moment after an API reference and before a real product exists.</p><a className="plain-link" href="https://meetstream.ai/blog/author/arjun/" target="_blank" rel="noreferrer">All articles <ArrowUpRight size={16} /></a></div><div className="note-list">{notes.map(([title, href], index) => <a href={href} target="_blank" rel="noreferrer" key={href}><span>0{index + 1}</span><strong>{title}</strong><ArrowUpRight size={18} /></a>)}</div></div>
      </section>

      <footer className="footer">
        <div className="shell footer-grid"><div><p className="eyebrow">CUT TO: THE NEXT THING</p><h2>Got a good<br /><em>problem?</em></h2></div><div className="footer-right"><p>Let&apos;s make it understandable, useful, and a little less boring.</p><a className="footer-cta" href="https://www.linkedin.com/in/arjun-m-39b317290/" target="_blank" rel="noreferrer">Find me on LinkedIn <ArrowUpRight size={18} /></a><div className="socials"><a href="https://github.com/Arjun220905" target="_blank" rel="noreferrer">↗ GitHub</a><a href="https://www.linkedin.com/in/arjun-m-39b317290/" target="_blank" rel="noreferrer">↗ LinkedIn</a></div></div></div>
        <div className="shell credits"><span>© 2026 ARJUN M</span><span>MADE WITH INTENT, NOT A TEMPLATE</span></div>
      </footer>
    </main>
  );
}
