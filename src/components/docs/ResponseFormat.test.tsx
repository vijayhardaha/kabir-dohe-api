/**
 * Unit tests for response format docs, ensuring field descriptions and links remain accurate.
 * @package vitest
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ResponseFormat from '@/components/docs/ResponseFormat';

// Verify response field descriptions because consumers rely on these semantics for integration.
describe('ResponseFormat', () => {
  // Define a focused test case for one behavior.
  it('should Render Response Format heading', () => {
    render(<ResponseFormat />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /response format/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Render Response Fields heading', () => {
    render(<ResponseFormat />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /response fields/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Render success field description', () => {
    render(<ResponseFormat />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText(/Boolean indicating if the request was successful/i)).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Render total field description', () => {
    render(<ResponseFormat />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText(/Total number of records matching the query/i)).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Render pagination field description', () => {
    render(<ResponseFormat />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText(/Boolean indicating if pagination is enabled/i)).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Render CodeBlock component', () => {
    render(<ResponseFormat />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('button', { name: /copy code to clipboard/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should have link to query parameters', () => {
    render(<ResponseFormat />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('link', { name: /query parameters/i })).toHaveAttribute('href', '#query-parameters');
  });
});
