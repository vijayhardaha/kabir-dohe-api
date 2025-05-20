import { getBaseUrl } from "@/lib/seoUtils";

/**
 * Interface for site configuration variables.
 */
export interface SiteConfig {
  title: string;
  description: string;
  url: string;
}

/**
 * Interface for base metadata used in the application.
 */
export interface IBaseMetadata {
  title: string;
  description: string;
  metadataBase: URL;
  manifest: string;
  appleTouchIcon: string;
  alternates: {
    canonical: string;
  };
  keywords: string[];
  verification: {
    google: string;
  };
  author: string;
  robots: string;
  icons: {
    icon: string;
    apple: string;
  };
  openGraph: {
    title: string;
    description: string;
    images: {
      url: string;
      width: number;
      height: number;
    }[];
    type: string;
    siteName: string;
    locale: string;
    url: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator: string;
  };
}
/**
 * Site configuration variables.
 */
export const SITE_CONFIG: SiteConfig = {
  title: "Kabir Ke Dohe API",
  description:
    "Explore over 2500 timeless dohas (couplets) by Saint Kabir with this powerful and free API — ideal for spiritual seekers, developers, and Hindi literature enthusiasts.",
  url: "https://kabir-ke-dohe-api.vercel.app",
};

/**
 * Base metadata for the application.
 */
export const baseMetadata: IBaseMetadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  metadataBase: new URL(getBaseUrl()),
  manifest: "/site.webmanifest",
  appleTouchIcon: "/apple-touch-icon.png",
  alternates: {
    canonical: getBaseUrl(),
  },
  keywords: ["tools", "utilities", "web tools", "online tools", "developer tools"],
  author: "Vijay",
  robots: "index, follow",
  verification: {
    google: "4CyrCxZi9TWgvS-GzB1QUhgEl0bKoIzT36368e_vlx0",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/images/thumbnail.png",
        width: 512,
        height: 512,
      },
    ],
    type: "website",
    siteName: SITE_CONFIG.title,
    locale: "en_US",
    url: SITE_CONFIG.url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ["/images/thumbnail.png"],
    creator: "@vijayhardaha",
  },
};
