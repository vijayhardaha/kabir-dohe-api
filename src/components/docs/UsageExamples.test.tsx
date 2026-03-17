/**
 * Unit tests for usage example tabs, validating navigation state and visible code panels.
 * @package vitest
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import UsageExamples from '@/components/docs/UsageExamples';

// Cover tab switches to ensure users can discover language-specific integration snippets.
describe('UsageExamples', () => {
  // Define a focused test case for one behavior.
  it('should Render Usage Examples heading', () => {
    render(<UsageExamples />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /usage examples/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Render cURL tab', () => {
    render(<UsageExamples />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('tab', { name: /curl/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Render JavaScript tab', () => {
    render(<UsageExamples />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('tab', { name: /javascript/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Render Python tab', () => {
    render(<UsageExamples />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('tab', { name: /python/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should Switch to JavaScript tab on click', async () => {
    render(<UsageExamples />);

    const jsTab = screen.getByRole('tab', { name: /javascript/i });
    fireEvent.click(jsTab);

    await waitFor(() => {
      const panel = document.querySelector('#usage-panel-javascript');
      // Assert the expected outcome for this scenario.
      expect(panel).toHaveClass('block');
    });
  });

  // Define a focused test case for one behavior.
  it('should Switch to Python tab on click', async () => {
    render(<UsageExamples />);

    const pythonTab = screen.getByRole('tab', { name: /python/i });
    fireEvent.click(pythonTab);

    await waitFor(() => {
      const panel = document.querySelector('#usage-panel-python');
      // Assert the expected outcome for this scenario.
      expect(panel).toHaveClass('block');
    });
  });

  // Define a focused test case for one behavior.
  it('should have link to fetch API docs', () => {
    render(<UsageExamples />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('link', { name: /fetch api docs/i })).toBeInTheDocument();
  });
});
