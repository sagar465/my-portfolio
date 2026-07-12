import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Maps a route "anchor intent" (set on path-based routes like /projects/edusarvam)
 * to the id of the on-page section it should scroll to. Architecture §2.2 route
 * table passes these as the <Homepage anchor="…"/> prop; Homepage forwards the
 * value here via `resolveAnchorId`.
 */
const ANCHOR_ID_MAP: Record<string, string> = {
  edusarvam: 'projects',
  'experience-wells-fargo': 'experience',
};

/**
 * Resolve a route anchor intent to the target element id, falling back to the
 * intent itself so a plain section id (e.g. "skills") also resolves.
 */
export function resolveAnchorId(anchor: string | undefined): string | undefined {
  if (!anchor) return undefined;
  return ANCHOR_ID_MAP[anchor] ?? anchor;
}

/**
 * Max number of animation frames to poll before giving up. The deep-link targets
 * are `React.lazy` + `<Suspense>` sections: on the first frames neither the target
 * nor the sections ABOVE it have laid out, so the document keeps growing and the
 * target's absolute position keeps moving. A one-shot rAF scroll lands a few px in
 * and never re-fires; worse, a scroll aimed at an early (stale) position ends up
 * far from the section once the page grows. So we RE-scroll each frame until the
 * target actually sits at the top of the viewport AND has held there — self-
 * correcting against late growth. ~90 frames ≈ 1.5s at 60fps — bounded,
 * deterministic, no arbitrary long fixed timeout.
 */
const MAX_SCROLL_ATTEMPTS = 90;

/**
 * Consecutive frames the target must already be at its destination (top ≈ 0)
 * before we treat the layout as settled and stop polling.
 */
const SETTLED_FRAMES_REQUIRED = 3;

/**
 * How close (px) the target's viewport-top must be to the top before we consider
 * it "landed". Generous enough to absorb sub-pixel rounding + any fixed header the
 * browser accounts for, tight enough that a stale/short scroll never qualifies.
 */
const LANDED_TOLERANCE_PX = 4;

/**
 * Scroll an element (by id) to the top of the viewport once it exists AND the
 * page has finished laying out around it. Resilient to late layout: the deep-link
 * targets are lazy + Suspense sections, and the sections above them mount late too,
 * so the target's position keeps moving for many frames. We poll across frames,
 * re-issuing the scroll each frame, until the target's `getBoundingClientRect().top`
 * is at the destination for a few consecutive frames (settled) — self-correcting
 * as the document grows. Uses instant scrolling during the poll so measurement is
 * not fighting an in-flight smooth animation.
 *
 * No-op if the id is absent. Returns a cancel function so callers (effects) can
 * abort the pending poll on unmount / when the anchor changes — no leaked rAF.
 *
 * Exported for callers that scroll on a path-anchor intent (Homepage) as well as
 * the URL-hash consumer (ScrollToAnchor).
 */
export function scrollToId(id: string | undefined): () => void {
  if (!id) return () => {};

  let rafId = 0;
  let cancelled = false;
  let attempts = 0;
  let settledFrames = 0;

  const tick = () => {
    if (cancelled) return;
    attempts += 1;

    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top;
      if (Math.abs(top) <= LANDED_TOLERANCE_PX) {
        // Already at the destination this frame → count it as settled.
        settledFrames += 1;
      } else {
        // Not there (or the page grew and pushed it) → (re-)scroll and reset.
        settledFrames = 0;
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }

      if (settledFrames >= SETTLED_FRAMES_REQUIRED) return; // laid out + parked
    }

    if (attempts < MAX_SCROLL_ATTEMPTS) {
      rafId = requestAnimationFrame(tick);
    } else if (el) {
      // Bounded out but the element exists — make a final best-effort landing.
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
}

/**
 * Effect-only component mounted once inside the router shell. On any change to
 * the URL hash (e.g. arriving at `/#skills` or `/aigentloop#gate-1`), it scrolls
 * the target element into view. Path-based anchors are handled by <Homepage/>
 * via `scrollToId` (architecture §1.4). Renders nothing.
 */
export function ScrollToAnchor() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    // hash includes the leading '#'. scrollToId polls across frames until the
    // (possibly lazy) target lays out; cancel the pending poll on unmount / hash
    // change so no rAF leaks.
    const cancel = scrollToId(hash.slice(1));
    return cancel;
  }, [hash]);

  return null;
}
