import type { JSX } from 'react';

/**
 * Safely stringify JSON-LD data by escaping the less-than character to prevent XSS vulnerabilities.
 *
 * @param {unknown} data - The JSON-LD data to be stringified and escaped.
 * @returns {string} - The safely stringified JSON-LD data.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * A React component that renders JSON-LD structured data within a script tag.
 * It takes an array of objects as input and generates a JSON-LD graph with the appropriate context.
 * @param {object[]} data - An array of objects representing the JSON-LD graph to be rendered.
 * @returns {JSX.Element} - A script tag containing the JSON-LD structured data.
 */
export default function JsonLd({ data }: { data: object[] }): JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd({ '@context': 'https://schema.org', '@graph': data }) }}
    />
  );
}
