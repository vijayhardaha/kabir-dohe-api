import { CodeBlock } from '@/components/CodeBlock';

/**
 * Component that displays the API response format.
 * Shows the structure of a successful API response with an example.
 *
 * @returns {React.JSX.Element} - The rendered response format documentation
 */
export function ResponseFormat(): React.JSX.Element {
  const responseExample = `{
  "success": true,
  "data": {
    "posts": [
      {
        "number": 1,
        "slug": "couplet-slug",
        "text_hi": "हिन्दी में दोहा",
        "text_en": "English couplet",
        "interpretation_hi": "हिन्दी में व्याख्या",
        "interpretation_en": "English interpretation",
        "category": {
          "name": "Category Name",
          "slug": "category-slug"
        },
        "tags": [
          {
            "slug": "tag1",
            "name": "Tag 1"
          },
          {
            "slug": "tag2",
            "name": "Tag 2"
          }
        ],
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "totalPages": 10,
    "page": 1,
    "per_page": 10,
    "pagination": true
  }
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
                  <code>success</code>
                </td>
                <td className="table-td">Boolean indicating if the request was successful</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>data.posts</code>
                </td>
                <td className="table-td">Array of post objects</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>data.total</code>
                </td>
                <td className="table-td">Total number of records matching the query</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>data.totalPages</code>
                </td>
                <td className="table-td">Total number of pages</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>data.page</code>
                </td>
                <td className="table-td">Current page number</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>data.per_page</code>
                </td>
                <td className="table-td">Number of results per page</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>data.pagination</code>
                </td>
                <td className="table-td">Boolean indicating if pagination is enabled</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].number</code>
                </td>
                <td className="table-td">Post number/identifier</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].slug</code>
                </td>
                <td className="table-td">URL-friendly slug</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].text_hi</code>
                </td>
                <td className="table-td">Couplet text in Hindi</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].text_en</code>
                </td>
                <td className="table-td">Couplet text in English</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].interpretation_hi</code>
                </td>
                <td className="table-td">Interpretation in Hindi</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].interpretation_en</code>
                </td>
                <td className="table-td">Interpretation in English</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].category</code>
                </td>
                <td className="table-td">Category object with name and slug</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].tags</code>
                </td>
                <td className="table-td">Array of tag objects with slug and name</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].created_at</code>
                </td>
                <td className="table-td">Timestamp when the post was created</td>
              </tr>
              <tr className="table-row-hover">
                <td className="table-td font-mono">
                  <code>posts[].updated_at</code>
                </td>
                <td className="table-td">Timestamp when the post was last updated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
