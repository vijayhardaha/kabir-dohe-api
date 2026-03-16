'use client';

import { useRef } from 'react';

import { Highlight, themes } from 'prism-react-renderer';

import { CopyButton } from './CopyButton';

/**
 * Interface for the CodeBlock component props.
 */
interface ICodeBlockProps {
  code: string;
  language: string;
  usePrism?: boolean;
  actionElement?: React.ReactNode;
}

/**
 * CodeBlock component displays code snippets with syntax highlighting
 * and provides a copy-to-clipboard functionality.
 * Uses a separate client component for copy functionality.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.code - The code snippet to be displayed
 * @param {string} props.language - The programming language for syntax highlighting (e.g., 'javascript', 'css', 'html')
 * @param {boolean} [props.usePrism=true] - Whether to use Prism syntax highlighting or display plain text
 * @param {React.ReactNode} [props.actionElement] - Optional additional action element to display alongside the copy button
 * @returns {React.JSX.Element} A styled code block with copy functionality
 * @example
 * ```jsx
 * <CodeBlock code="console.log('Hello World');" language="javascript" />
 * <CodeBlock code="Some plain text" language="text" usePrism={false} />
 * <CodeBlock code="console.log('Hello');" language="javascript" actionElement={<button>Custom Action</button>} />
 * ```
 */
export function CodeBlock({ code, language, usePrism = false, actionElement }: ICodeBlockProps): React.JSX.Element {
  const codeRef = useRef<HTMLElement | null>(null);

  return (
    <div className="border-primary-200 relative overflow-hidden rounded-md border not-last:mb-8">
      <div className="border-primary-200 bg-primary-500 flex items-center justify-between border-b px-4 py-2">
        <span className="font-semibold text-white">{language}</span>
        <div className="flex items-center gap-2">
          {actionElement}
          <CopyButton textToCopy={code} />
        </div>
      </div>
      {usePrism ? (
        <Highlight theme={themes.github} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className="bg-primary-50 m-0 overflow-auto p-4" style={style}>
              <code ref={codeRef} className={`${className} text-primary-900 font-mono`}>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line });
                  return (
                    <span key={i} {...lineProps} className="block">
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token });
                        return <span key={key} {...tokenProps} />;
                      })}
                    </span>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
      ) : (
        <pre className="bg-primary-50 m-0 overflow-auto p-4">
          <code ref={codeRef} className="text-primary-900 font-mono">
            {code}
          </code>
        </pre>
      )}
    </div>
  );
}
