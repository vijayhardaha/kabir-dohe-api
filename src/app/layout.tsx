import type { ReactNode } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Kumbh_Sans, Fira_Code } from 'next/font/google';

import Footer from '@/components/Footer';
import { IBaseMetadata, baseMetadata } from '@/constants/seo';

const sansFont = Kumbh_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-sans' });
const monoFont = Fira_Code({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });

import './globals.css';

/**
 * Metadata for the application.
 */
export const metadata: IBaseMetadata = baseMetadata;

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
        <GoogleAnalytics gaId="G-GM50Y47GMH" />
      </head>
      <body className={`${sansFont.variable} ${monoFont.variable} font-sans`}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
