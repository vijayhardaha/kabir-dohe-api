import {
  DocsHeader,
  Introduction,
  ApiEndpoints,
  QueryParameters,
  ResponseFormat,
  ErrorResponse,
  UsageExamples,
  Examples,
  DocsSection,
  Contribution,
} from "@/components/docs";
import { API_QUERY_PARAMS } from "@/constants/api-params";
import { SITE_CONFIG } from "@/constants/seo";

/**
 * Metadata for the Kabir Ke Dohe API documentation page.
 * Includes SEO-related information and social media previews.
 * @type {Object}
 */
export const metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  canonical: SITE_CONFIG.url,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

/**
 * Home page component that renders the API documentation.
 * Displays various documentation sections including introduction,
 * endpoints, parameters, response formats, and usage examples.
 *
 * @returns {React.ReactElement} The rendered documentation page
 */
export default function Home() {
  return (
    <div className="container p-4">
      <DocsHeader />

      <DocsSection title="API Documentation">
        <Introduction />
        <ApiEndpoints />
        <QueryParameters parameters={API_QUERY_PARAMS} />
        <ResponseFormat />
        <ErrorResponse />
        <UsageExamples />
        <Examples />
        <Contribution />
      </DocsSection>
    </div>
  );
}
