import { CREATOR, type CreatorConfig } from '@vijayhardaha/schema-builder';
import type { Metadata } from 'next';

/**
 * Site-wide configuration values for SEO and metadata.
 */
export const SITE_CONFIG = {
  name: 'Kabir Dohe API',
  title: 'Kabir Dohe API',
  url: 'https://kabirdoheapi.vercel.app',
  description:
    'Access over 2500 timeless dohas (couplets) by Sant Kabir through our powerful, fast, and free RESTful API. Perfect for developers, spiritual seekers, educators, and Hindi literature enthusiasts looking to integrate authentic Indian poetry, spiritual wisdom, and philosophical teachings into websites, apps, and AI-powered tools.',
  category: 'Technology',
  classification: 'REST API, Public API, Literature API, Hindi Poetry API, Spiritual API',
  creator: CREATOR as CreatorConfig,
  organization: {
    name: 'Kabir Dohe Hub',
    description:
      'Kabir Dohe Hub is a digital platform offering curated collections of Kabir ke dohe, along with tools and APIs to make this knowledge easily accessible.',
    url: 'https://kabirdohehub.vercel.app',
    sameAs: [
      'https://kabirdohehub.vercel.app',
      'https://kabirdoheapi.vercel.app',
      'https://kabirdoheimages.vercel.app',
    ],
    foundingDate: 2024,
  },
};

/**
 * The default metadata object used for SEO, Open Graph, and Twitter cards.
 */
export const SEO_KEYWORDS = [
  'Kabir Dohe API',
  'Kabir couplets API',
  'Sant Kabir dohas API',
  'Spiritual poetry API',
  'Indian poetry API',
  'Hindi couplets API',
  'Kabir dohe translations',
  'Kabir couplets JSON API',
  'Free spiritual quotes API',
  'Kabir API for developers',
  "Access Kabir's dohas programmatically",
  "RESTful API for Kabir's poetry",
  'Integrate Kabir couplets into apps',
  'API for Indian spiritual wisdom',
  'Daily Kabir doha quotes API',
  "Kabir's teachings API for education",
  'Kabir doha translations in English and Hindi',
  'Spiritual chatbot API with Kabir dohas',
  'Open-source Kabir couplets API',
  'Indian philosophy API for developers',
  'Free API for religious couplets',
  "Kabir's couplets for social media bots",
  'Sant Kabir spiritual poetry',
  'Indian spiritual literature API',
  "Kabir's wisdom API",
  'Philosophical couplets API',
  'API for devotional poetry',
  'Kabir quotes API',
  'Kabir doha content API',
];

/**
 * Google Search Console verification code for the site
 */
export const GOOGLE_SITE_VERIFICATION = '4CyrCxZi9TWgvS-GzB1QUhgEl0bKoIzT36368e_vlx0';

/**
 * Google Analytics measurement ID for site traffic tracking.
 */
export const GOOGLE_ANALYTICS_ID = 'G-GM50Y47GMH';

/**
 * Title and description used for SEO, Open Graph, and Twitter cards.
 */
const titleAndDescription = { title: SITE_CONFIG.title, description: SITE_CONFIG.description };

/**
 * Default image metadata used for Open Graph and Twitter cards.
 */
const seoImage = {
  url: '/preview.png',
  secureUrl: `/preview.png`,
  alt: 'Kabir Dohe API service banner',
  width: 1200,
  height: 630,
  type: 'image/png',
};

/**
 * Canonical URL for the website, used in SEO and Open Graph metadata.
 */
const siteURL = new URL(SITE_CONFIG.url);

/**
 * The main metadata object containing all SEO-related information for the website.
 */
export const SITE_METADATA: Metadata = {
  ...titleAndDescription,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_CONFIG.name,
  metadataBase: siteURL,
  authors: [{ name: SITE_CONFIG.creator.name, url: SITE_CONFIG.creator.urls.gravatar }],
  creator: SITE_CONFIG.creator.name,
  publisher: SITE_CONFIG.organization.name,
  robots: { index: true, follow: true },
  category: SITE_CONFIG.category,
  classification: SITE_CONFIG.classification,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification: { google: GOOGLE_SITE_VERIFICATION },
  openGraph: {
    ...titleAndDescription,
    images: seoImage,
    type: 'website',
    siteName: SITE_CONFIG.organization.name,
    locale: 'en_US',
    url: siteURL,
  },
  twitter: {
    ...titleAndDescription,
    card: 'summary_large_image',
    images: seoImage,
    creator: SITE_CONFIG.creator.handles[0],
  },
};
