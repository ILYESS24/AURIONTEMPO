/**
 * Component Tests
 * 
 * Tests for common and auth components.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Mock Clerk hooks
vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(() => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user-id',
  })),
  useUser: vi.fn(() => ({
    isLoaded: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
  })),
  SignIn: vi.fn(() => <div data-testid="clerk-sign-in">Sign In</div>),
  SignUp: vi.fn(() => <div data-testid="clerk-sign-up">Sign Up</div>),
  UserButton: vi.fn(() => <div data-testid="clerk-user-button">User</div>),
  ClerkProvider: vi.fn(({ children }) => <>{children}</>),
}));

describe('Component Tests', () => {
  // ===========================================================================
  // ERROR BOUNDARY
  // ===========================================================================
  describe('ErrorBoundary', () => {
    // Suppress console.error for error boundary tests
    const originalError = console.error;
    beforeAll(() => {
      console.error = vi.fn();
    });
    afterAll(() => {
      console.error = originalError;
    });

    const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    };

    it('should render children when no error', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Child content</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render error UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });
  });
});
