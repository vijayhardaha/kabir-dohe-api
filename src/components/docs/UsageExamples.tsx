'use client';

import { useState, useRef } from 'react';

import { CodeBlock } from '@/components/CodeBlock';
import { cn } from '@/lib/utils/classnames';
import { getPermaLink } from '@/lib/utils/seo';

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

export default function UsageExamples(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ExampleKey>('curl');

  const keys = Object.keys({ curl: 1, javascript: 1, python: 1 }) as ExampleKey[];
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const examples: Record<ExampleKey, Example> = {
    curl: {
      label: 'cURL',
      code: 'curl -X GET "' + getPermaLink() + '/api/couplets?tags=devotion&per_page=5"',
      language: 'bash',
    },
    javascript: {
      label: 'JavaScript',
      code:
        'fetch("'
        + getPermaLink()
        + '/api/couplets?tags=devotion&per_page=5")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));',
      language: 'javascript',
    },
    python: {
      label: 'Python',
      code:
        'import requests\n\nresponse = requests.get("'
        + getPermaLink()
        + '/api/couplets", params={\n  "tags": "devotion",\n  "per_page": 5\n})\n\ndata = response.json()\nprint(data)',
      language: 'python',
    },
  };

  return (
    <section>
      <h2>Usage Examples</h2>

      <p>
        Explore simple usage examples of the Kabir Dohe API in different environments like{' '}
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
        .
      </p>

      <p>
        These examples help you understand how to fetch and use dohe in your application. For JavaScript, you can also
        check the{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noopener noreferrer">
          Fetch API documentation
        </a>{' '}
        for more details.
      </p>

      <p>
        Use the tabs to switch between languages. All code snippets are easy to copy and help you quickly integrate the
        API into your project.
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
            className={cn('tab-button', activeTab === key && 'active')}
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
            className={cn('tab-panel', activeTab === key ? 'block' : 'hidden')}
          >
            <CodeBlock code={examples[key].code} language={examples[key].language} usePrism={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
