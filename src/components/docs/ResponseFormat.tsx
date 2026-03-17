import { CodeBlock } from '@/components/CodeBlock';

/**
 * Component that displays the API response format.
 * Shows the structure of a successful API response with an example.
 *
 * @returns {React.JSX.Element} - The rendered response format documentation
 */
export default function ResponseFormat(): React.JSX.Element {
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
    <section id="response-format">
      <h2>Response Format</h2>
      <p>Successful API requests return JSON with the following structure:</p>

      <CodeBlock code={responseExample} language="json" usePrism={true} />

      <h3>Response Fields</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>success</code>
              </td>
              <td>Boolean indicating if the request was successful</td>
            </tr>
            <tr>
              <td>
                <code>data.posts</code>
              </td>
              <td>Array of post objects</td>
            </tr>
            <tr>
              <td>
                <code>data.total</code>
              </td>
              <td>Total number of records matching the query</td>
            </tr>
            <tr>
              <td>
                <code>data.totalPages</code>
              </td>
              <td>Total number of pages</td>
            </tr>
            <tr>
              <td>
                <code>data.page</code>
              </td>
              <td>Current page number</td>
            </tr>
            <tr>
              <td>
                <code>data.per_page</code>
              </td>
              <td>Number of results per page</td>
            </tr>
            <tr>
              <td>
                <code>data.pagination</code>
              </td>
              <td>Boolean indicating if pagination is enabled</td>
            </tr>
            <tr>
              <td>
                <code>posts[].number</code>
              </td>
              <td>Post number/identifier</td>
            </tr>
            <tr>
              <td>
                <code>posts[].slug</code>
              </td>
              <td>URL-friendly slug</td>
            </tr>
            <tr>
              <td>
                <code>posts[].text_hi</code>
              </td>
              <td>Couplet text in Hindi</td>
            </tr>
            <tr>
              <td>
                <code>posts[].text_en</code>
              </td>
              <td>Couplet text in English</td>
            </tr>
            <tr>
              <td>
                <code>posts[].interpretation_hi</code>
              </td>
              <td>Interpretation in Hindi</td>
            </tr>
            <tr>
              <td>
                <code>posts[].interpretation_en</code>
              </td>
              <td>Interpretation in English</td>
            </tr>
            <tr>
              <td>
                <code>posts[].category</code>
              </td>
              <td>Category object with name and slug</td>
            </tr>
            <tr>
              <td>
                <code>posts[].tags</code>
              </td>
              <td>Array of tag objects with slug and name</td>
            </tr>
            <tr>
              <td>
                <code>posts[].created_at</code>
              </td>
              <td>Timestamp when the post was created</td>
            </tr>
            <tr>
              <td>
                <code>posts[].updated_at</code>
              </td>
              <td>Timestamp when the post was last updated</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm">
        See <a href="#query-parameters">query parameters</a> for how to control pagination and filtering of fields.
      </p>
    </section>
  );
}
