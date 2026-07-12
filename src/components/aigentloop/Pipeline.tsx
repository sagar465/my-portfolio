/**
 * Pipeline — the orchestrator and SINGLE source of behaviour for the flagship
 * (architecture §3.4; redesign D-009). One `useReducer(engineReducer)` drives
 * everything; `variant` only changes chrome/density (section vs page), never the
 * logic — the two mounts (homepage embed + /aigentloop page) share this exact
 * component with independent local state, no global store.
 *
 * The flagship plays itself (passive `autoPlay`, the default — D-009): it auto-runs
 * when scrolled into view and the human gate AUTO-APPROVES after a visible beat. It
 * plays through exactly ONCE, then RESTS on the final "diff ready" frame — there is no
 * continuous loop (D-014: "stop after one full run; Replay to re-run"). A Play/Pause +
 * Replay bar gives light control; Replay resets to idle, which re-triggers a single
 * fresh run. The interactive APPROVE/REVISE path is retained behind `autoPlay={false}`
 * for keyboard/a11y use and tests, but is not surfaced by the shipped mounts.
 *
 * This is the ONLY place timers live (the reducer is pure — architecture §3.3): a
 * `setTimeout` loop dispatches `TICK` while `running`; separate timers auto-run on
 * scroll and auto-approve the gate. Every timer is cleared on unmount / status change /
 * pause so nothing leaks (AC-4.9). Under reduced motion all per-tick delays collapse to
 * instant; either way the pipeline plays once and settles on the static "diff ready"
 * frame so every state stays legible without movement (AC-5.3).
 *
 * Accessibility (architecture §4): one `aria-live="polite"` region announces the
 * major transitions; in interactive mode focus moves to APPROVE at the gate and back
 * to the control on RESET. ZERO network / AI / backend anywhere — the scenario data
 * IS the script (AC-4.8).
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { engineReducer, initEngineState } from './engine/reducer';
import { WEATHER_DASHBOARD_SCENARIO } from './engine/scenario';
import type { AgentId } from './engine/types';
import { useReducedMotion } from './useReducedMotion';
import { SignalFlow } from './SignalFlow';
import { StageDetail } from './StageDetail';
import { GateControls, APPROVE_BUTTON_ID } from './GateControls';
import { ScenarioRunner, RUN_BUTTON_ID } from './ScenarioRunner';
import { cn } from '../ui/utils';

export interface PipelineProps {
  /**
   * Chrome/density only (architecture §3.4). `section` = compact homepage embed;
   * `page` = the roomier /aigentloop deep-dive. Behaviour is identical.
   */
  variant?: 'section' | 'page';
  /**
   * Passive cinematic mode (default, D-009): auto-run on scroll, auto-approve the
   * gate, loop. `false` = the retained interactive Run/Approve/Revise path.
   */
  autoPlay?: boolean;
}

/**
 * Per-tick cadence when motion is allowed (page is a touch slower for readability).
 * Deliberately unhurried — each streamed status line needs time to read (D-012:
 * "playing too fast, give the user time to grab details").
 */
const TICK_MS = { section: 1000, page: 1200 } as const;
/** Hold at the gate before auto-approving, so the "awaiting → approved" beat reads. */
const GATE_HOLD_MS = 2000;
/**
 * Extra dwell on the "tester found a bug → routing back to the implementer" beat
 * (the `activeRevise` frame). Without this the self-correction moment gets a single
 * TICK and flashes by — the very thing D-012 flagged. This is the marquee beat, so
 * it lingers well past a normal tick.
 */
const REVISE_HOLD_MS = 2800;
/** A short beat on the idle frame before each (re)start. */
const START_DELAY_MS = 700;

export function Pipeline({ variant = 'section', autoPlay = true }: PipelineProps) {
  const reducedMotion = useReducedMotion();
  const [state, dispatch] = useReducer(engineReducer, WEATHER_DASHBOARD_SCENARIO, initEngineState);

  const [idea, setIdea] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  // Sticky "a revision happened this run" flag (D-016): the engine's `activeRevise`
  // is live for only the revise beat, but the return-loop annotation should STAY on
  // screen through the rest of the run so the user can actually read/understand the
  // self-correction (it's the marquee moment). Set when the revise fires; cleared on
  // RESET (Replay) below so the next fresh run starts without it.
  const [reviseSeen, setReviseSeen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Observe visibility so the passive run starts (and loops) only while on screen.
  // Falls back to "in view" where IntersectionObserver is unavailable (jsdom/SSR).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView(e.isIntersecting)),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The TICK loop — the ONLY per-step timer. Runs while `running` and not paused;
  // stops at a gate, at done, on pause, and on unmount. Delay collapses to 0 under
  // reduced motion so traversal is instant (AC-5.3).
  useEffect(() => {
    if (state.status !== 'running' || paused) {
      clearTimer();
      return;
    }
    // The `activeRevise` frame (tester→implementer routing-back) lingers longer than a
    // normal tick so the self-correction beat is legible (D-012); everything else runs
    // at the standard cadence. Reduced motion collapses all delays to instant (AC-5.3).
    const delay = reducedMotion ? 0 : state.activeRevise ? REVISE_HOLD_MS : TICK_MS[variant];
    timerRef.current = setTimeout(() => dispatch({ type: 'TICK' }), delay);
    return clearTimer;
  }, [state.status, state.streamIndex, state.cursor, state.activeRevise, reducedMotion, paused, variant, clearTimer]);

  // Passive auto-run: from a clean idle, in view, not paused → start (and, after the
  // loop resets to idle, restart). Interactive mode never auto-runs.
  useEffect(() => {
    if (!autoPlay || !inView || paused || state.status !== 'idle') return;
    const t = setTimeout(() => dispatch({ type: 'RUN' }), reducedMotion ? 0 : START_DELAY_MS);
    return () => clearTimeout(t);
  }, [autoPlay, inView, paused, state.status, reducedMotion]);

  // Passive auto-approve: hold at the gate for a beat, then approve (the visible
  // "awaiting → approved" moment). Interactive mode waits for a human click.
  useEffect(() => {
    if (!autoPlay || paused || state.status !== 'paused-at-gate') return;
    const t = setTimeout(() => dispatch({ type: 'APPROVE' }), reducedMotion ? 0 : GATE_HOLD_MS);
    return () => clearTimeout(t);
  }, [autoPlay, paused, state.status, reducedMotion]);

  // No auto-loop (D-014): the pipeline plays through once and RESTS on the "diff ready"
  // frame. `done` is terminal for the passive run — the auto-run effect above only fires
  // from `idle`, so nothing restarts until the user clicks Replay (which dispatches RESET
  // → idle → one fresh run). This is why scrolling away and back does not re-trigger it.

  // Latch the revise once it fires so the return-loop annotation persists for the rest
  // of the run (D-016). Cleared on RESET in `handleReset` so a fresh run starts clean.
  useEffect(() => {
    if (state.activeRevise) setReviseSeen(true);
  }, [state.activeRevise]);

  // Announce major transitions to the single polite live region (AC-5.2).
  useEffect(() => {
    if (state.status === 'paused-at-gate' && state.activeGate) {
      setAnnouncement(state.activeGate.prompt);
      return;
    }
    if (state.status === 'done' && state.finalMessage) {
      setAnnouncement(state.finalMessage);
      return;
    }
    if (state.status === 'running' && state.activeRevise) {
      setAnnouncement(`Revision requested: ${state.activeRevise.reason}. Routing back to ${state.activeRevise.to}.`);
      return;
    }
    if (state.status === 'running') {
      const activeId = (Object.keys(state.agents) as AgentId[]).find((id) => state.agents[id] === 'active');
      if (activeId) {
        const def = state.scenario.agents.find((a) => a.id === activeId);
        if (def) setAnnouncement(`${def.label} is working.`);
      }
    }
  }, [state.status, state.activeGate, state.finalMessage, state.activeRevise, state.agents, state.scenario.agents]);

  // Interactive mode only: focus the APPROVE button when a gate is reached (§4.4).
  useEffect(() => {
    if (!autoPlay && state.status === 'paused-at-gate') {
      (document.getElementById(APPROVE_BUTTON_ID) as HTMLButtonElement | null)?.focus();
    }
  }, [autoPlay, state.status]);

  const handleRun = useCallback(() => dispatch({ type: 'RUN' }), []);
  const handleApprove = useCallback(() => dispatch({ type: 'APPROVE' }), []);
  const handleRevise = useCallback(() => dispatch({ type: 'REVISE' }), []);
  const handleTogglePause = useCallback(() => setPaused((p) => !p), []);

  const handleReset = useCallback(() => {
    clearTimer();
    dispatch({ type: 'RESET' });
    setAnnouncement('');
    setReviseSeen(false); // D-016: drop the sticky revise annotation for the fresh run.
    if (!autoPlay) {
      // Interactive: return focus to the origin control (return-to-origin, §4.4).
      requestAnimationFrame(() => (document.getElementById(RUN_BUTTON_ID) as HTMLButtonElement | null)?.focus());
    }
  }, [clearTimer, autoPlay]);

  // Derive the visible stream line for the active/revise agent (AC-4.1).
  const activeAgentId = (Object.keys(state.agents) as AgentId[]).find(
    (id) => state.agents[id] === 'active' || state.agents[id] === 'revise',
  );
  const activeDef = activeAgentId ? state.scenario.agents.find((a) => a.id === activeAgentId) : undefined;
  const streamLine =
    activeDef && state.streamIndex >= 0
      ? activeDef.statusLines[Math.min(state.streamIndex, activeDef.statusLines.length - 1)]
      : undefined;

  const isPage = variant === 'page';

  return (
    <div
      ref={containerRef}
      className={cn(
        'mx-auto rounded-2xl border border-border/60 dark:border-border/70 bg-card/80 dark:bg-card/60 backdrop-blur-sm',
        'p-5 sm:p-6 lg:p-8 space-y-6',
        isPage ? 'max-w-5xl' : 'max-w-4xl',
      )}
    >
      {/* Single polite live region — announces the major transitions (AC-5.2). */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Control bar (passive: Play/Pause + Replay · interactive: Run/Reset + idea). */}
      <ScenarioRunner
        scenario={state.scenario}
        status={state.status}
        mode={autoPlay ? 'auto' : 'interactive'}
        paused={paused}
        onRun={handleRun}
        onReset={handleReset}
        onTogglePause={handleTogglePause}
        idea={idea}
        onIdeaChange={setIdea}
        reducedMotion={reducedMotion}
      />

      {/* HERO — the signal-flow line (Idea → 6 agents → Diff ready). */}
      <SignalFlow
        agents={state.scenario.agents}
        agentStatus={state.agents}
        status={state.status}
        activeRevise={state.activeRevise}
        reviseSeen={reviseSeen}
        reducedMotion={reducedMotion}
      />

      {/* SYNCED PANEL — the highlighted stage's live details + artifact strip. */}
      <StageDetail
        scenario={state.scenario}
        status={state.status}
        activeDef={activeDef}
        streamLine={streamLine}
        activeGate={state.activeGate}
        activeRevise={state.activeRevise}
        finalMessage={state.finalMessage}
        artifacts={state.artifacts}
        reducedMotion={reducedMotion}
        gateControls={
          !autoPlay ? (
            <GateControls
              gate={state.status === 'paused-at-gate' ? state.activeGate : null}
              onApprove={handleApprove}
              onRevise={handleRevise}
            />
          ) : undefined
        }
      />
    </div>
  );
}
