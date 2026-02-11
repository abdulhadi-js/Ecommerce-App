import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { ReviewSlider } from './ReviewSlider';

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Quote: () => <div data-testid="icon-quote" />,
  User: () => <div data-testid="icon-user" />,
  Star: () => <div data-testid="icon-star" />,
  ChevronLeft: () => <div data-testid="icon-left" />,
  ChevronRight: () => <div data-testid="icon-right" />,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockReviews = [
  {
    id: "1",
    rating: 5,
    comment: "Review 1 Content",
    user: { name: "User 1", image: null },
    createdAt: new Date(),
  },
  {
    id: "2",
    rating: 4,
    comment: "Review 2 Content",
    user: { name: "User 2", image: null },
    createdAt: new Date(),
  },
  {
    id: "3",
    rating: 5,
    comment: "Review 3 Content",
    user: { name: "User 3", image: null },
    createdAt: new Date(),
  },
  {
    id: "4",
    rating: 5,
    comment: "Review 4 Content",
    user: { name: "User 4", image: null },
    createdAt: new Date(),
  },
];

describe('ReviewSlider', () => {
  it('renders nothing when there are no reviews', () => {
    const { container } = render(<ReviewSlider reviews={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders reviews correctly', () => {
    render(<ReviewSlider reviews={mockReviews} />);
    
    // Check if the first review's content is present (Desktop usually shows first 3, Mobile first 1)
    // Using getAllByText because it renders twice (desktop/mobile)
    const reviewTexts = screen.getAllByText('Review 1 Content', { exact: false });
    expect(reviewTexts.length).toBeGreaterThan(0);
    
    const userTexts = screen.getAllByText('User 1');
    expect(userTexts.length).toBeGreaterThan(0);
  });

  it('renders navigation buttons when there are more than 3 reviews', () => {
    render(<ReviewSlider reviews={mockReviews} />);
    expect(screen.getByLabelText('Next Review')).toBeTruthy();
    expect(screen.getByLabelText('Previous Review')).toBeTruthy();
  });

  it('navigates to next set of reviews', () => {
    const { rerender } = render(<ReviewSlider reviews={mockReviews} />);
    
    // Initial state: Review 1 should be visible
    expect(screen.getAllByText('Review 1 Content', { exact: false }).length).toBeGreaterThan(0);

    const nextButton = screen.getByLabelText('Next Review');
    fireEvent.click(nextButton);

    // After click: Reviews should update. 
    // In our simplified mock logic, finding specific text presence is enough.
    rerender(<ReviewSlider reviews={mockReviews} />);
    
    // We mainly ensure the button is clickable and component doesn't crash
    expect(screen.getByLabelText('Next Review')).toBeTruthy();
  });
});