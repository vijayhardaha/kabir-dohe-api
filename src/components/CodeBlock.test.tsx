/**
 * Unit tests for the code block component, validating rendering modes and interactive actions.
 * @package vitest
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CodeBlock } from '@/components/CodeBlock';

// Exercise all rendering paths to prevent regressions in highlighted and plain text output.
describe('CodeBlock', () => {
  // Define a focused test case for one behavior.
  it('should render code with language label', () => {
    render(<CodeBlock code="console.log('hello')" language="javascript" />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render plain text when usePrism is false', () => {
    render(<CodeBlock code="plain text" language="text" usePrism={false} />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('plain text')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render code with syntax highlighting when usePrism is true', () => {
    render(<CodeBlock code="const x = 1;" language="javascript" usePrism={true} />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render CopyButton', () => {
    render(<CodeBlock code="test code" language="text" />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('button', { name: /copy code to clipboard/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render custom action element when provided', () => {
    render(
      <CodeBlock code="test code" language="text" actionElement={<button data-testid="custom-action">Custom</button>} />
    );

    // Assert the expected outcome for this scenario.
    expect(screen.getByTestId('custom-action')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should set language class on code element', () => {
    const { container } = render(<CodeBlock code="test" language="python" usePrism={true} />);
    const codeElement = container.querySelector('code');
    // Assert the expected outcome for this scenario.
    expect(codeElement).toHaveClass('language-python');
  });
});
