import { LuArrowUpRight } from 'react-icons/lu';

/**
 * Footer component displaying copyright information, credits and tech stack.
 *
 * @returns {React.JSX.Element} The rendered footer component
 */
export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-primary/90 text-primary-foreground border-t py-10">
      <div className="box">
        <p className="mb-4">&copy; {new Date().getFullYear()} Kabir Dohe Hub. All rights reserved.</p>
        <p className="mb-4 text-sm">
          Built and actively maintained by{' '}
          <a
            href="https://github.com/vijayhardaha"
            target="_blank"
            rel="noopener noreferrer"
            className="text-background font-semibold"
          >
            Vijay Hardaha <LuArrowUpRight className="inline" />
          </a>{' '}
          using{' '}
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-background font-semibold"
          >
            Next.js <LuArrowUpRight className="inline" />
          </a>{' '}
          and{' '}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-background font-semibold"
          >
            Tailwind CSS <LuArrowUpRight className="inline" />
          </a>
          .
        </p>
        <p className="text-xs">
          <strong>Disclaimer:</strong> The Kabir Dohe API provides dohe of Sant Kabir Das for educational and
          informational use. While we strive for accuracy, we do not guarantee completeness or correctness. Users are
          responsible for their use of the content. The verses are not owned by us, only the API service is.
        </p>
      </div>
    </footer>
  );
}
