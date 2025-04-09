/**
 * Component that provides an introduction to the Kabir Ke Dohe API.
 * Explains the purpose and features of the API.
 *
 * @returns {JSX.Element} - The rendered introduction section
 */
export function Introduction() {
  return (
    <div className="mb-8">
      <h3 className="mb-4">Introduction</h3>
      <p className="mb-4">
        The Kabir Ke Dohe API provides programmatic access to over 2500 couplets by Saint Kabir, one of India’s most
        influential spiritual poets. This API lets you integrate these profound teachings into your applications,
        websites, or research projects.
      </p>
      <p className="mb-4">
        All endpoints are free to use and require no authentication. The API is designed to be simple to use while
        offering powerful search and filtering capabilities.
      </p>
      <div className="mt-4">
        <h4 className="mb-2 text-lg font-bold">Rate Limiting</h4>
        <p className="mb-2">To ensure fair usage and maintain service stability, the API implements rate limiting:</p>
        <ul className="mb-4 list-disc pl-6">
          <li>Each IP address is limited to 60 requests per minute per endpoint.</li>
          <li>Rate limits are tracked separately for each endpoint.</li>
          <li>When you exceed the rate limit, the API will return a 429 Too Many Requests status code.</li>
        </ul>
        <p>
          To avoid hitting rate limits, we recommend creating a local copy of the data and serving it from your own
          server. You can periodically update your local copy by scheduling regular updates from the API.
        </p>
      </div>
    </div>
  );
}
