/**
 * Unit tests for the introduction docs section, ensuring core links and headings stay visible.
 * @package vitest
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Introduction from '@/components/docs/Introduction';

// Validate introductory documentation content because it anchors first-time API understanding.
describe('Introduction', () => {
  // Define a focused test case for one behavior.
  it('should render section with id introduction', () => {
    render(<Introduction />);

    const section = document.querySelector('#introduction');
    // Assert the expected outcome for this scenario.
    expect(section).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render main heading', () => {
    render(<Introduction />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should contain API name', () => {
    render(<Introduction />);

    // Assert the expected outcome for this scenario.
    expect(screen.getAllByText(/Kabir Dohe API/i).length).toBeGreaterThan(0);
  });

  // Define a focused test case for one behavior.
  it('should contain link to API endpoint', () => {
    render(<Introduction />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('link', { name: /2500 dohas/i })).toHaveAttribute('href', '/api/couplets');
  });

  // Define a focused test case for one behavior.
  it('should contain link to Wikipedia', () => {
    render(<Introduction />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('link', { name: /Sant Kabir Das/i })).toHaveAttribute(
      'href',
      'https://en.wikipedia.org/wiki/Kabir'
    );
  });
});
