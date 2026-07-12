/**
 * StageDetail — the synced detail panel beneath the signal-flow line (redesign D-009).
 *
 * It always shows *the currently highlighted stage* on the line: the active agent's
 * streamed status line + the artifact it is producing, the gate's awaiting/approved
 * beat, the tester's revise message, or the terminal "diff ready" state. Because it
 * reads the same engine state the line does, the two stay in lockstep — one story,
 * top and bottom. The artifact strip at the foot accumulates the produced files so
 * the panel also conveys *substance*, not just motion.
 *
 * Pure presentational. Status is text-first (headings + words), never colour-only
 * (WCAG 1.4.1). A fixed body min-height avoids layout jump as stages switch. In
 * interactive mode Pipeline passes the real gate buttons via `gateControls`; in the
 * default passive mode the gate resolves automatically and no buttons render.
 */

import type { ReactNode } from 'react';
import { cn } from '../ui/utils';
import { ArtifactGraph } from './ArtifactGraph';
import { SHORT_LABEL } from './AgentCard';
import type {
  AgentDef,
  ArtifactStatus,
  EngineStatus,
  GateDef,
  ReviseDef,
  Scenario,
} from './engine/types';

export interface StageDetailProps {
  scenario: Scenario;
  status: EngineStatus;
  /** The agent currently active/revising, if any. */
  activeDef: AgentDef | undefined;
  /** The status line currently streamed for the active agent. */
  streamLine: string | undefined;
  /** The gate awaiting a decision (paused-at-gate), else null. */
  activeGate: GateDef | null;
  /** The revise edge in flight (tester → implementer), else null. */
  activeRevise: ReviseDef | null;
  /** Terminal message shown when done. */
  finalMessage: string | null;
  /** Per-artifact status map from engine state. */
  artifacts: Record<string, ArtifactStatus>;
  /** Collapse caret/enter motion under reduced motion (AC-5.3). */
  reducedMotion: boolean;
  /** Interactive-mode gate buttons; omitted in the default passive mode. */
  gateControls?: ReactNode;
}

/** The "Now" chip label for the current stage/kind. */
function nowLabel(props: StageDetailProps): string {
  const { status, activeGate, activeRevise, activeDef } = props;
  if (status === 'done') return 'Complete';
  if (status === 'paused-at-gate' && activeGate) return 'Human gate';
  if (activeRevise) return 'Revision';
  if (activeDef) return SHORT_LABEL[activeDef.id];
  return 'Ready';
}

export function StageDetail(props: StageDetailProps) {
  const {
    scenario,
    status,
    activeDef,
    streamLine,
    activeGate,
    activeRevise,
    finalMessage,
    artifacts,
    reducedMotion,
    gateControls,
  } = props;

  const isDone = status === 'done';
  const isGate = status === 'paused-at-gate' && !!activeGate;
  const isRevise = !!activeRevise;
  const isAgent = !isDone && !isGate && !isRevise && !!activeDef;
  const showCaret = (isAgent || isRevise) && !reducedMotion;

  // The two body lines, chosen by state precedence (done → gate → revise → agent → idle).
  let line1: ReactNode;
  let line2: ReactNode;
  if (isDone) {
    line1 = <span className="text-primary font-medium">{finalMessage}</span>;
    line2 = 'The pipeline stops here — a human reviews and commits the diff. Nothing is committed, pushed or deployed automatically.';
  } else if (isGate && activeGate) {
    line1 = <><span className="text-primary">⏸ {activeGate.prompt}</span></>;
    line2 = 'The pipeline paused for a human decision before continuing.';
  } else if (isRevise && activeRevise) {
    line1 = <span className="text-destructive">✗ {activeRevise.reason}</span>;
    line2 = <>routing back to {SHORT_LABEL[activeRevise.to]} for a fix…</>;
  } else if (isAgent && activeDef) {
    line1 = streamLine ?? activeDef.label;
    line2 = <span className="text-muted-foreground">→ {activeDef.artifact.title}</span>;
  } else {
    line1 = 'Ready — the pipeline runs itself.';
    line2 = <span className="text-muted-foreground">Six agents, one human gate, one self-correcting revise loop.</span>;
  }

  return (
    <div
      role="region"
      aria-label="Current pipeline stage"
      className="rounded-xl border border-border/60 dark:border-border/70 bg-card/60 overflow-hidden"
    >
      {/* header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border/60 dark:border-border/70">
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            isRevise ? 'bg-destructive' : isDone ? 'bg-primary' : 'bg-primary',
            !reducedMotion && !isDone && 'animate-pulse',
          )}
          aria-hidden="true"
        />
        <span className="text-xs text-muted-foreground">Now</span>
        <span className="text-sm font-medium">{nowLabel(props)}</span>
        {activeDef && !isDone && !isGate && !isRevise && (
          <span className="ml-auto text-xs text-muted-foreground truncate hidden sm:block">{activeDef.label}</span>
        )}
      </div>

      {/* body — fixed min-height so switching stages never jumps the layout */}
      <div className="px-4 py-3.5 font-mono text-[13px] leading-relaxed min-h-[68px]">
        <p className="text-foreground/90">
          {line1}
          {showCaret && (
            <span
              className={cn('inline-block w-[7px] h-[14px] align-[-2px] ml-1 bg-primary', !reducedMotion && 'animate-pulse')}
              aria-hidden="true"
            />
          )}
        </p>
        <p className="mt-1.5 text-muted-foreground text-xs">{line2}</p>
      </div>

      {/* interactive gate buttons (interactive mode only) */}
      {isGate && gateControls && <div className="px-4 pb-3.5">{gateControls}</div>}

      {/* artifact strip — accumulates the produced files (substance) */}
      <div className="px-4 py-3 border-t border-border/60 dark:border-border/70 bg-muted/30">
        <p className="text-xs text-muted-foreground mb-2">Artifacts</p>
        <ArtifactGraph agents={scenario.agents} artifacts={artifacts} reducedMotion={reducedMotion} />
      </div>
    </div>
  );
}
