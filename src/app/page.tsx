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

/**
 * Home page component that renders the API documentation.
 * Displays various documentation sections including introduction,
 * endpoints, parameters, response formats, and usage examples.
 *
 * @returns {React.ReactElement} The rendered documentation page
 */
export default function Home(): React.ReactElement {
  return (
    <div className="box">
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
