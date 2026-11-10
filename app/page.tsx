import type { Metadata } from 'next';
import Studio from './alternate/studio';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.arjunmanivannan.com/' },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <Studio />;
}
