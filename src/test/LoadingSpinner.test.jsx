import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const testText = 'Loading test...';
    render(<LoadingSpinner text={testText} />);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('applies correct size class', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    expect(container.querySelector('.spinner-large')).toBeInTheDocument();
  });

  it('defaults to medium size', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.spinner-medium')).toBeInTheDocument();
  });
});