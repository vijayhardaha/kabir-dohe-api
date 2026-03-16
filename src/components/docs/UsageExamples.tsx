'use client';

import { useState, useRef } from 'react';

import { CodeBlock } from '@/components/CodeBlock';
import { getBaseUrl } from '@/lib/utils/base-url';

/**
 * Type definition for API usage examples.
 */
interface Example {
  label: string;
  code: string;
  language: string;
}

type ExampleKey = 'curl' | 'javascript' | 'python';

/**
 * Component that displays example API usage.
 * Shows code examples in different programming languages with a tab-based design.
 *
 * @returns {React.JSX.Element} - The rendered examples section
 */

export function UsageExamples(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ExampleKey>('curl');

  const keys = Object.keys({ curl: 1, javascript: 1, python: 1 }) as ExampleKey[];
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const examples: Record<ExampleKey, Example> = {
    curl: {
      label: 'cURL',
      code: `curl -X GET "${getBaseUrl()}/api/couplets?tags=devotion&perPage=5"`,
      language: 'bash',
    },
    javascript: {
      label: 'JavaScript',
      code: `fetch("${getBaseUrl()}/api/couplets?tags=devotion&perPage=5")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
      language: 'javascript',
    },
    python: {
      label: 'Python',
      code: `import requests

response = requests.get("${getBaseUrl()}/api/couplets", params={
  "category": "devotion",
  "limit": 5
})

data = response.json()
print(data)`,
      language: 'python',
    },
  };

  return (
    <section>
      <h2>Usage Examples</h2>

      <p>
        Explore implementation examples for the Verses{' '}
        <a href="https://en.wikipedia.org/wiki/API" target="_blank" rel="noopener noreferrer">
          API
        </a>{' '}
        across various environments including{' '}
        <a href="https://curl.se/" target="_blank" rel="noopener noreferrer">
          cURL
        </a>
        ,{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
          JavaScript
        </a>
        , and{' '}
        <a href="https://www.python.org/" target="_blank" rel="noopener noreferrer">
          Python
        </a>
        . See the{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noopener noreferrer">
          Fetch API docs
        </a>{' '}
        for details on the JavaScript example. Use the navigation tabs to select your preferred language. For your
        convenience, these snippets can be instantly copied to streamline your{' '}
        <a href="https://en.wikipedia.org/wiki/System_integration" target="_blank" rel="noopener noreferrer">
          integration process
        </a>
        .
      </p>

      <div role="tablist" aria-label="Usage examples" className="tabs mb-4">
        {keys.map((key, idx) => (
          <button
            key={key}
            id={`usage-tab-${key}`}
            role="tab"
            aria-selected={activeTab === key}
            aria-controls={`usage-panel-${key}`}
            tabIndex={activeTab === key ? 0 : -1}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            className={`tab-button ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {examples[key].label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {keys.map((key) => (
          <div
            key={key}
            id={`usage-panel-${key}`}
            role="tabpanel"
            aria-labelledby={`usage-tab-${key}`}
            className={`tab-panel ${activeTab === key ? 'block' : 'hidden'}`}
          >
            <CodeBlock code={examples[key].code} language={examples[key].language} usePrism={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
