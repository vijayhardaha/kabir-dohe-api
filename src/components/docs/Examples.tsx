'use client';

import { useState, useEffect, useRef } from 'react';

import { CodeBlock } from '@/components/CodeBlock';
import { getCanonicalUrl } from '@/lib/utils/seo';

/**
 * Interface representing an example API request.
 */
interface IExample {
  title: string;
  code: string;
}

// Get the canonical URL for constructing API request examples
const canonicalUrl: string = getCanonicalUrl();

const examples: IExample[] = [
  { title: '1. Fetch All Couplets', code: 'GET ' + canonicalUrl + '/api/couplets' },
  { title: '2. Search for a Couplet', code: 'GET ' + canonicalUrl + '/api/couplets?search=love' },
  { title: '3. Search with Content', code: 'GET ' + canonicalUrl + '/api/couplets?search=wisdom&search_content=true' },
  { title: '4. Filter by Tags', code: 'GET ' + canonicalUrl + '/api/couplets?tags=spiritual,life' },
  { title: '5. Filter by Popularity', code: 'GET ' + canonicalUrl + '/api/couplets?is_popular=true' },
  { title: '6. Sort Results', code: 'GET ' + canonicalUrl + '/api/couplets?sort_by=text_en&sort_order=asc' },
  { title: '7. Paginate Results', code: 'GET ' + canonicalUrl + '/api/couplets?page=2&per_page=5' },
  {
    title: '8. Combining Multiple Filters',
    code:
      'GET '
      + canonicalUrl
      + '/api/couplets?search=wisdom&search_content=true&tags=philosophy&is_popular=false&sort_by=number&sort_order=desc&page=1&per_page=10',
  },
];

export function Examples(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Function to extract the API path from the code example
  const getApiUrl = (code: string): string => code.replace('GET ', '');

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);
  const headerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Update panel max-heights for smooth slide animation
  useEffect(() => {
    panelRefs.current.forEach((el, i) => {
      if (!el) return;
      if (openIndex === i) {
        const scroll = el.scrollHeight;
        el.style.maxHeight = scroll + 'px';
        el.style.opacity = '1';
      } else {
        el.style.maxHeight = '0px';
        el.style.opacity = '0';
      }
    });
  }, [openIndex]);

  const actionElement = (example: IExample) => (
    <a
      href={getApiUrl(example.code)}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline-white px-3 py-1 text-xs"
      aria-label={`Try request: ${getApiUrl(example.code)}`}
    >
      Try this request
    </a>
  );

  return (
    <section>
      <h2>Examples</h2>
      <p>Browse common API requests. Click a heading to expand an example.</p>

      <div className="space-y-4">
        {examples.map((example, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="">
              <button
                id={`example-header-${index}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`example-panel-${index}`}
                onClick={() => toggle(index)}
                ref={(el) => {
                  headerRefs.current[index] = el;
                }}
                onKeyDown={(e) => {
                  const max = examples.length;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = (index + 1) % max;
                    headerRefs.current[next]?.focus();
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = (index - 1 + max) % max;
                    headerRefs.current[prev]?.focus();
                  } else if (e.key === 'Home') {
                    e.preventDefault();
                    headerRefs.current[0]?.focus();
                  } else if (e.key === 'End') {
                    e.preventDefault();
                    headerRefs.current[examples.length - 1]?.focus();
                  }
                }}
                className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left ${
                  isOpen
                    ? 'bg-primary-500 border-primary-600 text-white'
                    : 'bg-primary-50 border-primary-200 text-primary-700'
                } `}
              >
                <span className="font-semibold">{example.title}</span>
                <span className="ml-2 text-sm">{isOpen ? '−' : '+'}</span>
              </button>

              <div
                id={`example-panel-${index}`}
                role="region"
                aria-labelledby={`example-header-${index}`}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                className="mt-2 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
                style={{ maxHeight: '0px', opacity: 0 }}
              >
                <div className="pt-2">
                  <CodeBlock
                    code={example.code}
                    language="http"
                    actionElement={actionElement(example)}
                    usePrism={true}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
