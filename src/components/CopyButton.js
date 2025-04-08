"use client";

import { useState } from "react";

import PropTypes from "prop-types";

/**
 * Client-side component that provides copy-to-clipboard functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.textToCopy - The text to be copied to clipboard
 * @returns {JSX.Element} A button with copy functionality
 */
export function CopyButton({ textToCopy }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 500);
  };

  return (
    <button
      className="btn btn-secondary cursor-pointer rounded px-2 py-1 text-xs"
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
    >
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
}

CopyButton.propTypes = {
  /**
   * The text to be copied to clipboard
   */
  textToCopy: PropTypes.string.isRequired,
};
