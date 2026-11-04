import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import Studio from './studio';

const manrope = Manrope({ subsets: ['latin'], variable: '--studio-font', display: 'swap' });

export const metadata: Metadata = {
  title: 'Arjun M | Systems in motion',
  description: 'An interactive portfolio of backend systems, developer experiences, and the curiosity behind the work.',
  robots: { index: false, follow: true },
};

export default function AlternatePage() {
  return <Studio fontClass={manrope.variable} />;
}
