import { CodeBlock } from "@/components/CodeBlock";

/**
 * Component that displays the API response format.
 * Shows the structure of a successful API response with an example.
 *
 * @returns {JSX.Element} - The rendered response format documentation
 */
export function ResponseFormat() {
  const responseExample = `{
	couplets: [
		{
			id: "1",
			slug: "couplet-slug",
			unique_slug: "couplet-slug-with-id-and-unique-hash",
			couplet_hindi: "हिन्दी में दोहा",
			couplet_english: "English couplet",
			translation_hindi: "हिन्दी में अनुवाद",
			translation_english: "English translation",
			explanation_hindi: "हिन्दी में व्याख्या",
			explanation_english: "English explanation",
			tags: [
				{ slug: "tag1", name: "name1", count: 1 },
				{ slug: "tag2", name: "name1", count: 1 },
			],
			popular: true,
		},
	],
	total: 100,
	totalPages: 10,
	page: 1,
	perPage: 10,
	pagination: true,
}`;

  return (
    <div className="mb-8">
      <h3 className="mb-4">Response Format</h3>
      <p className="mb-4">Successful API requests return JSON with the following structure:</p>
      <CodeBlock code={responseExample} language="json" usePrism={true} />
      <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold">Response Fields</h4>
        <div className="rounded-lg border border-slate-200">
          <table className="min-w-full overflow-hidden rounded-lg bg-white">
            <thead>
              <tr className="bg-slate-100">
                <th className="border-b px-4 py-2 text-left">Field</th>
                <th className="border-b px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b px-4 py-2 font-mono">couplets</td>
                <td className="border-b px-4 py-2">Array of couplet objects</td>
              </tr>
              <tr>
                <td className="border-b px-4 py-2 font-mono">total</td>
                <td className="border-b px-4 py-2">Total number of records matching the query</td>
              </tr>
              <tr>
                <td className="border-b px-4 py-2 font-mono">totalPages</td>
                <td className="border-b px-4 py-2">Total number of pages</td>
              </tr>
              <tr>
                <td className="border-b px-4 py-2 font-mono">page</td>
                <td className="border-b px-4 py-2">Current page number</td>
              </tr>
              <tr>
                <td className="border-b px-4 py-2 font-mono">perPage</td>
                <td className="border-b px-4 py-2">Number of results per page</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono">pagination</td>
                <td className="px-4 py-2">Boolean indicating if pagination is enabled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
