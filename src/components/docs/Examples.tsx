'use client';

import { type JSX, useState, useEffect, useRef } from 'react';

import { LuArrowUpRight } from 'react-icons/lu';

import { CodeBlock } from '@/components/CodeBlock';
import { getPermaLink } from '@/lib/utils/seo';

/**
 * Interface representing an example API request.
 */
interface Example {
  title: string;
  url: string;
}

// Get the canonical URL for constructing API request examples
const canonicalUrl: string = getPermaLink();

/**
 * Returns the full API endpoint URL with canonical base.
 *
 * @param {string} apiEndpoint - The API endpoint path (e.g., '/api/couplets').
 * @returns {string} Full URL with canonical base and endpoint.
 */
const getApiEndpointUrl = (apiEndpoint: string): string => canonicalUrl + apiEndpoint;

/**
 * Returns a curl command for the given URL.
 *
 * @param {string} url - The API endpoint path to curl.
 * @returns {string} Curl command string.
 */
const getCurlCommand = (url: string): string => `curl -X GET ${getApiEndpointUrl(url)}`;

/** Example API request configurations */
const examples: Example[] = [
  { title: '1. Fetch All Couplets', url: '/api/couplets' },
  { title: '2. Search for a Couplet', url: '/api/couplets?search_query=itna%20dijai' },
  { title: '3. Search with Content', url: '/api/couplets?search_query=wisdom&search_content=true' },
  { title: '4. Filter by Tags', url: '/api/couplets?tags=spiritual,life' },
  { title: '5. Filter by Category', url: '/api/couplets?category=philosophy' },
  { title: '6. Filter by Popular', url: '/api/couplets?is_popular=true' },
  { title: '7. Filter by Featured', url: '/api/couplets?is_featured=true' },
  { title: '8. Sort Results', url: '/api/couplets?sort_by=text_en&sort_order=asc' },
  { title: '9. Paginate Results', url: '/api/couplets?page=2&per_page=5' },
  {
    title: '10. Combining Multiple Filters',
    url: '/api/couplets?search_query=wisdom&search_content=true&tags=philosophy&is_popular=false&is_featured=false&sort_by=number&sort_order=desc&page=1&per_page=10',
  },
];

/**
 * Component that displays expandable API endpoint examples.
 * Shows code samples for different API requests with copy functionality.
 *
 * @returns {JSX.Element} - The rendered examples section
 */
export default function Examples(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);
  const headerRefs = useRef<Array<HTMLButtonElement | null>>([]);

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

  const actionElement = (example: Example) => {
    const fullUrl = getApiEndpointUrl(example.url);
    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-white px-3 py-1 text-xs"
        aria-label={`Try request: ${fullUrl}`}
      >
        Try request
        <LuArrowUpRight />
      </a>
    );
  };

  return (
    <section>
      <h2>API Endpoint Examples</h2>
      <p>Browse common API requests below. Click on a section to view the example and understand how it works.</p>

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
                    code={getCurlCommand(example.url)}
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
