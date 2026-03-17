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
import JsonLd from '@/components/JsonLd';
import { API_QUERY_PARAMS } from '@/constants/api-params';
import { getFullSchemaGraph } from '@/lib/utils/schema';

// Schema.org structured data.
const schemaData = getFullSchemaGraph();

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
      <JsonLd data={schemaData} />
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
