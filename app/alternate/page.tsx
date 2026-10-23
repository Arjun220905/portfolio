import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { ArrowDown, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { ColorMode, HeroTitle, MagneticLink, OutsideBuild, ProjectIndex, Reveal, WorkModes, WritingLink } from './interactions';
import { articles } from './content';
import s from './portfolio.module.css';

const geist = Geist({ subsets: ['latin'], variable: '--alternate-font', display: 'swap' });
export const metadata: Metadata = {
  title: 'Arjun M | The workbench',
  description: 'Backend tools, developer experience, and the curiosity behind them. An alternate portfolio by Arjun M.',
  robots: { index: false, follow: true },
};

export default function AlternatePortfolio() {
  return <div className={`${s.page} ${geist.variable}`}>
    <a className={s.skipLink} href="#main-content">Skip to content</a>
    <div className={s.shell}>
      <header className={s.header}>
        <a href="#top" className={s.wordmark}>Arjun M<span>Developer &amp; explainer</span></a>
        <nav className={s.navigation} aria-label="Primary navigation"><a href="#work">Work</a><a href="#sidequests">Side quests</a><a href="#about">About</a><a href="#notes">Notes</a></nav>
        <ColorMode />
      </header>
      <main id="main-content">
        <section id="top" className={s.hero}>
          <div className={s.heroCopy}>
          <p className={s.eyebrow}>DEVELOPER RELATIONS × BACKEND SYSTEMS</p>
          <HeroTitle />
          <div className={s.heroFoot}><p>I build backend tools and explain how to use them, so a good idea can become a working integration.</p>
            <MagneticLink href="#work" className={s.primaryLink}>View selected work <ArrowDown size={18} /></MagneticLink>
          </div>
          </div>
        <div className={s.working} aria-labelledby="working-title">
          <div className={s.workingIntro}><span className={s.sectionTag}>HOW I TEND TO WORK</span><h2 id="working-title">I like working across the technical work and the explanation around it.</h2></div>
          <WorkModes />
        </div>
        </section>
        <section id="work" className={s.section}>
          <Reveal><div className={s.sectionHeading}><span className={s.sectionTag}>SELECTED WORK</span><h2>A few systems I&apos;ve helped make easier to use.</h2><p>Backend work, AI workflows, and the developer experience around them.</p></div></Reveal>
          <ProjectIndex />
          <div className={s.signals}>
            <div><strong>APIs and webhooks</strong><p>Turning moving parts into useful starting points.</p></div>
            <div><strong>Real-time media</strong><p>Meetings, agents, and the moments between them.</p></div>
            <div><strong>Build, write, explain</strong><p>The work and the documentation around it.</p></div>
          </div>
        </section>
        <section id="sidequests" className={`${s.section} ${s.outside}`}>
          <Reveal><div className={s.outsideHeading}><span className={s.sectionTag}>OUTSIDE THE BUILD</span><h2>Movies. Music.<br /><span>Puzzles.</span></h2><p>I like looking for patterns in places that are meant to be fun. It keeps the work fresh and usually gives us something better to talk about.</p></div></Reveal>
          <OutsideBuild />
        </section>
        <section id="about" className={`${s.section} ${s.about}`}>
          <Reveal><h2>Make unfamiliar work easier to start.</h2></Reveal>
          <div className={s.aboutCopy}><p>I&apos;m Arjun, a Computer Science student and Developer Relations &amp; Go-to-Market intern at <a href="https://meetstream.ai" target="_blank" rel="noreferrer">MeetStream</a>.</p>
            <p>I work across backend engineering, developer experience, technical content, and go-to-market. I&apos;m interested in the practical details that help developers move from an API reference to something running.</p>
            <ol className={s.principles}>{['Start with something runnable.', 'Make the next step clear.', 'Let good defaults do some work.'].map((text, i) => <li key={text}><span>0{i + 1}</span>{text}</li>)}</ol>
          </div>
        </section>
        <section id="notes" className={s.section}>
          <Reveal><div className={s.sectionHeading}><span className={s.sectionTag}>NOTES</span><h2>Meeting agents and developer adoption.</h2><p>Writing about APIs, webhooks, real-time media, and the small decisions that help infrastructure feel more approachable.</p></div></Reveal>
          <div className={s.articles}>{articles.map(([title, slug], i) => <Reveal key={slug}><WritingLink href={`https://meetstream.ai/blog/${slug}`}><span className={s.number}>0{i + 1}</span><h3>{title}</h3><ArrowUpRight size={23} /></WritingLink></Reveal>)}</div>
          <a className={s.inlineLink} href="https://meetstream.ai/blog/author/arjun/" target="_blank" rel="noreferrer">View all writing <ArrowUpRight size={18} /></a>
        </section>
      </main>
      <footer className={s.footer}>
        <Reveal><h2>Let&apos;s start a<br /><a href="https://www.linkedin.com/in/arjun-m-39b317290/" target="_blank" rel="noreferrer">conversation.<ArrowUpRight aria-hidden="true" /></a></h2></Reveal>
        <div className={s.footerBottom}><Link href="/" className={s.originalLink}><ArrowLeft size={15} /> Original portfolio</Link><div><a href="https://github.com/Arjun220905" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/in/arjun-m-39b317290/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href="https://x.com/arjunlarps" target="_blank" rel="noreferrer">X <ArrowUpRight size={14} /></a></div><span>© 2026 Arjun M</span></div>
      </footer>
    </div>
  </div>;
}
