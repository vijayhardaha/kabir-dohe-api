/**
 * Container component for documentation sections with a title and ID.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content of the documentation section
 * @returns {React.JSX.Element} - The rendered documentation section
 */
export function DocsSection({ children }: { children: React.ReactNode }): React.JSX.Element {
	return <div className="mb-10 space-y-10">{children}</div>;
}
