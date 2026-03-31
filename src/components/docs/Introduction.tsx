/**
 * Component that provides an introduction to the Kabir Dohe API.
 * Explains the purpose, benefits, and features of the API for SEO and usability.
 *
 * @returns {React.JSX.Element} - The rendered introduction section
 */
export default function Introduction(): React.JSX.Element {
  return (
    <section id="introduction">
      <h2>Introduction to Kabir Dohe API</h2>

      <p>
        <strong>Kabir Dohe API</strong> is a free and open REST API that gives easy access to a large collection of{' '}
        <strong>
          <a href="/api/couplets">2500+ dohe (couplets)</a>
        </strong>{' '}
        by{' '}
        <a href="https://en.wikipedia.org/wiki/Kabir" target="_blank" rel="noopener noreferrer">
          Sant Kabir Das
        </a>
        , a revered Indian mystic poet and spiritual reformer. His verses are simple, meaningful, and still relevant
        today, covering topics like life, truth, love, and human nature.
      </p>

      <p>
        This API is useful for developers, students, teachers, and anyone interested in Indian spiritual and cultural
        content. You can use it to build apps like daily quote generators, educational tools, or content-based
        platforms.
      </p>

      <p>The API is simple to use and does not require authentication. It offers useful features such as:</p>

      <ul>
        <li>Get random doha</li>
        <li>Search dohe by keyword</li>
        <li>Filter by language or ID</li>
      </ul>

      <p>
        It is designed for fast performance and easy integration, making it a great choice for projects that need
        meaningful and culturally rich content.
      </p>
    </section>
  );
}
