/**
 * Unit tests for the header component, validating key links and visible API branding.
 * @package vitest
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Header from '@/components/Header';

// Verify header semantics and navigation affordances that users rely on first.
describe('Header', () => {
  // Define a focused test case for one behavior.
  it('should render main heading', () => {
    render(<Header />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should contain API title', () => {
    render(<Header />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /Kabir Dohe API/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should have Try the API link', () => {
    render(<Header />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('link', { name: /Try the API/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should have GitHub link', () => {
    render(<Header />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('link', { name: /Source Code on GitHub/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should link to API endpoint', () => {
    render(<Header />);

    const apiLink = screen.getByRole('link', { name: /Try the API/i });
    // Assert the expected outcome for this scenario.
    expect(apiLink).toHaveAttribute('href', '/api/couplets');
  });
});
