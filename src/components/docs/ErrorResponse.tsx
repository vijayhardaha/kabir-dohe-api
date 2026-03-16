import { CodeBlock } from '@/components/CodeBlock';

/**
 * Component that displays API error response documentation.
 * Shows error response format with an example and a table of common error responses.
 *
 * @returns {React.JSX.Element} - The rendered error response documentation.
 */
export function ErrorResponse(): React.JSX.Element {
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
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>code</code>
              </td>
              <td>HTTP status code</td>
            </tr>
            <tr>
              <td>
                <code>error</code>
              </td>
              <td>Error message describing what went wrong</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Common Error Responses</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Error Message</th>
              <th>Description</th>
              <th>HTTP Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Validation error: Invalid sort_by value</td>
              <td>One or more request parameters are invalid</td>
              <td>
                <code>400</code>
              </td>
            </tr>
            <tr>
              <td>Resource not found</td>
              <td>The requested resource could not be found</td>
              <td>
                <code>404</code>
              </td>
            </tr>
            <tr>
              <td>Internal server error</td>
              <td>An unexpected error occurred on the server</td>
              <td>
                <code>500</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
