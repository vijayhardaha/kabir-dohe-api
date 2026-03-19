import type { Metadata } from 'next';

import { getCanonicalUrl } from '@/lib/utils/seo';

/**
 * Site-wide configuration values for SEO and metadata.
 */
export const SITE_CONFIG = {
  name: 'Kabir Ke Dohe API',
  title: 'Kabir Ke Dohe API',
  description:
    'Access over 2500 timeless dohas (couplets) by Sant Kabir through our powerful, fast, and free RESTful API. Perfect for developers, spiritual seekers, educators, and Hindi literature enthusiasts looking to integrate authentic Indian poetry, spiritual wisdom, and philosophical teachings into websites, apps, and AI-powered tools.',
  url: 'https://kabir-ke-dohe-api.vercel.app',
  category: 'Web API',
  creator: {
    name: 'Vijay Hardaha',
    description:
      'Full-Stack Web Developer and full-time freelancer specializing in modern web applications and custom digital solutions. Experienced in WordPress and WooCommerce development, building high-performance websites and scalable e-commerce platforms.',
    jobTitle: 'Full-Stack Web Developer',
    handle: '@vijayhardaha',
    handles: ['@vijayhardaha', '@vegan.vijay'],
    urls: {
      pph: 'https://pph.me/vijayhardaha',
      github: 'https://github.com/vijayhardaha',
      instagram: 'https://instagram.com/vegan.vijay',
      facebook: 'https://facebook.com/vegan.vijay',
      linkedin: 'https://linkedin.com/in/vijayhardaha',
      wordpress: 'https://profiles.wordpress.org/vijayhardaha/',
      devto: 'https://dev.to/vijayhardaha',
      stactoverflow: 'https://stackoverflow.com/users/11848895/vijay-hardaha',
      codewars: 'https://www.codewars.com/users/vijayhardaha',
    },
  },
};

/**
 * The default metadata object used for SEO, Open Graph, and Twitter cards.
 */
export const SEO_KEYWORDS = [
  'Kabir Ke Dohe API',
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
export const GOOGLE_ANALYTICS_ID = 'G-GM50Y47GMH';

/**
 * Title and description used for SEO, Open Graph, and Twitter cards.
 */
const titleAndDescription = { title: SITE_CONFIG.title, description: SITE_CONFIG.description };

/**
 * The main metadata object containing all SEO-related information for the website.
 */
export const SITE_METADATA: Metadata = {
  ...titleAndDescription,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_CONFIG.name,
  metadataBase: new URL(getCanonicalUrl()),
  alternates: { canonical: new URL(getCanonicalUrl()) },
  authors: [{ name: SITE_CONFIG.creator.name, url: 'https://instagram.com/vegan.vijay' }],
  publisher: SITE_CONFIG.creator.name,
  robots: { index: true, follow: true },
  category: SITE_CONFIG.category,
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification: { google: GOOGLE_SITE_VERIFICATION },
  openGraph: {
    ...titleAndDescription,
    images: [{ url: '/thumbnail.png', width: 512, height: 512 }],
    type: 'website',
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    url: new URL(getCanonicalUrl()),
  },
  twitter: {
    ...titleAndDescription,
    card: 'summary_large_image',
    images: ['/thumbnail.png'],
    creator: SITE_CONFIG.creator.handle,
  },
};
