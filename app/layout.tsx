import type { Metadata } from 'next';
import './globals.css';
import './subtle.css';

export const metadata: Metadata = { title: 'Arjun M — Developer Relations × Backend Systems', description: 'Arjun M builds practical infrastructure and developer experiences around APIs, AI workflows, and real-time systems.' };

const themeScript = `try { const saved = localStorage.getItem('arjun-portfolio-theme'); const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.dataset.theme = theme; } catch {}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}</body></html>; }
