import type { Metadata } from 'next';
import { DM_Sans, Outfit, Space_Grotesk } from 'next/font/google';
import Studio from './studio';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm', display: 'swap' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap', preload: false });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: 'Arjun M | Systems in motion',
  description: 'An interactive portfolio of backend systems, developer experiences, and the curiosity behind the work.',
  robots: { index: false, follow: true },
};

export default function AlternatePage() {
  return <Studio fontClass={`${dmSans.variable} ${space.variable} ${outfit.variable}`} />;
}
