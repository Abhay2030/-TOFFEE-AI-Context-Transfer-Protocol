import { Metadata } from 'next';
import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Toffee AI Context Transfer Protocol',
  description: 'Capture, compress, and sync conversations across ChatGPT, Claude, and Gemini with absolute privacy. Never lose AI context again.',
};

export default function Home() {
  return <HomePageClient />;
}
