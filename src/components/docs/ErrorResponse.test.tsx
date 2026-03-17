/**
 * Unit tests for error response docs, validating examples and status code guidance content.
 * @package vitest
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ErrorResponse from '@/components/docs/ErrorResponse';

// Keep error example assertions explicit to preserve troubleshooting guidance quality.
describe('ErrorResponse', () => {
  // Define a focused test case for one behavior.
  it('should render Error Response Format heading', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /error response format/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render Error Response Fields heading', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /error response fields/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render Common Error Responses heading', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByRole('heading', { name: /common error responses/i })).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render code field in error example', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getAllByText(/code/i).length).toBeGreaterThan(0);
  });

  // Define a focused test case for one behavior.
  it('should render error field in error example', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getAllByText(/error/i).length).toBeGreaterThan(0);
  });

  // Define a focused test case for one behavior.
  it('should render 400 error code', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getAllByText('400').length).toBeGreaterThan(0);
  });

  // Define a focused test case for one behavior.
  it('should render 404 error code', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render 500 error code', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render Bad Request description', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('Bad Request')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render Not Found description', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  // Define a focused test case for one behavior.
  it('should render Internal server error description', () => {
    render(<ErrorResponse />);

    // Assert the expected outcome for this scenario.
    expect(screen.getByText('Internal server error')).toBeInTheDocument();
  });
});
