import { LuArrowUpRight } from "react-icons/lu";

/**
 * Component that displays contribution information for the Kabir Ke Dohe API project.
 * Explains how users can help improve the project.
 *
 * @returns {React.JSX.Element} - The rendered contribution section
 */
export function Contribution(): React.JSX.Element {
  return (
    <section>
      <div className="rounded-lg border border-slate-300 p-6">
        <h3 className="mb-4 text-3xl">Contribute to the Project</h3>

        <p className="mb-4">
          <strong>We need your help!</strong> This project grows through community contributions.
        </p>

        <p className="mb-4">
          Whether you’re a developer or non-developer, there are many ways to help improve this project:
        </p>

        <ul className="mb-4 list-inside list-disc space-y-2 pl-4">
          <li>
            <strong>Developers</strong>: Fix bugs, improve code, add new features, or enhance API endpoints.
          </li>
          <li>
            <strong>Non-developers</strong>: Help with translations, data verification, and documentation.
          </li>
          <li>
            <strong>Everyone</strong>: We maintain our data in Excel sheets where you can help fix typos, improve
            translations, and contribute new dohe.
          </li>
        </ul>

        <div>
          <a
            href="https://github.com/vijayhardaha/kabir-ke-dohe-api"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-500 hover:bg-primary-600 inline-flex items-center rounded-md px-6 py-3 font-medium text-white"
          >
            Contribute on GitHub <LuArrowUpRight className="ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
