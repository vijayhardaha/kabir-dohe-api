import { CodeBlock } from "@/components/CodeBlock";
import { getBaseUrl } from "@/lib/seoUtils";

/**
 * Component that displays example API usage.
 * Shows code examples in different programming languages.
 *
 * @returns {React.JSX.Element} - The rendered examples section
 */
export function UsageExamples(): React.JSX.Element {
  const curlExample = `curl -X GET "${getBaseUrl()}/api/couplets?tags=devotion&perPage=5"`;

  const jsExample = `fetch("${getBaseUrl()}/api/couplets?tags=devotion&perPage=5")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

  const pythonExample = `import requests

response = requests.get("${getBaseUrl()}/api/couplets", params={
  "category": "devotion",
  "limit": 5
})

data = response.json()
print(data)`;

  return (
    <section>
      <h3 className="mb-4">Usage Examples</h3>

      <div className="mb-6">
        <h4 className="mb-2 text-lg font-semibold">cURL</h4>
        <CodeBlock code={curlExample} language="bash" usePrism={true} />
      </div>

      <div className="mb-6">
        <h4 className="mb-2 text-lg font-semibold">JavaScript</h4>
        <CodeBlock code={jsExample} language="javascript" usePrism={true} />
      </div>

      <div className="mb-6">
        <h4 className="mb-2 text-lg font-semibold">Python</h4>
        <CodeBlock code={pythonExample} language="python" usePrism={true} />
      </div>
    </section>
  );
}
