import { CodeBlock } from "@/components/CodeBlock";

export function Examples() {
  const examples = [
    {
      title: "1. Fetch All Couplets",
      code: "GET /api/couplets",
    },
    {
      title: "2. Search for a Couplet",
      code: "GET /api/couplets?s=love&exactMatch=false",
    },
    {
      title: "3. Filter by Tags",
      code: "GET /api/couplets?tags=spiritual,life",
    },
    {
      title: "4. Filter by Popularity",
      code: "GET /api/couplets?popular=true",
    },
    {
      title: "5. Sort by Couplet in Hindi",
      code: "GET /api/couplets?orderBy=couplet_hindi&order=ASC",
    },
    {
      title: "6. Paginate Results",
      code: "GET /api/couplets?page=2&perPage=5",
    },
    {
      title: "7. Combining Multiple Filters",
      code: "GET /api/couplets?s=wisdom&exactMatch=true&searchWithin=translation,explanation&tags=philosophy&popular=false&orderBy=id&order=DESC&page=1&perPage=10",
    },
  ];

  // Function to extract the API path from the code example
  const getApiUrl = (code) => {
    // Extract everything after "GET " and construct the full URL
    const path = code.replace("GET ", "");
    // Use the base URL of your deployed API or a placeholder
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://kabir-ke-dohe-api.vercel.app";
    return `${baseUrl}${path}`;
  };

  const actionElement = (example) => (
    <a
      href={getApiUrl(example.code)}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary mt-0.75 rounded px-2 py-1 text-xs"
    >
      Try it
    </a>
  );

  return (
    <div className="mb-8">
      <h3 className="mb-4">Examples</h3>
      {examples.map((example, index) => (
        <div className="mb-6" key={index}>
          <h4 className="mb-2 text-lg font-semibold">{example.title}</h4>

          <div className="mb-4 flex flex-col space-y-3">
            <CodeBlock code={example.code} language="http" actionElement={actionElement(example)} />
          </div>
        </div>
      ))}
    </div>
  );
}
