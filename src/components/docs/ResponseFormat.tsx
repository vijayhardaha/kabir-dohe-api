import { CodeBlock } from '@/components/CodeBlock';

/**
 * Component that displays the API response format.
 * Shows the structure of a successful API response with an example.
 *
 * @returns {React.JSX.Element} - The rendered response format documentation
 */
export function ResponseFormat(): React.JSX.Element {
  const responseExample = `{
  "couplets": [
    {
      "id": "1",
      "slug": "couplet-slug",
      "unique_slug": "couplet-slug-with-id-and-unique-hash",
      "couplet_hindi": "हिन्दी में दोहा",
      "couplet_english": "English couplet",
      "translation_hindi": "हिन्दी में अनुवाद",
      "translation_english": "English translation",
      "explanation_hindi": "हिन्दी में व्याख्या",
      "explanation_english": "English explanation",
      "tags": [
        {
          "slug": "tag1",
          "name": "name1",
          "count": 1
        },
        {
          "slug": "tag2",
          "name": "name1",
          "count": 1
        }
      ],
      "popular": true
    }
  ],
  "total": 100,
  "totalPages": 10,
  "page": 1,
  "perPage": 10,
  "pagination": true
}`;

  return (
    <section>
      <h3 className="mb-4">Response Format</h3>
      <p className="mb-4">Successful API requests return JSON with the following structure:</p>
      <CodeBlock code={responseExample} language="json" usePrism={true} />
      <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold">Response Fields</h4>
        <div className="rounded-lg border border-slate-200">
          <table className="table">
            <thead>
              <tr className="table-header">
                <th className="table-th">Field</th>
                <th className="table-th">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>couplets</code>
                </td>
                <td className="table-td">Array of couplet objects</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>total</code>
                </td>
                <td className="table-td">Total number of records matching the query</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>totalPages</code>
                </td>
                <td className="table-td">Total number of pages</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>page</code>
                </td>
                <td className="table-td">Current page number</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>perPage</code>
                </td>
                <td className="table-td">Number of results per page</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>pagination</code>
                </td>
                <td className="table-td">Boolean indicating if pagination is enabled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
