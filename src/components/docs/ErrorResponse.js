import { CodeBlock } from "@/components/CodeBlock";

/**
 * Component that displays API error response documentation.
 * Shows error response format with an example and a table of common error responses.
 *
 * @returns {JSX.Element} - The rendered error response documentation.
 */
export function ErrorResponse() {
  const errorExample = `{
  "success": false,
  "message": "A descriptive error message"
}`;

  return (
    <div className="mb-8">
      <h3 className="mb-4">Error Response Format</h3>
      <p className="mb-4">When an error occurs, the API will return a JSON response with the following structure:</p>
      <CodeBlock code={errorExample} language="json" usePrism={true} />
      <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold">Common Error Responses</h4>
        <div className="rounded-lg border border-slate-200">
          <table className="min-w-full overflow-hidden rounded-lg bg-white">
            <thead>
              <tr className="bg-slate-100">
                <th className="border-b px-4 py-2 text-left whitespace-nowrap">Error Message</th>
                <th className="border-b px-4 py-2 text-left whitespace-nowrap">Description</th>
                <th className="border-b px-4 py-2 text-left whitespace-nowrap">HTTP Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b px-4 py-2">Invalid parameter value</td>
                <td className="border-b px-4 py-2">One or more request parameters are invalid</td>
                <td className="border-b px-4 py-2">400</td>
              </tr>
              <tr>
                <td className="border-b px-4 py-2">Resource not found</td>
                <td className="border-b px-4 py-2">The requested resource could not be found</td>
                <td className="border-b px-4 py-2">404</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Internal server error</td>
                <td className="px-4 py-2">An unexpected error occurred on the server</td>
                <td className="px-4 py-2">500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
