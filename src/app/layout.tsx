import type { ReactNode } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { GOOGLE_ANALYTICS_ID, SITE_METADATA } from '@/constants/seo';

const sansFont = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const serifFont = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

import './globals.css';

/**
 * Metadata for the application.
 */
export const metadata: Metadata = SITE_METADATA;

/**
 * Root layout component for the application.
 *
 * @component
 * @param {{ children: ReactNode }} props - The props for the RootLayout component.
 * @returns {React.JSX.Element} The root layout structure.
 */
const RootLayout = ({ children }: { children: ReactNode }): React.JSX.Element => {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      </head>
      <body className={`${sansFont.variable} ${monoFont.variable} ${serifFont.variable}`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 py-12">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
