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
        <p className="mb-2">&copy; {new Date().getFullYear()} Kabir Dohe Hub. All rights reserved.</p>
        <p className="mb-2 text-sm">
          Created by{' '}
          <a
            href="https://github.com/vijayhardaha"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400"
          >
            Vijay Hardaha <LuArrowUpRight className="inline" />
          </a>{' '}
          using{' '}
          <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-primary-400">
            Next.js <LuArrowUpRight className="inline" />
          </a>{' '}
          and{' '}
          <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-primary-400">
            Tailwind CSS <LuArrowUpRight className="inline" />
          </a>
          .
        </p>
        <p className="text-xs">
          <strong>Disclaimer:</strong> The Kabir Dohe API provides access to dohe attributed to Sant Kabir Das for
          informational and educational purposes. While efforts are made to ensure accuracy, we do not guarantee the
          completeness or correctness of all content. Users are responsible for how they use the data, and Kabir Dohe
          Hub shall not be held liable for any misuse or misinterpretation. The verses themselves are not owned by us;
          only the API service and its implementation are.
        </p>
      </div>
    </footer>
  );
}
