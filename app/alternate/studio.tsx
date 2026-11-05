'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { motion, MotionConfig, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { ArrowDown, ArrowUpRight, ArrowUp, Plus, X, Sun, Moon, RotateCcw, Braces, AudioLines, GitBranch, MessageSquare, Radio, Check } from 'lucide-react';
import { projects, interests } from './content';
import { CinemaFrame, CompactDisc, KnightPuzzle } from './studio-interests';
import { studioArticles } from './studio-writing';
import s from './studio.module.css';

const ease = [.22, 1, .36, 1] as const;
const links = [['Work', '#studio-work'], ['About', '#studio-about'], ['Off duty', '#studio-outside'], ['Writing', '#studio-writing']];
const social = [['GitHub', 'https://github.com/Arjun220905'], ['LinkedIn', 'https://www.linkedin.com/in/arjun-manivannan/'], ['X', 'https://x.com/arjunlarps']];

function Entrance({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 1, transform: 'translateY(45px)' }} whileInView={{ opacity: 1, transform: 'translateY(0px)' }} viewport={{ once: false, amount: .12 }} transition={{ duration: reduced ? 0 : .8, ease }}>{children}</motion.div>;
}

function Navigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [menu, setMenu] = useState(false);
  const close = () => { dialog.current?.close(); setMenu(false); };
  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menu]);
  return <>
    <header className={s.header}>
      <a href="#studio-top" className={s.wordmark}>Arjun M<span>Developer & explainer</span></a>
      <nav aria-label="Alternate portfolio navigation" className={s.desktopNav}>{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
      <div className={s.navActions}><button className={s.round} aria-label="Toggle light and dark mode" onClick={() => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try { localStorage.setItem('arjun-portfolio-theme', t); } catch {} }}><Sun className={s.sun} size={18} /><Moon className={s.moon} size={18} /></button><button className={s.menuButton} aria-haspopup="dialog" aria-expanded={menu} onClick={() => { dialog.current?.showModal(); setMenu(true); }}>Index <Plus size={18} /></button></div>
    </header>
    <dialog ref={dialog} className={s.menu} onCancel={() => setMenu(false)} onClose={() => setMenu(false)} aria-label="Portfolio index">
      <div className={s.menuTop}><span>Arjun M / Index</span><button className={s.round} onClick={close} aria-label="Close navigation"><X /></button></div>
      <nav>{links.map(([label, href], i) => <a href={href} onClick={close} key={label}><span>0{i + 1}</span>{label}<ArrowUpRight /></a>)}</nav>
      <div className={s.menuBottom}><Link href="/">Current portfolio <ArrowUpRight size={16} /></Link><span>Backend systems. Human explanations.</span></div>
    </dialog>
  </>;
}

function SignalSculpture() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const rx = useSpring(y, { stiffness: 100, damping: 24 });
  const ry = useSpring(x, { stiffness: 100, damping: 24 });
  const [turns, setTurns] = useState(0);
  return <button className={s.sculpture} aria-label="Rotate the signal sculpture" onClick={() => setTurns(v => v + 1)} onPointerMove={e => { if (reduced || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) / 18); y.set(-(e.clientY - r.top - r.height / 2) / 18); }} onPointerLeave={() => { x.set(0); y.set(0); }}>
    <motion.div className={s.sculptureTilt} style={reduced ? undefined : { rotateX: rx, rotateY: ry }}>
      <motion.svg viewBox="0 0 600 600" aria-hidden="true" animate={{ rotate: reduced ? 0 : turns * 90 }} transition={{ type: 'spring', stiffness: 45, damping: 16 }}>
        <defs><linearGradient id="studio-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eef4fc"/><stop offset=".24" stopColor="#8196b2"/><stop offset=".46" stopColor="#dae6f4"/><stop offset=".66" stopColor="#354c6a"/><stop offset=".85" stopColor="#9fb5d1"/><stop offset="1" stopColor="#f2f7ff"/></linearGradient></defs>
        <g transform="translate(300 300) rotate(-32)">{Array.from({ length: 25 }, (_, i) => <ellipse key={i} cx="0" cy={(i - 12) * 6} rx={155 + Math.sin(i / 24 * Math.PI) * 35} ry={66 + Math.sin(i / 24 * Math.PI) * 15} fill="none" stroke="url(#studio-metal)" strokeWidth="9" />)}</g>
        <circle cx="300" cy="300" r="257" fill="none" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 9" opacity=".3"/>
        <path d="M300 29v22M300 549v22M29 300h22M549 300h22" stroke="currentColor" opacity=".4" />
      </motion.svg>
    </motion.div>
  </button>;
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 130]);
  return <section ref={ref} id="studio-top" className={s.hero}>
    <div className={s.heroOverline}><span><span className={s.statusDot} /> Developer relations × backend systems</span><span>A portfolio in motion / 2026</span></div>
    <div className={s.heroStage}>
      <motion.div className={s.heroStatement} initial={{ opacity: 0, transform: 'translateY(24px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: .9, ease }}><h1>Building things.<br/>Making sense<br/>of them.</h1><a className={s.textLink} href="#studio-work">Explore the work <ArrowDown size={18}/></a></motion.div>
      <motion.div className={s.sculptureWrap} style={reduced ? undefined : { y }}><SignalSculpture /></motion.div>
      <div className={s.heroAside}><span className={s.smallLabel}>A little context</span><p>I build backend tools and explain how to use them, so a good idea can become a working integration.</p><a href="https://www.linkedin.com/in/arjun-manivannan/" target="_blank" rel="noreferrer" className={s.circleLink} aria-label="Connect with Arjun on LinkedIn"><ArrowUpRight /></a></div>
    </div>
    <div className={s.heroBottom}><span>Systems that work. Stories that make sense.</span><a href="#studio-work">Scroll to explore <ArrowDown size={14} /></a></div>
  </section>;
}

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [index / total * .8, index / total * .8 + .2], [.6, 1]);
  const reduced = useReducedMotion();
  return <motion.span aria-hidden="true" style={{ opacity: reduced ? 1 : opacity }}>{word} </motion.span>;
}

function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const text = 'I like working across the technical work and the explanation around it.';
  const words = text.split(' ');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .85', 'end .7'] });
  return <section className={s.manifesto} ref={ref}><div className={s.sectionMarker}><span className={s.marker}/><span>The through line</span></div><p><span className={s.srOnly}>{text}</span>{words.map((word, i) => <Word key={i} word={word} index={i} total={words.length} progress={scrollYProgress} />)}</p><div className={s.manifestoFoot}><span>Build systems</span><Plus size={18}/><span>Explain systems</span><Plus size={18}/><span>Follow curiosity</span></div></section>;
}

function ProjectStudy({ index }: { index: number }) {
  const [active, setActive] = useState(0);
  if (index === 0) return <div className={s.captionStudy}><div className={s.studyBar}><span><Radio size={13}/> Meeting → meaning</span><AudioLines size={18}/></div><div className={s.waveform} aria-hidden="true">{Array.from({ length: 35 }, (_, i) => <i key={i} style={{ '--bar': `${18 + ((i * 37) % 67)}%`, '--delay': `${i * .025}s` } as CSSProperties}/>)}</div><div className={s.captionBubble}><small>Speaker 01</small><p>{['Good ideas deserve to be understood.', 'Les bonnes idées méritent d’être comprises.', 'Las buenas ideas merecen ser entendidas.'][active]}</p></div><div className={s.languageButtons}>{['English', 'Français', 'Español'].map((v, i) => <button key={v} aria-pressed={active === i} onClick={() => setActive(i)}>{v}</button>)}</div><span className={s.studyNote}>Illustrative caption · switch the language</span></div>;
  if (index === 1) return <div className={s.adapterStudy}><div className={s.frameworks}>{['OpenAI', 'Google ADK', 'CrewAI', 'LangGraph'].map((v, i) => <button key={v} aria-pressed={active === i} onClick={() => setActive(i)}>{v}</button>)}</div><svg viewBox="0 0 400 140" aria-hidden="true">{[50, 150, 250, 350].map((x, i) => <path key={x} d={`M${x} 0 V40 Q${x} 65 200 65 V140`} className={active === i ? s.activePath : ''}/>)}</svg><div className={s.adapterCore}><GitBranch size={36}/><span>One contract.</span></div><div className={s.adapterOutput}><span/> MIA / shared tools / streaming</div><span className={s.studyNote}>Architecture study · select a runtime</span></div>;
  if (index === 2) return <div className={s.labsStudy}><div className={s.labWindow}><div className={s.studyBar}><span><Braces size={16}/> MeetStream Labs</span><span>↗</span></div>{['Join a meeting', 'Receive a webhook', 'Stream the transcript'].map((v, i) => <div key={v} className={s.labLine}><span>0{i+1}</span><p>{v}</p><Check size={17}/></div>)}<div className={s.platforms}><span>Zoom</span><span>Google Meet</span><span>Teams</span></div></div><div className={s.floatingTag}>Clone. Configure. Run.</div><span className={s.studyNote}>Integration flow · visual study</span></div>;
  if (index === 3) return <div className={s.chatStudy}><div className={s.agentOrb}><AudioLines size={52}/></div><div className={s.chatBubble}>Hey assistant, what are the action items?</div><div className={s.chatAnswer}><MessageSquare size={18}/><span>Hear the request.<br/>Return the answer to the room.</span></div><span className={s.studyNote}>Hosted agent workflow · visual study</span></div>;
  return <div className={s.replayStudy}><div className={s.studyBar}><span>Interview / replay</span><RotateCcw size={16}/></div><div className={s.timeline}><div/><div/><div/><div/></div><div className={s.replayCursor}/><div className={s.replayCaption}><small>Review the conversation</small><p>Notice the patterns.<br/>Make the next answer clearer.</p></div><span className={s.studyNote}>Session replay · visual study</span></div>;
}

function Project({ index }: { index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [45, -45]);
  const rotate = useTransform(scrollYProgress, [0, .5, 1], [2, 0, -2]);
  const p = projects[index];
  return <motion.article initial={reduced ? false : { opacity: 1, transform: 'translateY(55px)' }} whileInView={{ opacity: 1, transform: 'translateY(0px)' }} viewport={{ once: false, amount: .15 }} transition={{ duration: .85, ease }} ref={ref} className={s.project} id={`studio-project-${index}`}><div className={s.projectCopy}><span className={s.projectCategory}>{index === 0 ? 'MeetStream / multilingual accessibility' : index === 1 ? 'MeetStream / agent infrastructure' : p.category.toLowerCase()}</span><h3>{p.title}</h3><p>{p.text}</p><span className={s.projectStack}>{p.stack}</span><a className={s.projectLink} href={p.href} target="_blank" rel="noreferrer">{p.linkLabel || 'View source'}<ArrowUpRight size={20}/></a><span className={s.projectSignal}>{p.signal}</span></div><div className={s.projectVisual} data-study={index}><span className={s.visualIndex}>0{index+1} / 05</span><motion.div className={s.studyMotion} style={reduced ? undefined : { y, rotate }}><ProjectStudy index={index}/></motion.div></div></motion.article>;
}

function OffDuty() {
  return <section id="studio-outside" className={s.outside}>
    <div className={s.sectionMarker}><span className={s.marker}/><span>Outside the build</span></div>
    <div className={s.outsideTitle}><h2>Always another<br/>rabbit hole.</h2><p>Movies, music, puzzles, and the urge to figure out how the magic trick works.</p></div>
    <div className={s.objects}>{interests.map((item, i) => <article key={item.title} className={s.object}>
      <div className={s.objectStage}>{i === 0 ? <CinemaFrame/> : i === 1 ? <CompactDisc/> : <KnightPuzzle/>}</div>
      <div className={s.objectCopy}><span>{item.category.toLowerCase()}</span><h3>{item.title}</h3><p>{item.text}</p></div>
    </article>)}</div>
  </section>;
}

function Writing() {
  return <section id="studio-writing" className={s.writing}>
    <div className={s.writingIntro}>
      <div className={s.sectionMarker}><span className={s.marker}/><span>Field notes</span></div>
      <h2>Give the work<br/>some context.</h2>
      <p>Writing demos, guides, and notes that make an integration easier to understand and use.</p>
      <a className={s.textLink} href="https://meetstream.ai/blog/author/arjun/" target="_blank" rel="noreferrer">All writing <ArrowUpRight size={18}/></a>
    </div>
    <div className={s.writingList}>{studioArticles.map(({ title, slug, topic, date }, i) => <a href={`https://meetstream.ai/blog/${slug}`} target="_blank" rel="noreferrer" key={slug}>
      <span className={s.articleNumber}>0{i+1}</span><div><small>{topic}{date && ` / ${date}`}</small><h3>{title}</h3></div><ArrowUpRight/>
    </a>)}</div>
  </section>;
}

const typefaces = [
  { id: 'dm', label: 'DM Sans', note: 'Clear & composed' },
  { id: 'space', label: 'Space Grotesk', note: 'Technical & expressive' },
  { id: 'outfit', label: 'Outfit', note: 'Soft & geometric' },
];

function subscribeToQuery(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('studio-font-change', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('studio-font-change', callback);
  };
}
const readQuery = () => window.location.search;
const serverQuery = () => '';

export default function Studio({ fontClass }: { fontClass: string }) {
  const query = useSyncExternalStore(subscribeToQuery, readQuery, serverQuery);
  const params = new URLSearchParams(query);
  const selected = params.get('type');
  const typeface = typefaces.some(font => font.id === selected) ? selected! : 'dm';
  const fontReview = params.get('fonts') === '1';
  const chooseTypeface = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('type', id);
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new Event('studio-font-change'));
  };
  const closeReview = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('fonts');
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new Event('studio-font-change'));
  };
  return <MotionConfig reducedMotion="user"><div className={`${s.page} ${fontClass}`} data-typeface={typeface}><a href="#studio-main" className={s.skip}>Skip to content</a><Navigation/><main id="studio-main"><Hero/><Manifesto/><section id="studio-work" className={s.work}><div className={s.workHeading}><div className={s.sectionMarker}><span className={s.marker}/><span>Selected work / five projects</span></div><h2>Built to be<br/><span>used.</span><ArrowDown aria-hidden="true"/></h2><p>Backend work, AI workflows, and the developer experience around them.</p></div>{projects.map((p, index) => <Project key={p.title} index={index}/>)}</section><section id="studio-about" className={s.about}><div className={s.sectionMarker}><span className={s.marker}/><span>The person behind the work</span></div><Entrance><h2>Make unfamiliar<br/>work easier<br/>to start.</h2></Entrance><div className={s.aboutBody}><p>I&apos;m Arjun, a Computer Science student and Developer Relations &amp; Go-to-Market intern at <a href="https://meetstream.ai" target="_blank" rel="noreferrer">MeetStream</a>.</p><p>I work across backend engineering, developer experience, technical content, and go-to-market. I&apos;m interested in the practical details that help developers move from an API reference to something running.</p><div className={s.principles}>{['Start with something runnable.', 'Make the next step clear.', 'Let good defaults do some work.'].map(v => <div key={v}><ArrowUpRight size={18}/>{v}</div>)}</div></div></section><OffDuty/><Writing/></main><footer className={s.footer}><div className={s.footerTop}><span>Have something interesting in mind?</span><a href="#studio-top">Back to top <ArrowUp size={16}/></a></div><a className={s.footerHeadline} href="https://www.linkedin.com/in/arjun-manivannan/" target="_blank" rel="noreferrer"><span>Let&apos;s talk.</span><ArrowUpRight/></a><div className={s.footerBottom}><span>Arjun M / Building & explaining</span><div>{social.map(([name, href]) => <a href={href} key={name} target="_blank" rel="noreferrer">{name}<ArrowUpRight size={14}/></a>)}</div><Link href="/">Current portfolio <ArrowUpRight size={14}/></Link><span>© 2026</span></div></footer>{fontReview && <aside className={s.fontReview} aria-label="Compare typefaces"><div className={s.fontReviewLabel}>Typeface study<span>Try these across the page</span></div><div className={s.fontChoices}>{typefaces.map(font => <button key={font.id} data-font={font.id} aria-pressed={typeface === font.id} onClick={() => chooseTypeface(font.id)}><strong>{font.label}</strong><span>{font.note}</span></button>)}</div><button className={s.round} onClick={closeReview} aria-label="Close font comparison"><X size={17}/></button></aside>}</div></MotionConfig>;
}
