"use client";

import { useRef } from "react";

import { Highlight, themes } from "prism-react-renderer";
import PropTypes from "prop-types";

import { CopyButton } from "./CopyButton";

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
 * @returns {JSX.Element} A styled code block with copy functionality
 * @example
 * ```jsx
 * <CodeBlock code="console.log('Hello World');" language="javascript" />
 * <CodeBlock code="Some plain text" language="text" usePrism={false} />
 * <CodeBlock code="console.log('Hello');" language="javascript" actionElement={<button>Custom Action</button>} />
 * ```
 */
export function CodeBlock({ code, language, usePrism = false, actionElement }) {
  const codeRef = useRef(null);

  return (
    <div className="relative overflow-hidden rounded-md border border-slate-300">
      <div className="flex items-center justify-between border-b border-slate-300 bg-slate-100 px-4 py-2">
        <span className="font-mono text-sm font-semibold text-slate-600">{language}</span>
        <div className="flex items-center gap-2">
          {actionElement}
          <CopyButton textToCopy={code} />
        </div>
      </div>
      {usePrism ? (
        <Highlight theme={themes.github} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className="m-0 overflow-auto bg-slate-50 p-4" style={style}>
              <code ref={codeRef} className={`${className} font-mono`}>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line });
                  return (
                    <span key={i} {...lineProps}>
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
        <pre className="m-0 overflow-auto bg-slate-50 p-4">
          <code ref={codeRef} className="font-mono">
            {code}
          </code>
        </pre>
      )}
    </div>
  );
}

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  usePrism: PropTypes.bool,
  actionElement: PropTypes.node,
};
