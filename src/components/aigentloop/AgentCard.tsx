/**
 * AgentCard — a single NODE on the flagship signal-flow line (redesign D-009).
 *
 * The flagship is now a horizontal (desktop) / vertical (mobile) pipeline "line";
 * each of the six agents renders as one node: a status disc (idle | active | done |
 * revise) + a short role label. Status is conveyed by TEXT (the visible label + the
 * `aria-label`) and an icon, never by colour alone (WCAG 1.4.1). Each node is an
 * `#step-<agentId>` anchor target so `/aigentloop#step-<agent>` deep links land on it
 * (AC-6.2) and exposes `role="group"` + `aria-label="<label> — <status>"` (§4.3).
 *
 * Pure presentational — no timers, no engine logic. Geometry (position on the line)
 * is owned by `SignalFlow`; this component only renders one node's disc + label.
 */

import { Check, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '../ui/utils';
import type { AgentId, AgentStatus } from './engine/types';

/** Human-readable status word — drives the a11y label (never colour-only). */
const STATUS_LABEL: Record<AgentStatus, string> = {
  idle: 'Waiting',
  active: 'Working',
  done: 'Done',
  revise: 'Revising',
};

/** Short node label per agent (the full "(Jira)" labels are for the detail panel). */
export const SHORT_LABEL: Record<AgentId, string> = {
  requirements: 'Requirements',
  design: 'Design',
  architecture: 'Architecture',
  implementer: 'Implementer',
  tester: 'Tester',
  handoff: 'Handoff',
};

export interface AgentCardProps {
  /** Agent id — drives the short label + the `#step-<id>` anchor. */
  id: AgentId;
  /** This agent's current lifecycle status (from engine state). */
  status: AgentStatus;
  /** Ordinal position (1-based) shown in the disc until the node completes. */
  index: number;
  /** When true, drop spin/scale motion to a plain state swap (AC-5.3). */
  reducedMotion: boolean;
}

/** The disc icon for a status (decorative — labelled by the adjacent text). */
function DiscIcon({ status, index, spin }: { status: AgentStatus; index: number; spin: boolean }) {
  // A plain check (not CheckCircle2) — the disc already draws the circle, so a
  // circle-in-circle icon would read as a ⊖ at this size.
  if (status === 'done') return <Check className="w-4 h-4" strokeWidth={3} aria-hidden="true" />;
  if (status === 'active') {
    return <Loader2 className={cn('w-4 h-4', spin && 'animate-spin')} aria-hidden="true" />;
  }
  if (status === 'revise') {
    return <RotateCcw className={cn('w-4 h-4', spin && 'animate-spin')} aria-hidden="true" />;
  }
  return <span className="text-xs font-medium">{index}</span>;
}

/**
 * Render one pipeline node. `SignalFlow` positions the wrapper; this draws the disc
 * (its ring/fill reflect status) and the short label (its weight/tone reflect status).
 */
export function AgentCard({ id, status, index, reducedMotion }: AgentCardProps) {
  const statusText = STATUS_LABEL[status];
  const isActive = status === 'active';
  const isDone = status === 'done';
  const isRevise = status === 'revise';

  const disc = (
    <span
      className={cn(
        // Every state is an OPAQUE disc + z-10 so the connector line passes BEHIND it
        // (never cuts through). A traffic-light status palette carries the meaning:
        // grey outline = waiting, filled blue = working, filled green = done, filled red
        // = revising. The filled discs read as coloured "circles" at a glance (WCAG 1.4.1
        // is still satisfied by the adjacent text label + aria-label, not colour alone).
        'relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full border shrink-0',
        'transition-[transform,box-shadow,border-color,background-color,color]',
        reducedMotion ? 'duration-0' : 'duration-300',
        // Waiting — quiet grey outline with the ordinal number.
        !isActive && !isDone && !isRevise && 'bg-card border-border text-muted-foreground',
        // Working — filled blue, enlarged, with a soft focus halo (spinner carries motion).
        isActive &&
          'bg-info text-info-foreground border-transparent scale-110 shadow-[0_0_0_4px_var(--tw-shadow-color)] shadow-info/25',
        // Done — filled green with a white check (calm, settled: no ring/scale).
        isDone && 'bg-success text-success-foreground border-transparent',
        // Revising — filled red, enlarged, red halo + a white (forced, not the theme's
        // red-on-red dark `destructive-foreground`) spinning icon so it stays crisp and
        // high-contrast in BOTH themes. The spin + halo carry the "attention" (no pulse,
        // which just faded the disc on the dark card).
        isRevise &&
          'bg-destructive text-white border-transparent scale-110 shadow-[0_0_0_4px_var(--tw-shadow-color)] shadow-destructive/40',
      )}
      aria-hidden="true"
    >
      <DiscIcon status={status} index={index} spin={!reducedMotion} />
    </span>
  );

  const label = (
    <span
      className={cn(
        'whitespace-nowrap text-xs transition-colors',
        reducedMotion ? 'duration-0' : 'duration-300',
        isActive || isRevise ? 'text-foreground font-medium' : isDone ? 'text-foreground/80' : 'text-muted-foreground',
      )}
    >
      {SHORT_LABEL[id]}
    </span>
  );

  return (
    <div
      id={`step-${id}`}
      role="group"
      aria-label={`${SHORT_LABEL[id]} — ${statusText}`}
      className={cn(
        'scroll-mt-24',
        // Mobile: disc + label in a row on the vertical spine.
        'flex items-center gap-3',
        // Desktop (sm+): disc above a centred label, sitting on the horizontal line.
        'sm:flex-col sm:items-center sm:gap-2',
      )}
    >
      {disc}
      {label}
    </div>
  );
}
