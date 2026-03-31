import {
  organizationSchema,
  personSchema,
  softwareAppSchema,
  webPageSchema,
  webSiteSchema,
} from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';

import {
  Introduction,
  ApiEndpoints,
  QueryParameters,
  ResponseFormat,
  ErrorResponse,
  UsageExamples,
  Examples,
  Contribution,
  SEOContent,
} from '@/components/docs';
import { API_QUERY_PARAMS } from '@/constants/api-params';
import { SITE_CONFIG } from '@/constants/seo';
import { siteUrl } from '@/lib/utils/seo';

const title = SITE_CONFIG.title;
const description = SITE_CONFIG.description;
const siteName = SITE_CONFIG.organization.name;

// Schema.org structured data.
const rootUrl = siteUrl();
const commonOptions = { rootUrl };
const commonSchema = { name: title, description };
const schema = [
  personSchema(commonOptions),
  organizationSchema(commonOptions, { ...SITE_CONFIG.organization }),
  webSiteSchema(commonOptions, { name: siteName, description, alternateName: title }),
  webPageSchema(
    { ...commonOptions, path: '' },
    {
      ...commonSchema,
      ...{
        keywords: [
          'Kabir dohe API',
          'Kabir ke dohe',
          'Kabir Das quotes API',
          'Hindi quotes API',
          'Indian philosophy API',
        ],
      },
    }
  ),
  softwareAppSchema(
    { ...commonOptions, path: '' },
    {
      ...commonSchema,
      ...{
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'API Service',
        featureList: [
          'Access 2500+ Kabir dohas',
          'REST API with JSON response',
          'Free to use',
          'Fast and scalable',
          'Search and filter dohas',
          'Developer-friendly integration',
        ],
      },
    }
  ),
];

/**
 * Home page component that renders the API documentation.
 * Displays various documentation sections including introduction,
 * endpoints, parameters, response formats, and usage examples.
 *
 * @returns {React.ReactElement} The rendered documentation page
 */
export default function Home(): React.JSX.Element {
  return (
    <div className="box">
      <JsonLd data={schema} />
      <Introduction />
      <ApiEndpoints />
      <QueryParameters parameters={API_QUERY_PARAMS} />
      <ResponseFormat />
      <ErrorResponse />
      <UsageExamples />
      <Examples />
      <Contribution />
      <SEOContent />
    </div>
  );
}
