/**
 * `useReducedMotion` — a reactive hook wrapping
 * `matchMedia('(prefers-reduced-motion: reduce)')` (architecture §4.1).
 *
 * Unlike the one-shot read in `App.tsx:49`, this SUBSCRIBES to `change` events so
 * the value updates live if the OS setting flips, and cleans up its listener on
 * unmount. Its first consumer is the flagship engine's duration collapse (P4's
 * Pipeline reads it to make every animated state reachable/legible under reduced
 * motion — AC-5.3); P4 also consumes it in the UI. SSR/no-`matchMedia`
 * environments fall back to `false` (motion allowed).
 */

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Read the current preference, tolerating environments without `matchMedia`. */
function readPreference(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * Returns `true` when the user prefers reduced motion, updating reactively when
 * the OS-level setting changes.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(readPreference);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);

    // Sync once on mount in case the value changed between the initial render and
    // the effect (e.g. hydration).
    setReduced(mql.matches);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
