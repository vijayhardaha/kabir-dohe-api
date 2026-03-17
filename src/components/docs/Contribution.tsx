import { LuArrowUpRight } from 'react-icons/lu';

/**
 * Component that displays contribution information for the Kabir Ke Dohe API project.
 * Explains how users can help improve the project.
 *
 * @returns {React.JSX.Element} - The rendered contribution section
 */
export default function Contribution(): React.JSX.Element {
  return (
    <section>
      <h2>Contribute to the Project</h2>

      <p>
        <strong>We need your help!</strong> This project grows through{' '}
        <a href="https://opensource.guide/how-to-contribute/" target="_blank" rel="noopener noreferrer">
          community contributions
        </a>
        .
      </p>

      <p>Whether you’re a developer or non-developer, there are many ways to help improve this project:</p>

      <ul>
        <li>
          <strong>
            <a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">
              Developers
            </a>
          </strong>
          :{' '}
          <a href="https://en.wikipedia.org/wiki/Software_bug" target="_blank" rel="noopener noreferrer">
            Fix bugs
          </a>
          , improve code, add new features, or enhance API endpoints.
        </li>
        <li>
          <strong>Non-developers</strong>: Help with{' '}
          <a href="https://www.w3.org/International/" target="_blank" rel="noopener noreferrer">
            translations
          </a>
          , data verification, and{' '}
          <a href="https://en.wikipedia.org/wiki/Documentation" target="_blank" rel="noopener noreferrer">
            documentation
          </a>
          .
        </li>
        <li>
          <strong>Everyone</strong>: We maintain our data in{' '}
          <a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener noreferrer">
            Excel sheets
          </a>{' '}
          where you can help fix typos, improve translations, and contribute new dohe.
        </li>
      </ul>

      <div>
        <a
          href="https://github.com/vijayhardaha/kabir-ke-dohe-api"
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
