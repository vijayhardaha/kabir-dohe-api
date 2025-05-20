/**
 * Component that provides an introduction to the Kabir Ke Dohe API.
 * Explains the purpose and features of the API.
 *
 * @returns {React.JSX.Element} - The rendered introduction section
 */
export function Introduction(): React.JSX.Element {
  return (
    <section>
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
    </section>
  );
}
