/**
 * Interface for API query parameters.
 */
interface IDocsSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Container component for documentation sections with a title and ID.
 *
 * @param {Object} props - The component props
 * @param {string} props.title - The title of the documentation section
 * @param {React.ReactNode} props.children - The content of the documentation section
 * @returns {React.JSX.Element} - The rendered documentation section
 */
export function DocsSection({ title, children }: IDocsSectionProps): React.JSX.Element {
  return (
    <section>
      <h2 className="mb-6 font-bold">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
