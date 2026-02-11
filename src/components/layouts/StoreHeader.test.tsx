import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, afterEach } from 'vitest';
import { StoreHeader } from './StoreHeader';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/lib/store/features/cartSlice';

// Mocks
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null }),
  signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

describe('StoreHeader', () => {
  const originalConsoleError = console.error;
  
  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders without "<a> cannot be a descendant of <a>" error', () => {
    const consoleErrorMock = vi.fn();
    console.error = consoleErrorMock;

    render(
      <Provider store={store}>
        <StoreHeader />
      </Provider>
    );

    // Check if the specific React error was logged
    const errors = consoleErrorMock.mock.calls.map(args => args.join(' '));
    const nestedLinkError = errors.find(err => err.includes('<a> cannot be a descendant of <a>') || err.includes('cannot appear as a descendant of'));
    
    // In TDD: we expect this to exist BEFORE the fix, but the test goal is "verify error resolution".
    // So if I run this now, I expect `nestedLinkError` to be truthy. 
    // After fix, it should be falsy.
    
    // For now, I'll log it to confirm, then fail if it exists.
    if (nestedLinkError) {
      throw new Error(`Found nested link error: ${nestedLinkError}`);
    }
  });
});