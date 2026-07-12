import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Pipeline } from './Pipeline';
import { WEATHER_DASHBOARD_AGENTS, FINAL_MESSAGE } from './engine/scenario';
import { SHORT_LABEL } from './AgentCard';
import type { AgentId } from './engine/types';

// The TICK/auto-play loops use setTimeout; drive them deterministically with fake
// timers. handleReset uses requestAnimationFrame for focus — stub it to fire
// synchronously so reset focus behaviour is testable under fake timers.
beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** The page-variant per-tick delay (see Pipeline TICK_MS.page). */
const TICK_DELAY = 1200;
/** Passive auto-run start beat + gate hold + end hold (see Pipeline constants, D-012). */
const START_DELAY = 700;
const GATE_HOLD = 2000;
const END_HOLD = 3200;

/** Advance fake time by `ms`, wrapped in act() so effects/renders flush. */
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

/** Advance the TICK loop by `n` steps (each a full per-tick delay). */
function ticks(n: number) {
  for (let i = 0; i < n; i++) advance(TICK_DELAY);
}

/**
 * Step the TICK loop one tick at a time until `predicate()` is true, up to
 * `maxTicks`. Used by the passive tests so we stop the moment `done` is reached —
 * NOT overshooting into the auto-loop's END_HOLD reset.
 */
function advanceUntil(predicate: () => boolean, maxTicks = 60) {
  for (let i = 0; i < maxTicks && !predicate(); i++) advance(TICK_DELAY);
}

/** True once the terminal diff message is on screen. */
function reachedFinal() {
  return screen.queryAllByText(FINAL_MESSAGE).length > 0;
}

/** The role=group accessible name for an agent node in a given status word. */
function groupName(id: AgentId, word: string) {
  return `${SHORT_LABEL[id]} — ${word}`;
}

/** Click a button by accessible name inside act. */
function clickButton(name: RegExp | string) {
  const btn = screen.getByRole('button', { name });
  act(() => {
    btn.click();
  });
}

/**
 * Install an IntersectionObserver that reports the target as immediately in view,
 * so the passive auto-play (which only runs while on screen) triggers under test.
 * (The global test-setup IO is a no-op that never fires.)
 */
function installInViewObserver() {
  class InViewObserver {
    private cb: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb;
    }
    observe(el: Element) {
      this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [] as IntersectionObserverEntry[];
    }
  }
  vi.stubGlobal('IntersectionObserver', InViewObserver);
}

// ============================================================================
// Interactive path (autoPlay=false) — the retained keyboard/a11y controls.
// ============================================================================
describe('Pipeline — interactive path (autoPlay=false)', () => {
  it('renders all six agent nodes exactly once, in pipeline order (AC-4.2)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    const groups = screen.getAllByRole('group');
    // Exactly six (single responsive list — not a duplicated desktop+mobile set).
    expect(groups).toHaveLength(WEATHER_DASHBOARD_AGENTS.length);
    const order = groups.map((g) => g.getAttribute('aria-label')?.split(' — ')[0]);
    expect(order).toEqual(WEATHER_DASHBOARD_AGENTS.map((a) => SHORT_LABEL[a.id]));
  });

  it('Run activates Requirements and the detail panel streams its status line (AC-4.1)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    expect(screen.getByRole('group', { name: groupName('requirements', 'Working') })).toBeInTheDocument();
    // The first streamed status line shows in the synced StageDetail panel.
    expect(screen.getByText(WEATHER_DASHBOARD_AGENTS[0].statusLines[0])).toBeInTheDocument();
  });

  it('pauses at gate-1 with APPROVE/REVISE and does not advance until chosen (AC-4.3)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    expect(screen.queryByRole('button', { name: 'Approve requirements' })).toBeNull();
    ticks(3); // Requirements streams its lines → auto-pause at the gate.
    expect(screen.getAllByText('Awaiting your approval: requirements').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Approve requirements' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request revision' })).toBeInTheDocument();
    // Design has not started — no advance without a decision.
    expect(screen.getByRole('group', { name: groupName('design', 'Waiting') })).toBeInTheDocument();
  });

  it('APPROVE resumes the pipeline and clears the gate (AC-4.4)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    ticks(3);
    clickButton('Approve requirements');
    expect(screen.queryByText('Awaiting your approval: requirements')).toBeNull();
    ticks(1);
    expect(screen.getByRole('group', { name: groupName('design', 'Working') })).toBeInTheDocument();
  });

  it('a rapid double APPROVE yields exactly one transition (AC-4.10)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    ticks(3);
    clickButton('Approve requirements');
    expect(screen.queryByRole('button', { name: 'Approve requirements' })).toBeNull();
    ticks(1);
    expect(screen.getByRole('group', { name: groupName('design', 'Working') })).toBeInTheDocument();
    // Architecture must still be Waiting — no double advance.
    expect(screen.getByRole('group', { name: groupName('architecture', 'Waiting') })).toBeInTheDocument();
  });

  it('runs to completion showing the REVISE loop and the final diff message (AC-4.5/4.6)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    ticks(3);
    clickButton('Approve requirements');
    ticks(40); // drive the rest of the script to done; the engine parks at done.
    expect(screen.getAllByText(FINAL_MESSAGE).length).toBeGreaterThan(0);
    expect(screen.getByText(/never|Nothing is committed|human reviews/i)).toBeInTheDocument();
    // By done, all six nodes are Done (the revise loop resolved).
    for (const a of WEATHER_DASHBOARD_AGENTS) {
      expect(screen.getByRole('group', { name: groupName(a.id, 'Done') })).toBeInTheDocument();
    }
  });

  it('announces the gate on the polite live region (AC-5.2)', () => {
    const { container } = render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    ticks(3);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live?.textContent).toContain('Awaiting your approval: requirements');
  });

  it('Reset returns to a clean initial state (AC-4.9)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    ticks(3);
    clickButton('Approve requirements');
    ticks(10);
    clickButton('Reset the pipeline');
    for (const a of WEATHER_DASHBOARD_AGENTS) {
      expect(screen.getByRole('group', { name: groupName(a.id, 'Waiting') })).toBeInTheDocument();
    }
    expect(screen.queryByRole('button', { name: 'Approve requirements' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Run the AIgentLoop pipeline' })).toBeEnabled();
  });

  it('clears the timer on Reset so no stale TICK fires afterward (AC-4.9)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    ticks(1);
    clickButton('Reset the pipeline');
    ticks(5);
    expect(screen.getByRole('group', { name: groupName('requirements', 'Waiting') })).toBeInTheDocument();
  });

  it('drives a visitor-triggered REVISE at the gate (AC-4.5 alt path)', () => {
    render(<Pipeline variant="page" autoPlay={false} />);
    clickButton('Run the AIgentLoop pipeline');
    ticks(3);
    clickButton('Request revision');
    ticks(1);
    const reqGroup = screen.getByRole('group', {
      name: new RegExp(`^${SHORT_LABEL.requirements} — (Working|Done)`),
    });
    expect(reqGroup).toBeInTheDocument();
  });
});

// ============================================================================
// Passive path (autoPlay default) — self-playing: scroll-run, auto-approve, loop.
// ============================================================================
describe('Pipeline — passive auto-play (default, D-009)', () => {
  it('does NOT surface the interactive Run / gate buttons (self-playing)', () => {
    installInViewObserver();
    render(<Pipeline variant="page" />);
    // The control bar offers Replay, not a click-to-Run button.
    expect(screen.queryByRole('button', { name: 'Run the AIgentLoop pipeline' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Replay the pipeline from the start' })).toBeInTheDocument();
    // Even at the gate, no manual APPROVE is surfaced (it auto-approves).
    advance(START_DELAY);
    ticks(3);
    expect(screen.queryByRole('button', { name: 'Approve requirements' })).toBeNull();
  });

  it('auto-runs when scrolled into view (AC-4.1 passive)', () => {
    installInViewObserver();
    render(<Pipeline variant="page" />);
    // Idle until the start beat elapses.
    expect(screen.getByRole('group', { name: groupName('requirements', 'Waiting') })).toBeInTheDocument();
    advance(START_DELAY);
    expect(screen.getByRole('group', { name: groupName('requirements', 'Working') })).toBeInTheDocument();
  });

  it('auto-approves the human gate after a visible beat and continues (AC-4.4 passive)', () => {
    installInViewObserver();
    render(<Pipeline variant="page" />);
    advance(START_DELAY);
    ticks(3);
    // Gate is visibly reached (the beat).
    expect(screen.getAllByText('Awaiting your approval: requirements').length).toBeGreaterThan(0);
    // Hold, then it auto-approves — no click.
    advance(GATE_HOLD);
    ticks(1);
    expect(screen.getByRole('group', { name: groupName('design', 'Working') })).toBeInTheDocument();
  });

  it('runs to the final diff message on its own (AC-4.6 passive)', () => {
    installInViewObserver();
    render(<Pipeline variant="page" />);
    advance(START_DELAY);
    ticks(3);
    advance(GATE_HOLD); // auto-approve the gate
    advanceUntil(reachedFinal); // step to done — stop before the loop's END_HOLD reset
    expect(reachedFinal()).toBe(true);
  });

  it('plays ONCE then rests on the diff frame — it does NOT loop (D-014)', () => {
    installInViewObserver();
    render(<Pipeline variant="page" />);
    advance(START_DELAY);
    ticks(3);
    advance(GATE_HOLD);
    advanceUntil(reachedFinal);
    expect(reachedFinal()).toBe(true);
    // Advance well past the old end-hold + a fresh start beat + several ticks: with the
    // auto-loop removed, nothing resets or re-runs — every node stays Done and the final
    // message stays on screen (Replay is the only way to run again).
    advance(END_HOLD + START_DELAY + TICK_DELAY * 3);
    expect(reachedFinal()).toBe(true);
    expect(screen.getByRole('group', { name: groupName('requirements', 'Done') })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: groupName('requirements', 'Waiting') })).toBeNull();
  });

  it('makes zero network calls during a full passive run (AC-4.8)', () => {
    installInViewObserver();
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    render(<Pipeline variant="page" />);
    advance(START_DELAY);
    ticks(3);
    advance(GATE_HOLD);
    advanceUntil(reachedFinal);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('renders the section variant (compact) with the same six nodes', () => {
    installInViewObserver();
    render(<Pipeline variant="section" />);
    expect(screen.getAllByRole('group')).toHaveLength(WEATHER_DASHBOARD_AGENTS.length);
  });

  it('observes its section and disconnects the IntersectionObserver on unmount (no leak)', () => {
    // Use a real IO shape with spies so we can assert the effect both arms the
    // observer and tears it down — the cleanup arm of the passive in-view effect.
    const observe = vi.fn();
    const disconnect = vi.fn();
    class SpyObserver {
      constructor(_cb: IntersectionObserverCallback) {}
      observe = observe;
      unobserve = vi.fn();
      disconnect = disconnect;
      takeRecords = () => [] as IntersectionObserverEntry[];
    }
    vi.stubGlobal('IntersectionObserver', SpyObserver);

    const { unmount } = render(<Pipeline variant="page" />);
    // The effect armed the observer on the section element.
    expect(observe).toHaveBeenCalledTimes(1);

    // Unmount runs the effect cleanup → the observer is disconnected (no leak).
    act(() => {
      unmount();
    });
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('Replay resets the running pipeline back to the start (passive control)', () => {
    installInViewObserver();
    render(<Pipeline variant="page" />);
    advance(START_DELAY);
    ticks(2); // requirements is mid-run
    expect(screen.getByRole('group', { name: groupName('requirements', 'Working') })).toBeInTheDocument();
    // Replay in passive mode calls handleReset with autoPlay=true (no focus rAF arm).
    clickButton('Replay the pipeline from the start');
    expect(screen.getByRole('group', { name: groupName('requirements', 'Waiting') })).toBeInTheDocument();
    // It re-arms and auto-plays again from idle.
    advance(START_DELAY);
    expect(screen.getByRole('group', { name: groupName('requirements', 'Working') })).toBeInTheDocument();
  });

  it('falls back to in-view and still auto-plays where IntersectionObserver is unavailable (SSR/jsdom)', () => {
    // No IntersectionObserver in the environment → the effect must default to
    // in-view so the passive run is never silently stuck idle.
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Pipeline variant="page" />);
    // With no observer, it treats itself as visible and auto-runs after the start beat.
    expect(screen.getByRole('group', { name: groupName('requirements', 'Waiting') })).toBeInTheDocument();
    advance(START_DELAY);
    expect(screen.getByRole('group', { name: groupName('requirements', 'Working') })).toBeInTheDocument();
  });
});

// ============================================================================
// Reduced motion — every state reachable instantly; the loop is disabled.
// ============================================================================
describe('Pipeline — reduced motion (AC-5.3)', () => {
  beforeEach(() => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList);
  });

  it('reaches the final diff message with delays collapsed (passive, no loop)', () => {
    installInViewObserver();
    render(<Pipeline variant="page" />);
    // Delays are 0 — a single flush drives through run → gate → auto-approve → done.
    advance(0);
    ticks(50);
    expect(screen.getAllByText(FINAL_MESSAGE).length).toBeGreaterThan(0);
    // The loop is disabled under reduced motion — it settles on the resolved frame.
    advance(END_HOLD + START_DELAY);
    expect(screen.getAllByText(FINAL_MESSAGE).length).toBeGreaterThan(0);
  });
});
