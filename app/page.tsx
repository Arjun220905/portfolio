import type { Metadata } from 'next';
import Studio from './alternate/studio';

export const metadata: Metadata = {
  alternates: { canonical: 'https://arjunships.vercel.app/' },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <Studio />;
}
