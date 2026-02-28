import { getBaseUrl } from "@/lib/utils/base-url";

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
	alternates: { canonical: string };
	keywords: string[];
	verification: { google: string };
	author: string;
	robots: string;
	icons: { icon: string; apple: string };
	openGraph: {
		title: string;
		description: string;
		images: { url: string; width: number; height: number }[];
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
		"Access over 2500 timeless dohas (couplets) by Sant Kabir through our powerful, fast, and free RESTful API. Perfect for developers, spiritual seekers, educators, and Hindi literature enthusiasts looking to integrate authentic Indian poetry, spiritual wisdom, and philosophical teachings into websites, apps, and AI-powered tools.",
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
	alternates: { canonical: getBaseUrl() },
	keywords: [
		"Kabir Ke Dohe API",
		"Kabir couplets API",
		"Sant Kabir dohas API",
		"Spiritual poetry API",
		"Indian poetry API",
		"Hindi couplets API",
		"Kabir dohe translations",
		"Kabir couplets JSON API",
		"Free spiritual quotes API",
		"Kabir API for developers",
		"Access Kabir’s dohas programmatically",
		"RESTful API for Kabir’s poetry",
		"Integrate Kabir couplets into apps",
		"API for Indian spiritual wisdom",
		"Daily Kabir doha quotes API",
		"Kabir’s teachings API for education",
		"Kabir doha translations in English and Hindi",
		"Spiritual chatbot API with Kabir dohas",
		"Open-source Kabir couplets API",
		"Indian philosophy API for developers",
		"Free API for religious couplets",
		"Kabir’s couplets for social media bots",
		"Sant Kabir spiritual poetry",
		"Indian spiritual literature API",
		"Kabir’s wisdom API",
		"Philosophical couplets API",
		"API for devotional poetry",
		"Kabir quotes API",
		"Kabir doha content API",
	],
	author: "Vijay Hardaha",
	robots: "index, follow",
	verification: { google: "4CyrCxZi9TWgvS-GzB1QUhgEl0bKoIzT36368e_vlx0" },
	icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
	openGraph: {
		title: SITE_CONFIG.title,
		description: SITE_CONFIG.description,
		images: [{ url: "/images/thumbnail.png", width: 512, height: 512 }],
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
