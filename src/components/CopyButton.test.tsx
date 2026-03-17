/**
 * Unit tests for the copy button component, validating clipboard behavior and user feedback.
 * @package vitest
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CopyButton } from '@/components/CopyButton';

// Mock clipboard writes once so interaction tests can assert browser API usage deterministically.
const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };

Object.assign(navigator, { clipboard: mockClipboard });

// Group related test behavior in this suite.
describe('CopyButton', () => {
  beforeEach(() => {
    mockClipboard.writeText.mockClear();
  });

  // Define a focused test case for one behavior.
  it('should render copy button', () => {
    render(<CopyButton textToCopy="test" />);
    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('button', { name: /copy code to clipboard/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should show Copy text initially', () => {
    render(<CopyButton textToCopy="test" />);
    // Assert the expected outcome for this scenario.
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should show Copied! after click', async () => {
    render(<CopyButton textToCopy="test" />);

    const button = screen.getByRole('button', { name: /copy code to clipboard/i });
    fireEvent.click(button);

    await waitFor(() => {
      // Assert the expected outcome for this scenario.
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  // Define a focused test case for one behavior.
  it('should call clipboard.writeText with correct text', async () => {
    render(<CopyButton textToCopy="hello world" />);

    const button = screen.getByRole('button', { name: /copy code to clipboard/i });
    fireEvent.click(button);

    await waitFor(() => {
      // Assert the expected outcome for this scenario.
      expect(mockClipboard.writeText).toHaveBeenCalledWith('hello world');
    });
  });
});
