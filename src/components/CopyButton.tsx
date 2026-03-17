'use client';

import { useState } from 'react';

/**
 * Interface for the CopyButton component props.
 */
interface ICopyButtonProps {
  textToCopy: string;
}

/**
 * Client-side component that provides copy-to-clipboard functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.textToCopy - The text to be copied to clipboard
 * @returns {React.JSX.Element} A button with copy functionality
 */
export function CopyButton({ textToCopy }: ICopyButtonProps): React.JSX.Element {
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Handles the copy action when the button is clicked.
   * It copies the text to the clipboard and updates the state to show a "Copied!" message.
   * The message disappears after 500 milliseconds.
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <button
      className="btn btn-white min-w-16 px-2 py-1 text-xs"
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  );
}
