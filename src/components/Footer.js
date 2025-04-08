import { LuArrowUpRight } from "react-icons/lu";

/**
 * Footer component displaying copyright information, credits and tech stack.
 *
 * @returns {JSX.Element} The rendered footer component
 */
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <p className="mb-2">
            Crafted with ❤️ by{" "}
            <a
              href="https://github.com/vijayhardaha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline"
            >
              Vijay Hardaha
              <LuArrowUpRight className="inline" />
            </a>
          </p>
          <p className="text-slate-600">
            &copy; {new Date().getFullYear()} Kabir Ke Dohe API. Powered by{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline"
            >
              Next.js
              <LuArrowUpRight className="inline" />
            </a>{" "}
            and deployed on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline"
            >
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
