import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ScrollToAnchor, resolveAnchorId, scrollToId } from './ScrollToAnchor';

// Drive requestAnimationFrame synchronously so the deferred scroll runs within
// the test tick. scrollToId polls across frames (retry-until-laid-out), so the
// mock must fire the callback each time it is scheduled — a recursive synchronous
// pump — and hand back a monotonic id so cancelAnimationFrame has something real.
let rafHandle = 0;
beforeEach(() => {
  rafHandle = 0;
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    rafHandle += 1;
    cb(rafHandle);
    return rafHandle;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

// jsdom always reports getBoundingClientRect().top === 0, which the poll would
// read as "already landed" and never scroll. Stub the element's rect to sit
// `offscreenTop`px down for the first `framesOffscreen` reads, then snap to 0 —
// modelling a target that starts below the fold and settles at the top once the
// (re-)scroll runs. Returns the scrollIntoView spy.
function stubRect(el: HTMLElement, offscreenTop: number, framesOffscreen: number) {
  let reads = 0;
  vi.spyOn(el, 'getBoundingClientRect').mockImplementation(() => {
    const top = reads < framesOffscreen ? offscreenTop : 0;
    reads += 1;
    return { top, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON() {} } as DOMRect;
  });
  return vi.spyOn(el, 'scrollIntoView');
}

describe('resolveAnchorId', () => {
  it('returns undefined when no anchor is given', () => {
    expect(resolveAnchorId(undefined)).toBeUndefined();
  });

  it('maps the edusarvam intent to the projects section id', () => {
    expect(resolveAnchorId('edusarvam')).toBe('projects');
  });

  it('maps the experience-wells-fargo intent to the experience section id', () => {
    expect(resolveAnchorId('experience-wells-fargo')).toBe('experience');
  });

  it('falls back to the intent itself for a plain section id', () => {
    expect(resolveAnchorId('skills')).toBe('skills');
  });
});

describe('scrollToId', () => {
  it('is a no-op when id is undefined and returns a callable canceller', () => {
    // No element, no throw; returns a cancel fn that is safe to call.
    const cancel = scrollToId(undefined);
    expect(typeof cancel).toBe('function');
    expect(() => cancel()).not.toThrow();
  });

  it('polls (does not scroll) while the target element is not in the DOM', () => {
    const raf = window.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>;
    scrollToId('does-not-exist');
    // rAF scheduled up to the bound, but no element to scroll — no throw. It must
    // have retried more than once (the whole point of the retry-until-laid-out fix).
    expect(raf.mock.calls.length).toBeGreaterThan(1);
  });

  it('scrolls the target to the top (block:start, instant) when it is below the fold', () => {
    const el = document.createElement('div');
    el.id = 'skills';
    document.body.appendChild(el);
    // Sits 500px down for a few frames, then settles at top.
    const spy = stubRect(el, 500, 3);
    scrollToId('skills');
    expect(spy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('re-scrolls across frames as the page grows, then stops once the target is parked at top', () => {
    // Manual frame pump modelling late layout: the target keeps getting pushed
    // down (page still growing) for several frames before it lands at the top.
    (window.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>).mockRestore();
    const queue: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      queue.push(cb);
      return queue.length;
    });
    const flushFrame = () => {
      const cb = queue.shift();
      if (cb) cb(performance.now());
    };

    const el = document.createElement('div');
    el.id = 'grow-target';
    document.body.appendChild(el);
    // Offscreen (top=300) for the first 4 reads (page growing), then parked at 0.
    const spy = stubRect(el, 300, 4);

    scrollToId('grow-target');
    // Pump generously past the growing phase + the settle window (the poll stops
    // rescheduling once parked, so extra flushes drain to no-ops).
    for (let i = 0; i < 20; i++) flushFrame();
    // It re-issued the scroll multiple times while the page was growing…
    expect(spy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    expect(spy.mock.calls.length).toBeGreaterThan(1);
    const callsAtLand = spy.mock.calls.length;
    // …and once parked at top for the settle window, it stops re-scrolling.
    for (let i = 0; i < 10; i++) flushFrame();
    expect(spy.mock.calls.length).toBe(callsAtLand);
  });

  it('waits for a late-mounting target: no scroll before it exists, scrolls after it mounts', () => {
    (window.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>).mockRestore();
    const queue: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      queue.push(cb);
      return queue.length;
    });
    const flushFrame = () => {
      const cb = queue.shift();
      if (cb) cb(performance.now());
    };

    scrollToId('late-target');
    // First frame: element absent → nothing to scroll, another frame scheduled.
    flushFrame();
    expect(document.getElementById('late-target')).toBeNull();

    // Now the lazy section mounts, below the fold.
    const el = document.createElement('div');
    el.id = 'late-target';
    document.body.appendChild(el);
    const spy = stubRect(el, 400, 3);

    for (let i = 0; i < 6 && spy.mock.calls.length === 0; i++) flushFrame();
    expect(spy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('cancel() aborts the pending poll so a later frame does not scroll', () => {
    (window.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>).mockRestore();
    const queue: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      queue.push(cb);
      return queue.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const flushFrame = () => {
      const cb = queue.shift();
      if (cb) cb(performance.now());
    };

    const el = document.createElement('div');
    el.id = 'cancel-target';
    document.body.appendChild(el);
    // Would keep re-scrolling forever (never parks) if not cancelled.
    const spy = stubRect(el, 300, 999);

    const cancel = scrollToId('cancel-target');
    flushFrame(); // first frame: sees it offscreen, scrolls once, reschedules
    const callsBeforeCancel = spy.mock.calls.length;
    cancel(); // abort
    flushFrame(); // any queued frame must be a no-op now
    flushFrame();
    // No further scrolls after cancel.
    expect(spy.mock.calls.length).toBe(callsBeforeCancel);
  });
});

describe('ScrollToAnchor', () => {
  it('renders nothing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToAnchor />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('does not scroll when there is no hash', () => {
    // Use an id that no other test injects, so this asserts ScrollToAnchor's
    // own behavior for a hash-free location without cross-test interference.
    const el = document.createElement('div');
    el.id = 'no-hash-target';
    document.body.appendChild(el);
    const spy = vi.spyOn(el, 'scrollIntoView');
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToAnchor />
      </MemoryRouter>
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('scrolls to the hash target on mount when a hash is present', () => {
    const el = document.createElement('div');
    el.id = 'skills';
    document.body.appendChild(el);
    // Below the fold so the poll issues the (instant, block:start) scroll.
    const spy = stubRect(el, 500, 3);
    render(
      <MemoryRouter initialEntries={['/#skills']}>
        <ScrollToAnchor />
      </MemoryRouter>
    );
    expect(spy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });
});
