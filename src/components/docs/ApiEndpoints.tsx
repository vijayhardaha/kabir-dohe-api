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

      <div className="border-primary-300 bg-primary-50 rounded-lg border p-5">
        <h3 className="text-primary-500 mb-2 text-xl font-semibold">
          <a href="/api/couplets">GET /api/couplets</a>
        </h3>
        <p>
          The <strong>GET /api/couplets</strong> endpoint allows you to fetch a list of couplets (dohe) written by
          <strong> Sant Kabir</strong>, one of India’s most influential spiritual poets. This API returns data in JSON
          format, making it easy to integrate into web and mobile applications.
        </p>
        <p>
          You can use optional{' '}
          <strong>
            <a href="#query-parameters">query parameters</a>
          </strong>{' '}
          to filter the results, paginate the output, or search by keyword. This makes it ideal for applications that
          need dynamic spiritual content, quote-of-the-day features, educational tools, or Indian philosophy resources.
        </p>
        <p>
          No authentication is required, and the API is completely free to use for both personal and commercial
          projects.
        </p>
      </div>
    </section>
  );
}
