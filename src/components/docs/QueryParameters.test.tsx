/**
 * Unit tests for query parameter docs, checking table structure and parameter metadata rendering.
 * @package vitest
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import QueryParameters from '@/components/docs/QueryParameters';

// Use representative parameters so table assertions reflect real endpoint documentation behavior.
const mockParameters = [
  { name: 'search', type: 'string', default: '', description: 'Search for couplets' },
  { name: 'page', type: 'number', default: 1, description: 'Page number' },
  { name: 'is_popular', type: 'boolean', default: false, description: 'Filter by popular' },
];

// Group related test behavior in this suite.
describe('QueryParameters', () => {
  // Define a focused test case for one behavior.
  it('should render section with query parameters heading', () => {
    render(<QueryParameters parameters={mockParameters} />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /query parameters/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render table with headers', () => {
    render(<QueryParameters parameters={mockParameters} />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('columnheader', { name: /type/i })).toBeInTheDocument();
    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('columnheader', { name: /default/i })).toBeInTheDocument();
    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('columnheader', { name: /description/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render parameter rows', () => {
    render(<QueryParameters parameters={mockParameters} />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('search')).toBeInTheDocument();
    // Assert the expected outcome for this scenario.
    expect(screen.getByText('page')).toBeInTheDocument();
    // Assert the expected outcome for this scenario.
    expect(screen.getByText('is_popular')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render correct types', () => {
    render(<QueryParameters parameters={mockParameters} />);

    // Assert the expected outcome for this scenario.
    expect(screen.getAllByText('string').length).toBeGreaterThan(0);
    // Assert the expected outcome for this scenario.
    expect(screen.getAllByText('number').length).toBeGreaterThan(0);
    // Assert the expected outcome for this scenario.
    expect(screen.getAllByText('boolean').length).toBeGreaterThan(0);
  });

  // Define a focused test case for one behavior.
  it('should render descriptions', () => {
    render(<QueryParameters parameters={mockParameters} />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('Search for couplets')).toBeInTheDocument();
    // Assert the expected outcome for this scenario.
    expect(screen.getByText('Page number')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render empty table when no parameters', () => {
    render(<QueryParameters parameters={[]} />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /query parameters/i })).toBeInTheDocument();
  });
});
