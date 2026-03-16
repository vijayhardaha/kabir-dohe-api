/**
 * Component that provides an introduction to the Kabir Ke Dohe API.
 * Explains the purpose, benefits, and features of the API for SEO and usability.
 *
 * @returns {React.JSX.Element} - The rendered introduction section
 */
export function Introduction(): React.JSX.Element {
  return (
    <section id="introduction">
      <h2>Introduction to Kabir Ke Dohe API</h2>
      <p>
        The <strong>Kabir Ke Dohe API</strong> is a free and open RESTful API that provides programmatic access to a
        vast collection of over{' '}
        <strong>
          <a href="/api/couplets">2500 dohas (couplets)</a>
        </strong>{' '}
        written by <strong>Sant Kabir</strong>, a revered Indian mystic poet and spiritual reformer. His verses, rich in
        meaning and simplicity, offer timeless insights into life, morality, love, and human nature.
      </p>
      <p>
        This API is ideal for developers, educators, researchers, and spiritual seekers looking to build applications
        that incorporate <strong>Indian spiritual poetry</strong>, <strong>mystic literature</strong>, or culturally
        rich content. Whether you’re building a mobile app, a daily quote service, or a machine learning model
        trained on vernacular philosophy, the Kabir Ke Dohe API is a perfect fit.
      </p>
      <p>
        With no authentication required, the API is <strong>completely free to use</strong> and includes powerful
        features like keyword search, random doha endpoints, and filtering by language or ID. Designed with simplicity
        and speed in mind, it empowers you to create high-performance apps with deep spiritual value.
      </p>
    </section>
  );
}
