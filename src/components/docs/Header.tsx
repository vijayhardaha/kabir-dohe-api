import { LuArrowUpRight } from "react-icons/lu";

/**
 * Header component for the documentation page.
 * Displays the title and main heading for the Kabir Ke Dohe API documentation.
 *
 * @returns {React.JSX.Element} - The rendered header for the documentation page
 */
export function DocsHeader(): React.JSX.Element {
	return (
		<header className="mb-12 text-center">
			<h1 className="mb-4 text-4xl font-bold">Kabir Ke Dohe API</h1>
			<p className="text-lg text-gray-700">
				Access over 2500 authentic couplets (dohe) by Sant Kabir, one of India’s greatest
				spiritual poets and philosophers. This RESTful API offers seamless integration to
				fetch, search, and filter Kabir’s timeless wisdom in your web or mobile apps,
				educational platforms, and AI projects.
			</p>
			<div className="mt-8 flex justify-center space-x-4">
				<a href="/api/couplets" className="btn btn-primary" aria-label="Try the API">
					Try the API
				</a>
				<a
					href="https://github.com/vijayhardaha/kabir-ke-dohe-api"
					className="btn btn-secondary"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="View on GitHub"
				>
					View on GitHub
					<LuArrowUpRight className="ml-1" />
				</a>
			</div>
		</header>
	);
}
