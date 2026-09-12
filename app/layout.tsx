import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JharSetu — From community problems to scalable solutions',
  description: 'SIH 26043 MVP: AI-powered societal innovation and collaboration platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
