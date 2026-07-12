/**
 * SignalFlow — the hero "signal-flow line" of the flagship (redesign D-009,
 * layout-hardened D-010).
 *
 * The six agents render as nodes on a single line: Idea → Requirements → … →
 * Handoff → Diff ready. A filled trail grows along the line to show progress (there is
 * NO separate travelling dot — it collided with the active node's spinner; the growing
 * trail + the per-node state changes carry the motion instead); a clearly-LABELLED gate
 * pill (not a cryptic diamond) marks the human approval checkpoint; a labelled return
 * bracket routes ABOVE the row (never across the labels — D-016) when the tester sends a
 * revision back to the implementer, and PERSISTS for the rest of the run so the
 * self-correction stays readable rather than flashing by. Everything is
 * derived from the pure engine state (no timers here) — the trail length is a function
 * of `status` + which agent is `active`, and CSS transitions glide it as state advances.
 * The discs have OPAQUE faces and sit above the line (z-10) so it never cuts through them.
 *
 * LAYOUT (D-010 fix): the six nodes are laid out on an even CSS **grid** (one column
 * each) at ≥sm — so spacing is always uniform and discs can never overlap the gate or
 * each other (the old absolute-percentage rail drifted and collided). The decorative
 * rail / packet / gate-pill / revise-arc are a separate `aria-hidden` layer whose
 * positions are computed from the grid's column centres, so they line up exactly.
 *
 * The six nodes are rendered EXACTLY ONCE, as one responsive list that reflows from a
 * vertical mobile spine to the horizontal desktop grid — so there is exactly one
 * `#step-<id>` anchor and one `role=group` per agent (valid HTML, no doubled
 * screen-reader nodes, deep-links resolve at any breakpoint). Status is never
 * colour-only: each node carries a text `aria-label` (via AgentCard) and the gate /
 * revise carry visible words. Under reduced motion all transitions collapse to instant
 * so every state is legible without movement (AC-5.3).
 */

import { RotateCcw } from 'lucide-react';
import { cn } from '../ui/utils';
import { AgentCard, SHORT_LABEL } from './AgentCard';
import type { AgentDef, AgentId, AgentStatus, EngineStatus, ReviseDef } from './engine/types';

export interface SignalFlowProps {
  /** The six agent defs in pipeline order. */
  agents: AgentDef[];
  /** Per-agent lifecycle status from engine state. */
  agentStatus: Record<AgentId, AgentStatus>;
  /** High-level engine status — drives the packet's resting position. */
  status: EngineStatus;
  /** The revise edge currently in flight (tester → implementer), else null. */
  activeRevise: ReviseDef | null;
  /**
   * Sticky "a revision already happened this run" flag (D-016). Keeps the return-loop
   * annotation on screen after the live `activeRevise` beat passes, so the user can read
   * and understand the self-correction rather than seeing it flash by. Optional (defaults
   * off) so unit tests that pass only `activeRevise` still exercise the live path.
   */
  reviseSeen?: boolean;
  /** Collapse packet/trail motion to instant swaps under reduced motion (AC-5.3). */
  reducedMotion: boolean;
}

/** Centre of node `i` (1-based) as a percent of the track, for `n` equal columns. */
const nodeCenter = (i: number, n: number) => ((i - 0.5) / n) * 100;

/**
 * How far the filled progress trail reaches (percent along the track), derived from
 * engine state:
 *   idle → the start (empty trail); paused-at-gate → the gate; running → the active
 *   agent's column centre (or just past the last done one between steps); done → the
 *   end (full trail). There is no separate travelling marker — the growing trail + the
 *   node state changes carry the motion, so nothing overlaps the discs.
 */
function progressPos(
  agents: AgentDef[],
  agentStatus: Record<AgentId, AgentStatus>,
  status: EngineStatus,
  gatePos: number,
): number {
  const n = agents.length;
  const railStart = nodeCenter(1, n);
  const railEnd = nodeCenter(n, n);
  if (status === 'idle') return railStart;
  if (status === 'done') return railEnd;
  if (status === 'paused-at-gate') return gatePos;
  const activeIdx = agents.findIndex(
    (a) => agentStatus[a.id] === 'active' || agentStatus[a.id] === 'revise',
  );
  if (activeIdx >= 0) return nodeCenter(activeIdx + 1, n);
  // Transient between steps → rest at the last completed agent's centre.
  const doneCount = agents.filter((a) => agentStatus[a.id] === 'done').length;
  return nodeCenter(Math.min(doneCount + 1, n), n);
}

export function SignalFlow({ agents, agentStatus, status, activeRevise, reviseSeen, reducedMotion }: SignalFlowProps) {
  const n = agents.length;
  const railStart = nodeCenter(1, n);
  const railEnd = nodeCenter(n, n);
  // The human gate sits on the segment between Requirements (1) and Design (2).
  const gatePos = (nodeCenter(1, n) + nodeCenter(2, n)) / 2;

  const pos = progressPos(agents, agentStatus, status, gatePos);
  const trailWidth = Math.max(0, pos - railStart);

  const reviseActive = activeRevise?.from === 'tester' && activeRevise?.to === 'implementer';
  // Show the return-loop annotation while it's live OR once it has fired this run
  // (D-016 persistence) — so it stays legible instead of flashing for a single beat.
  const showRevise = reviseActive || !!reviseSeen;
  const trailDur = reducedMotion ? 'duration-0' : 'duration-500';
  const gateDur = reducedMotion ? 'duration-0' : 'duration-300';

  const isDone = status === 'done';
  const atGate = status === 'paused-at-gate';
  const started = status !== 'idle';
  // The gate is "passed" once Design (the agent after it) has begun, or at the end.
  const gatePassed = !atGate && (isDone || agentStatus[agents[1].id] !== 'idle');

  // Revise-arc endpoints, from the actual column centres (grid-aligned).
  const implIdx = agents.findIndex((a) => a.id === 'implementer');
  const testerIdx = agents.findIndex((a) => a.id === 'tester');
  const implC = implIdx >= 0 ? nodeCenter(implIdx + 1, n) : railStart;
  const testerC = testerIdx >= 0 ? nodeCenter(testerIdx + 1, n) : railEnd;

  return (
    <div role="img" aria-label="Pipeline flow" className="relative px-1 sm:px-2">
      {/*
        Single unique #gate-1 deep-link target — always displayed (not inside a
        breakpoint-hidden branch) so `/aigentloop#gate-1` resolves at any width (AC-6.2).
        Zero-size + aria-hidden; the visible pill/marker below are decorative.
      */}
      <span id="gate-1" aria-hidden="true" className="absolute left-0 top-0 w-0 h-0 scroll-mt-24" />

      {/* ============ DESKTOP: decorative layer (aria-hidden), grid-aligned ============ */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* rail (track) — spans from the first to the last column centre. Sits at 72px
            so there is a tall enough top lane above the discs for BOTH the gate pill and
            the return-loop bracket to route over the row (D-016), never across the labels. */}
        <div
          className="absolute top-[72px] -translate-y-1/2 h-[2px] rounded-full bg-border"
          style={{ left: `${railStart}%`, right: `${100 - railEnd}%` }}
        />
        {/* filled trail — green = the completed path, matching the done nodes */}
        <div
          className={cn('absolute top-[72px] -translate-y-1/2 h-[2px] rounded-full bg-success transition-[width] ease-out', trailDur)}
          style={{ left: `${railStart}%`, width: `${trailWidth}%` }}
        />

        {/* Idea cap (entry) — centred on the rail at the far-left end of the line. */}
        <div className="absolute left-0 top-[72px] -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap">◆ Idea</div>
        {/* Diff-ready cap (exit) — centred on the rail at the far-right end. */}
        <div
          className={cn(
            'absolute right-0 top-[72px] -translate-y-1/2 text-xs whitespace-nowrap transition-colors',
            gateDur,
            isDone ? 'text-success font-medium' : 'text-muted-foreground',
          )}
        >
          ✓ Diff ready
        </div>

        {/* ── Gate: a clearly LABELLED pill above the rail + a connector down to it ── */}
        <div className="absolute -translate-x-1/2 top-[6px]" style={{ left: `${gatePos}%` }}>
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-[3px] rounded-full border text-[11px] font-medium leading-none whitespace-nowrap transition-[background-color,border-color,color,box-shadow]',
              gateDur,
              atGate
                ? 'border-info text-info bg-info/10 dark:bg-info/15 shadow-[0_0_0_3px_var(--tw-shadow-color)] shadow-info/20'
                : gatePassed
                  ? 'border-success/50 text-success bg-success/10'
                  : 'border-border text-muted-foreground bg-card',
              atGate && !reducedMotion && 'animate-pulse',
            )}
          >
            <span aria-hidden="true">{gatePassed ? '✓' : '⏸'}</span>
            <span>{atGate ? 'Awaiting approval' : gatePassed ? 'Approved' : 'Human gate'}</span>
          </div>
          {/* connector from the pill down to the rail (rail lowered to 72px — D-016) */}
          <span
            className={cn(
              'absolute left-1/2 -translate-x-1/2 top-full w-[2px] h-[44px] transition-colors',
              gateDur,
              atGate ? 'bg-info/50' : gatePassed ? 'bg-success/50' : 'bg-border',
            )}
          />
        </div>

        {/*
          ── Revise: a clean "return bracket", Tester → Implementer, routed ABOVE the
          row (D-016) so it never crosses the node labels underneath. Pure HTML/CSS
          (no stretched SVG → no distortion): a labelled pill in the top lane, then a
          dashed red ∩ that spans just the two adjacent nodes, legs DROPPING toward each
          disc, a down-arrow into the implementer (where the fix lands) and an origin dot
          at the tester (where it departs). Dashed RED = the correction loop (vs the solid
          GREEN completed trail). It PERSISTS once fired (`showRevise`) so the user can
          read the self-correction instead of catching a one-beat flash.
        */}
        <div
          className={cn('absolute top-[4px] transition-opacity', gateDur, showRevise ? 'opacity-100' : 'opacity-0')}
          style={{ left: `${implC}%`, width: `${testerC - implC}%` }}
        >
          {/* labelled pill, centred over the bracket in the top lane */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full border border-destructive/40 bg-destructive/10 text-destructive text-[11px] font-medium leading-none whitespace-nowrap">
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              Tester returns a fix
            </span>
          </div>
          {/* the ∩ bracket: rounded dashed top + two legs dropping to the nodes */}
          <div className="relative mt-1 h-[26px]">
            <div className="absolute inset-x-[6%] top-0 h-full rounded-t-xl border-t-2 border-x-2 border-dashed border-destructive/70" />
            {/* arrowhead pointing DOWN into the implementer node (left leg) */}
            <span
              className="absolute left-[6%] -translate-x-1/2 -bottom-[5px] w-0 h-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-destructive"
            />
            {/* a small origin dot at the tester leg (where the fix departs) */}
            <span className="absolute right-[6%] translate-x-1/2 -bottom-[3px] w-[6px] h-[6px] rounded-full bg-destructive" />
          </div>
        </div>
      </div>

      {/* ============ MOBILE: decorative vertical spine (aria-hidden) ============ */}
      <div className="sm:hidden absolute left-[15px] top-2 bottom-10 w-[2px] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-border" />
        <div
          className={cn('absolute left-0 top-0 w-full rounded-full bg-success transition-[height] ease-out', trailDur)}
          style={{ height: started ? `${((pos - railStart) / (railEnd - railStart)) * 100}%` : '0%' }}
        />
      </div>

      {/* Mobile-only "Idea" entry cap above the spine. */}
      <p className="sm:hidden ml-11 mb-4 text-xs text-muted-foreground">◆ Idea</p>

      {/* ============ THE SIX NODES — rendered ONCE, reflowed by breakpoint ============ */}
      <ul
        className={cn(
          'relative list-none m-0 p-0',
          // Mobile: vertical stack over the spine.
          'flex flex-col gap-5',
          // Desktop: an even 6-column grid. A TALL top lane (pt-14) reserves room for
          // both the gate pill and the return-loop bracket to route ABOVE the row (D-016),
          // so the rail (at 72px) threads through the disc centres and nothing crosses the
          // labels; only a small bottom lane is needed now that the loop moved up.
          'sm:grid sm:grid-cols-6 sm:gap-0 sm:pt-14 sm:pb-6',
        )}
      >
        {agents.map((a, i) => (
          <li key={a.id} className="static sm:flex sm:justify-center">
            <AgentCard id={a.id} status={agentStatus[a.id]} index={i + 1} reducedMotion={reducedMotion} />
            {/* Mobile-only inline gate marker directly under Requirements. */}
            {a.id === 'requirements' && (atGate || gatePassed) && (
              <p className={cn('sm:hidden ml-11 mt-1 text-xs', atGate ? 'text-info' : 'text-success')}>
                {atGate ? '⏸ Awaiting approval' : '✓ Gate approved'}
              </p>
            )}
            {/* Mobile-only inline revise marker near the tester — a matching red pill.
                Persists once fired (D-016) so the self-correction stays readable. */}
            {a.id === 'tester' && showRevise && (
              <div className="sm:hidden ml-11 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full border border-destructive/40 bg-destructive/10 text-destructive text-xs font-medium">
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  revise → {SHORT_LABEL.implementer}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Mobile-only "Diff ready" exit cap below the spine (the "◆ Idea" entry cap
          is rendered once above the list). */}
      <p className={cn('sm:hidden ml-11 mt-2 text-xs', isDone ? 'text-success font-medium' : 'text-muted-foreground')}>
        ✓ Diff ready
      </p>
    </div>
  );
}
