import {
  organizationSchema,
  personSchema,
  webApiSchema,
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
import { getBaseUrl } from '@/lib/utils/seo';

const title = SITE_CONFIG.title;
const description = SITE_CONFIG.description;
const siteName = SITE_CONFIG.name;

// Schema.org structured data.
const rootUrl = getBaseUrl();
const commonOptions = { rootUrl };
const commonSchema = { name: title, description };
const schema = [
  personSchema(commonOptions),
  organizationSchema(commonOptions, {
    name: 'Kabir Dohe Hub',
    description:
      'Kabir Dohe Hub is an online collection of Kabir ke dohe, featuring over 2000 authentic verses by Kabir Das. The platform provides organized access to dohas for reading, learning, and integration through APIs, making classical Indian wisdom easily accessible in the digital age.',
    url: 'https://kabirkedohe.vercel.app',
    logo: undefined,
    foundingDate: 2024,
  }),
  webSiteSchema(commonOptions, { ...commonSchema, alternateName: siteName }),
  webPageSchema({ ...commonOptions, path: '' }, commonSchema),
  webApiSchema({ ...commonOptions, path: '' }, commonSchema),
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
