import { SITE_CONFIG, SEO_KEYWORDS } from '@/constants/seo';
import { getCanonicalUrl } from '@/lib/utils/seo';

// Updated type to handle the JSON-LD structure
type AnyObject = Record<string, unknown>;

/**
 * Build a Schema.org `Person` entity.
 */
export function personSchema(): AnyObject {
  const rootUrl = getCanonicalUrl();
  return {
    '@type': 'Person',
    '@id': `${rootUrl}#person`,
    name: SITE_CONFIG.creator.name,
    alternateName: SITE_CONFIG.creator.handles,
    jobTitle: SITE_CONFIG.creator.jobTitle,
    url: rootUrl,
    description: SITE_CONFIG.creator.description,
    sameAs: Object.values(SITE_CONFIG.creator.urls),
    image: { '@type': 'ImageObject', url: `${rootUrl}/avatar.png`, width: 512, height: 512 },
    knowsAbout: [
      'TypeScript',
      'Node.js',
      'API Design',
      'VS Code Extensions',
      'WordPress Development',
      'WooCommerce Development',
      'Next.js',
      'React',
      'Frontend Development',
      'HTML',
      'CSS',
      'JavaScript',
      'Tailwind CSS',
      'Sass',
      'Bootstrap',
      'GitHub',
      'Git',
    ],
  };
}

/**
 * Build a Schema.org `WebAPI` entity.
 * Converted from WebSite to describe the technical API service.
 */
export function webApiSchema(): AnyObject {
  const rootUrl = getCanonicalUrl();
  const personId = `${rootUrl}#person`; // Pointing to you

  return {
    '@type': 'WebAPI',
    '@id': `${rootUrl}#webapi`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: rootUrl,
    documentation: rootUrl,
    provider: { '@id': personId },
    isAccessibleForFree: true,
    keywords: SEO_KEYWORDS,
  };
}

/**
 * Master function to generate the complete JSON-LD Graph.
 *
 * This combines the Person, Organization, and WebAPI into a single
 * interconnected structure that search engines can easily parse.
 */
export function getFullSchemaGraph(): Array<AnyObject> {
  return [personSchema(), webApiSchema()];
}
