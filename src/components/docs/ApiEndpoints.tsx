/**
 * Component that displays the available API endpoint.
 * Describes the GET /api/couplets route and its features.
 *
 * @returns {React.JSX.Element} - The rendered API endpoint documentation.
 */
export function ApiEndpoints(): React.JSX.Element {
	return (
		<section>
			<h2 className="mb-6 text-3xl font-bold text-gray-800">API Endpoint</h2>

			<div className="rounded-lg border border-green-600 bg-green-50 p-5">
				<h3 className="mb-2 text-xl font-semibold text-green-800">GET /api/couplets</h3>
				<p className="mb-2 text-gray-700">
					The <strong>GET /api/couplets</strong> endpoint allows you to fetch a list of
					couplets (dohe) written by
					<strong> Sant Kabir</strong>, one of India’s most influential spiritual poets.
					This API returns data in JSON format, making it easy to integrate into web and
					mobile applications.
				</p>
				<p className="mb-2 text-gray-700">
					You can use optional <strong>query parameters</strong> to filter the results,
					paginate the output, or search by keyword. This makes it ideal for applications
					that need dynamic spiritual content, quote-of-the-day features, educational
					tools, or Indian philosophy resources.
				</p>
				<p className="text-gray-700">
					No authentication is required, and the API is completely free to use for both
					personal and commercial projects.
				</p>
			</div>
		</section>
	);
}
