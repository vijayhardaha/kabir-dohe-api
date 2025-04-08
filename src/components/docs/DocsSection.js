import PropTypes from "prop-types";

/**
 * A container component for documentation sections with a title and ID.
 *
 * @param {Object} props - The component props
 * @param {string} props.title - The title of the documentation section
 * @param {React.ReactNode} props.children - The content of the documentation section
 * @returns {JSX.Element} - The rendered documentation section
 */
export function DocsSection({ title, children }) {
  return (
    <section>
      <h2 className="mb-6 font-bold">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

DocsSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
