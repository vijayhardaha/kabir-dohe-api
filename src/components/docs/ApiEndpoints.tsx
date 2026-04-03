/**
 * Component that displays the available API endpoint.
 * Describes the GET /api/couplets route and its features.
 *
 * @returns {React.JSX.Element} - The rendered API endpoint documentation.
 */
export default function ApiEndpoints(): React.JSX.Element {
  return (
    <section id="api-endpoint">
      <h2>API Endpoint</h2>

      <div className="border-primary-300 bg-primary-50 border p-5">
        <h3 className="text-primary-500 mb-2 text-xl font-semibold">
          <a href="/api/couplets">GET /api/couplets</a>
        </h3>
        <p>
          The <strong>GET /api/couplets</strong> endpoint lets you fetch a list of dohe (couplets) by
          <strong> Kabir Das</strong>, one of India’s most well-known spiritual poets. The API returns data in JSON
          format, making it easy to use in web and mobile apps.
        </p>

        <p>
          You can use optional{' '}
          <strong>
            <a href="#query-parameters">query parameters</a>
          </strong>{' '}
          to filter results, control pagination, or search by keyword. This makes it useful for apps like daily quotes,
          learning platforms, and Indian philosophy tools.
        </p>

        <p>No authentication is needed, and the API is free to use for personal and educational projects.</p>
      </div>
    </section>
  );
}
