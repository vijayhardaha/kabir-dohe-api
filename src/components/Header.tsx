import { LuArrowUpRight } from 'react-icons/lu';

/**
 * Header component for the documentation page.
 * Displays the title and main heading for the Kabir Dohe API documentation.
 *
 * @returns {React.JSX.Element} - The rendered header for the documentation page
 */
export default function Header(): React.JSX.Element {
  return (
    <header className="bg-primary-700 py-8 text-white">
      <div className="box">
        <h1 className="mb-4 text-5xl font-black">Kabir Dohe API</h1>
        <p className="text-primary-100 mb-6 text-lg">
          Access over{' '}
          <a href="/api/couplets" target="_blank">
            2500 authentic couplets (dohe)
          </a>{' '}
          by Sant Kabir, one of India’s greatest spiritual poets and philosophers. This RESTful API offers seamless
          integration to fetch, search, and filter Kabir’s timeless wisdom in your web or mobile apps, educational
          platforms, and AI projects.
        </p>
        <div className="space-x-4">
          <a href="/api/couplets" className="btn btn-outline-white" target="_blank">
            Try the API
          </a>
          <a
            href="https://github.com/vijayhardaha/kabir-dohe-api"
            className="btn btn-white"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
          >
            View on GitHub
            <LuArrowUpRight />
          </a>
        </div>
      </div>
    </header>
  );
}
