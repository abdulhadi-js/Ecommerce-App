import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { ThemeProvider } from './ThemeProvider';

// Mock next-themes
vi.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...props }: any) => <div data-testid="theme-provider" {...props}>{children}</div>,
}));

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div data-testid="child">Child Content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeTruthy();
    expect(screen.getByText('Child Content')).toBeTruthy();
  });

  it('passes props to NextThemesProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div />
      </ThemeProvider>
    );
    
    const provider = screen.getByTestId('theme-provider');
    expect(provider.getAttribute('attribute')).toBe('class');
    expect(provider.getAttribute('defaultTheme')).toBe('dark');
  });
});