import type { ReactNode } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata } from 'next';
import { EB_Garamond, Geist_Mono, Nunito } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { GOOGLE_ANALYTICS_ID, SITE_METADATA } from '@/constants/seo';

const sansFont = Nunito({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });
const serifFont = EB_Garamond({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--font-serif' });
const monoFont = Geist_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono' });

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
        <script type="application/ld+json">
          {`{
      "@context": "https://schema.org",
      "@type": "WebAPI",
      "name": "Kabir ke Dohe API",
      "description": "RESTful API providing access to 2500+ Kabir couplets with translations and interpretations.",
      "url": "https://kabir-ke-dohe-api.vercel.app",
      "provider": { "@type": "Organization", "name": "Kabir ke Dohe" }
    }`}
        </script>
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
