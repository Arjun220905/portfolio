import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import './subtle.css';
import './cinematic.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm', display: 'swap' });

export const metadata: Metadata = { title: 'Arjun M — AI Agent Automation × Backend Systems', description: 'Arjun M is an AI Agent Automation Intern at MeetStream.ai, working across AI agent workflows and backend systems, with a background in developer relations and go-to-market.' };

const themeScript = `try { const saved = localStorage.getItem('arjun-portfolio-theme'); document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light'; } catch { document.documentElement.dataset.theme = 'light'; }`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-theme="light" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body className={`${dmSans.variable} ${dmSans.className}`}>{children}</body></html>; }
