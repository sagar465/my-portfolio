/**
 * useReducedMotion.test.tsx — the hook returns the reactive value and updates on a
 * simulated `matchMedia` change (AC-5.3 support at the logic level). NO network,
 * nothing paid. `matchMedia` is mocked with a controllable, listener-backed double.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

type ChangeListener = (event: MediaQueryListEvent) => void;

/**
 * A controllable matchMedia double: it records `change` listeners and exposes
 * `emit(matches)` so a test can flip the OS preference and assert the hook reacts.
 */
function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<ChangeListener>();
  let matches = initialMatches;

  const mql = {
    get matches() {
      return matches;
    },
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn((_: 'change', cb: ChangeListener) => {
      listeners.add(cb);
    }),
    removeEventListener: vi.fn((_: 'change', cb: ChangeListener) => {
      listeners.delete(cb);
    }),
    // legacy no-ops (present so the shape matches MediaQueryList)
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  const matchMedia = vi.fn().mockReturnValue(mql);
  window.matchMedia = matchMedia as unknown as typeof window.matchMedia;

  return {
    mql,
    emit(next: boolean) {
      matches = next;
      for (const cb of listeners) {
        cb({ matches: next } as MediaQueryListEvent);
      }
    },
    listenerCount: () => listeners.size,
  };
}

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

describe('useReducedMotion', () => {
  it('returns false when the user does NOT prefer reduced motion', () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when the user prefers reduced motion', () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates reactively when the preference changes to reduce', () => {
    const mm = installMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => mm.emit(true));
    expect(result.current).toBe(true);
  });

  it('updates reactively when the preference changes back to no-preference', () => {
    const mm = installMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);

    act(() => mm.emit(false));
    expect(result.current).toBe(false);
  });

  it('subscribes on mount and cleans up its listener on unmount', () => {
    const mm = installMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());
    expect(mm.listenerCount()).toBe(1);
    unmount();
    expect(mm.listenerCount()).toBe(0);
  });

  it('falls back to false when matchMedia is unavailable (SSR-safe)', () => {
    // @ts-expect-error — simulate an environment without matchMedia.
    window.matchMedia = undefined;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
