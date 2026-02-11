import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NewsletterSection } from './NewsletterSection';

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

describe('NewsletterSection', () => {
  it('renders title and description from memoized data', () => {
    render(<NewsletterSection />);
    expect(screen.getByText(/Curated elegance/i)).toBeTruthy();
    expect(screen.getByText(/Subscribe to receive updates/i)).toBeTruthy();
  });

  it('renders form elements', () => {
    render(<NewsletterSection />);
    expect(screen.getByLabelText(/Email Address/i)).toBeTruthy();
    expect(screen.getByText('Subscribe Now')).toBeTruthy();
  });

  it('renders disclaimer text', () => {
    render(<NewsletterSection />);
    expect(screen.getByText(/By subscribing you agree/i)).toBeTruthy();
  });
});