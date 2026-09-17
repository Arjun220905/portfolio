import type { Metadata } from 'next';
import './globals.css';
import './subtle.css';

export const metadata: Metadata = { title: 'Arjun M — Developer Relations × Backend Systems', description: 'Arjun M builds practical infrastructure and developer experiences around APIs, AI workflows, and real-time systems.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
