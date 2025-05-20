/**
 * Component that displays the available API endpoints.
 * Shows information about GET and POST endpoints for couplets.
 *
 * @returns {React.JSX.Element} - The rendered API endpoints documentation.
 */
export function ApiEndpoints(): React.JSX.Element {
  return (
    <section>
      <h3 className="mb-4">API Endpoints</h3>
      <div className="bg-primary-50 border-primary-300 mb-4 rounded-lg border p-4">
        <h4 className="mb-2 text-lg font-bold">GET /api/couplets</h4>
        <p>Fetch filtered and paginated couplets based on query parameters.</p>
      </div>
    </section>
  );
}
