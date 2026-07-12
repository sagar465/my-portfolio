// Vitest global setup — registers jest-dom matchers and jsdom shims the app
// relies on (scrollIntoView + matchMedia are absent in jsdom).
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom does not implement scrollIntoView — ScrollToAnchor + Header call it.
// Define it as a plain no-op (NOT a shared spy) so individual tests can spy on
// their own elements without a module-level spy inflating call counts.
Element.prototype.scrollIntoView = function scrollIntoView() {
  /* no-op in jsdom */
};

// jsdom does not implement IntersectionObserver — motion/react's whileInView
// (used by <Section>) needs it.
if (!('IntersectionObserver' in globalThis)) {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  // @ts-expect-error assigning a test double onto the global
  globalThis.IntersectionObserver = MockIntersectionObserver;
  // @ts-expect-error keep window in sync for code reading window.IntersectionObserver
  window.IntersectionObserver = MockIntersectionObserver;
}

// jsdom does not implement matchMedia — App / useReducedMotion read it.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
