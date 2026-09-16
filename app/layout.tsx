import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Arjun M — APIs, Side Quests & Developer Experience', description: 'Arjun M builds practical developer experiences around APIs, AI workflows, and real-time systems.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
