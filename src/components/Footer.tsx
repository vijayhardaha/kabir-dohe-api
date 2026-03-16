import { LuArrowUpRight } from 'react-icons/lu';

/**
 * Footer component displaying copyright information, credits and tech stack.
 *
 * @returns {React.JSX.Element} The rendered footer component
 */
export default function Footer(): React.JSX.Element {
  return (
    <footer className="text-primary-100 bg-primary-900 border-t py-8">
      <div className="box">
        <div className="text-center">
          <p className="mb-2">
            Crafted with ❤️ by{' '}
            <a
              href="https://github.com/vijayhardaha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400"
            >
              Vijay Hardaha
              <LuArrowUpRight className="inline" />
            </a>
          </p>
          <p>
            &copy; {new Date().getFullYear()} Kabir Ke Dohe API. Powered by{' '}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-primary-400">
              Next.js
              <LuArrowUpRight className="inline" />
            </a>{' '}
            and deployed on{' '}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary-400">
              Vercel
              <LuArrowUpRight className="inline" />
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
