import { CodeBlock } from '@/components/CodeBlock';

/**
 * Component that displays API error response documentation.
 * Shows error response format with an example and a table of common error responses.
 *
 * @returns {React.JSX.Element} - The rendered error response documentation.
 */
export default function ErrorResponse(): React.JSX.Element {
  const errorExample = `{
  "code": 400,
  "error": "A descriptive error message"
}`;

  return (
    <section>
      <h2>Error Response Format</h2>
      <p>When an error occurs, the API will return a JSON response with the following structure:</p>

      <CodeBlock code={errorExample} language="json" usePrism={true} />

      <h3>Error Response Fields</h3>
      <div className="mb-8 space-y-4">
        <div className="info-card">
          <div className="info-card-key">
            <code>code</code>
          </div>
          <div className="info-card-body">
            <h4 className="mb-1">HTTP status code</h4>
            <p>Numeric HTTP status code indicating the result of the request.</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-key">
            <code>error</code>
          </div>
          <div className="info-card-body">
            <h4 className="mb-1">Error message</h4>
            <p>A human-readable error message describing what went wrong.</p>
          </div>
        </div>
      </div>

      <h3>Common Error Responses</h3>
      <div className="space-y-4">
        <div className="info-card">
          <div className="info-card-key">
            <code>400</code>
          </div>
          <div className="info-card-body">
            <h4 className="mb-1">Bad Request</h4>
            <p>Your request had invalid or missing parameters. Review the error message and try again.</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-key">
            <code>404</code>
          </div>
          <div className="info-card-body">
            <h4 className="mb-1">Not Found</h4>
            <p>The endpoint you tried to access does not exist. Check the URL and request method.</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-key">
            <code>500</code>
          </div>
          <div className="info-card-body">
            <h4 className="mb-1">Internal server error</h4>
            <p>Something went wrong on the server side. Try again later or contact support if the problem persists.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
