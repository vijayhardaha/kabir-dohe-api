/**
 * Unit tests for the footer component, ensuring attribution links and copyright details render.
 * @package vitest
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Footer from '@/components/Footer';

// Validate persistent footer content to protect legal text and attribution references.
describe('Footer', () => {
  // Define a focused test case for one behavior.
  it('should render footer element', () => {
    render(<Footer />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should contain author name', () => {
    render(<Footer />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText(/Vijay Hardaha/i)).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should contain Next.js link', () => {
    render(<Footer />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText(/Next\.js/i)).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should contain Tailwind CSS link', () => {
    render(<Footer />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText(/Tailwind CSS/i)).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should contain copyright text', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    // Assert the expected outcome for this scenario.
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });
});
