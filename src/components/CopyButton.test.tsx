/**
 * Unit tests for the copy button component, verifying clipboard interactions and UI feedback.
 * @package vitest
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CopyButton } from '@/components/CopyButton';

// Mock navigator.clipboard to observe writeText calls without touching real clipboard.
const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };

Object.assign(navigator, { clipboard: mockClipboard });

// Group CopyButton assertions to catch regressions in copy behavior and labels.
describe('CopyButton', () => {
  // Reset clipboard mock between tests to keep assertions isolated.
  beforeEach(() => {
    mockClipboard.writeText.mockClear();
  });

  // Define a focused test case for rendering the button.
  it('should render copy button', () => {
    render(<CopyButton textToCopy="test" />);
    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('button', { name: /copy code to clipboard/i })).toBeInTheDocument();
  });

  // Define a focused test case for initial label state.
  it('should show Copy text initially', () => {
    render(<CopyButton textToCopy="test" />);
    // Assert the expected outcome for this scenario.
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  // Define a focused test case for post-click UI feedback.
  it('should show Copied! after click', async () => {
    render(<CopyButton textToCopy="test" />);

    const button = screen.getByRole('button', { name: /copy code to clipboard/i });
    fireEvent.click(button);

    // Wait for the UI to update and assert the expected outcome.
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  // Define a focused test case for clipboard write behavior.
  it('should call clipboard.writeText with correct text', async () => {
    render(<CopyButton textToCopy="hello world" />);

    const button = screen.getByRole('button', { name: /copy code to clipboard/i });
    fireEvent.click(button);

    // Wait for clipboard write to be called and assert the expected argument.
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('hello world');
    });
  });
});
