import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arjun M | Alternate portfolio',
  description: 'The previous portfolio of Arjun M: developer relations, backend systems, and projects.',
  alternates: { canonical: 'https://arjunships.vercel.app/alternate' },
  robots: { index: false, follow: true },
};

export { default } from './portfolio';
