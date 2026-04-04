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
    expect(screen.getByRole('link', { name: /Fetch API documentation/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should default to cURL tab active', () => {
    render(<UsageExamples />);

    const curlTab = screen.getByRole('tab', { name: /curl/i });
    // Assert the expected outcome for this scenario.
    expect(curlTab).toHaveAttribute('aria-selected', 'true');
    expect(curlTab).toHaveAttribute('tabIndex', '0');

    const panel = document.querySelector('#usage-panel-curl');
    expect(panel).toHaveClass('block');
    expect(panel).toHaveAttribute('role', 'tabpanel');
  });

  // Define a focused test case for one behavior.
  it('should switch to cURL tab on click', async () => {
    render(<UsageExamples />);

    // First switch to JavaScript tab
    const jsTab = screen.getByRole('tab', { name: /javascript/i });
    fireEvent.click(jsTab);

    // Then switch to cURL
    const curlTab = screen.getByRole('tab', { name: /curl/i });
    fireEvent.click(curlTab);

    await waitFor(() => {
      // Assert the expected outcome for this scenario.
      expect(curlTab).toHaveAttribute('aria-selected', 'true');
      expect(jsTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  // Define a focused test case for one behavior.
  it('should hide other panels when switching tabs', async () => {
    render(<UsageExamples />);

    const pythonTab = screen.getByRole('tab', { name: /python/i });
    fireEvent.click(pythonTab);

    await waitFor(() => {
      const curlPanel = document.querySelector('#usage-panel-curl');
      const jsPanel = document.querySelector('#usage-panel-javascript');
      const pythonPanel = document.querySelector('#usage-panel-python');

      // Assert the expected outcome for this scenario.
      expect(curlPanel).toHaveClass('hidden');
      expect(jsPanel).toHaveClass('hidden');
      expect(pythonPanel).toHaveClass('block');
    });
  });

  // Define a focused test case for one behavior.
  it('should have correct aria-controls on tabs', () => {
    render(<UsageExamples />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('tab', { name: /curl/i })).toHaveAttribute('aria-controls', 'usage-panel-curl');
    expect(screen.getByRole('tab', { name: /javascript/i })).toHaveAttribute('aria-controls', 'usage-panel-javascript');
    expect(screen.getByRole('tab', { name: /python/i })).toHaveAttribute('aria-controls', 'usage-panel-python');
  });

  // Define a focused test case for one behavior.
  it('should have tablist with aria-label', () => {
    render(<UsageExamples />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Usage examples');
  });
});
