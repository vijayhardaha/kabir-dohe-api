import { LuArrowUpRight } from 'react-icons/lu';

/**
 * Component that displays contribution information for the Kabir Dohe API project.
 * Explains how users can help improve the project.
 *
 * @returns {React.JSX.Element} - The rendered contribution section
 */
export default function Contribution(): React.JSX.Element {
  return (
    <section>
      <h2>Contribute to the Project</h2>

      <p>
        <strong>We need your help!</strong> This project grows with support from the community. You can contribute in
        many simple ways.
      </p>

      <p>Whether you are a developer or not, you can help improve this project:</p>

      <ul>
        <li>
          <strong>Developers</strong>: Fix bugs, improve code, add new features, or enhance API endpoints.
        </li>
        <li>
          <strong>Non-developers</strong>: Help with translations, data checking, and improving documentation.
        </li>
        <li>
          <strong>Everyone</strong>: You can help update our Excel sheets by fixing mistakes, improving translations, or
          adding new dohe.
        </li>
      </ul>

      <div>
        <a
          href="https://github.com/vijayhardaha/kabir-dohe-api"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary px-6 py-3"
        >
          Contribute on GitHub <LuArrowUpRight />
        </a>
      </div>
    </section>
  );
}
