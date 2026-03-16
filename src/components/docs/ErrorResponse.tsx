import { CodeBlock } from '@/components/CodeBlock';

/**
 * Component that displays API error response documentation.
 * Shows error response format with an example and a table of common error responses.
 *
 * @returns {React.JSX.Element} - The rendered error response documentation.
 */
export function ErrorResponse(): React.JSX.Element {
  const errorExample = `{
  "success": false,
  "error": {
    "code": 400,
    "error": "A descriptive error message"
  }
}`;

  return (
    <section>
      <h3 className="mb-4">Error Response Format</h3>
      <p className="mb-4">When an error occurs, the API will return a JSON response with the following structure:</p>
      <CodeBlock code={errorExample} language="json" usePrism={true} />
      <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold">Error Response Fields</h4>
        <div className="rounded-lg border border-slate-200">
          <table className="table">
            <thead>
              <tr className="table-header">
                <th className="table-th">Field</th>
                <th className="table-th">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>success</code>
                </td>
                <td className="table-td">Always false for error responses</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>error.code</code>
                </td>
                <td className="table-td">HTTP status code</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>error.error</code>
                </td>
                <td className="table-td">Error message describing what went wrong</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold">Common Error Responses</h4>
        <div className="rounded-lg border border-slate-200">
          <table className="table">
            <thead>
              <tr className="table-header">
                <th className="table-th">Error Message</th>
                <th className="table-th">Description</th>
                <th className="table-th">HTTP Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row-hover">
                <td className="table-td">Validation error: Invalid sort_by value</td>
                <td className="table-td">One or more request parameters are invalid</td>
                <td className="table-td">
                  <code>400</code>
                </td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td">Resource not found</td>
                <td className="table-td">The requested resource could not be found</td>
                <td className="table-td">
                  <code>404</code>
                </td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td">Too many requests</td>
                <td className="table-td">You have exceeded the rate limit of 60 requests per minute</td>
                <td className="table-td">
                  <code>429</code>
                </td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td">Internal server error</td>
                <td className="table-td">An unexpected error occurred on the server</td>
                <td className="table-td">
                  <code>500</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
