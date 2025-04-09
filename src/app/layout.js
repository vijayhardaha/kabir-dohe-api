import { Kumbh_Sans, Fira_Code } from "next/font/google";
import PropTypes from "prop-types";

import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/constants/seo";

const sansFont = Kumbh_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-sans" });
const monoFont = Fira_Code({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

import "./globals.css";

export const metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  keywords: ["kabir", "dohe", "couplets", "api", "hindi poetry", "spiritual"],
  author: "Vijay Hardaha",
  robots: "index, follow",
  language: "en",
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    type: "website",
    url: SITE_CONFIG.url,
    images: [
      {
        url: "site-thumbnail.png",
        width: 512,
        height: 512,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ["site-thumbnail.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} ${monoFont.variable} font-sans`}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
