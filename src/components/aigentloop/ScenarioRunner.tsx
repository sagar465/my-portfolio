/**
 * ScenarioRunner — the flagship's compact control bar (redesign D-009).
 *
 * The flagship now plays itself (passive `auto` mode): it auto-runs on scroll, the
 * gate auto-approves, and it loops — so the controls are intentionally minimal, a
 * Play/Pause toggle + a Replay. The interactive path is retained behind `mode="interactive"`
 * (a real Run/Reset + the decorative idea field) for keyboard/a11y use and tests; it
 * is not surfaced by the shipped mounts (D-009 supersedes the "run it live" framing).
 *
 * Both modes reuse the shadcn `ui/button` (Space/Enter fire natively, AC-5.1). The
 * primary action carries the stable `RUN_BUTTON_ID` so RESET can return focus to it
 * (architecture §4.4 — the shadcn Button is not a forwardRef, so focus is by id).
 * Every control shows a visible state so nothing "just happens" silently (AC-X.2).
 */

import { Play, Pause, RotateCcw, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import type { EngineStatus, Scenario } from './engine/types';

/** Stable id of the primary control so RESET can return focus to it (§4.4). */
export const RUN_BUTTON_ID = 'aigentloop-run';

export interface ScenarioRunnerProps {
  /** The scenario on offer (label shown as a badge). */
  scenario: Scenario;
  /** Current engine status — drives control enablement + feedback. */
  status: EngineStatus;
  /** `auto` = passive Play/Pause + Replay (default); `interactive` = Run/Reset + idea. */
  mode?: 'auto' | 'interactive';
  /** Whether the passive auto-play is currently paused (auto mode only). */
  paused?: boolean;
  /** Start the canned run (interactive mode). */
  onRun?: () => void;
  /** Reset to a clean initial state / replay (AC-4.9). */
  onReset: () => void;
  /** Toggle the passive auto-play pause (auto mode). */
  onTogglePause?: () => void;
  /** The optional decorative idea text (interactive mode). */
  idea?: string;
  /** Update the idea text (interactive mode). */
  onIdeaChange?: (value: string) => void;
  /** Collapse spinner motion under reduced motion (AC-5.3). */
  reducedMotion: boolean;
}

export function ScenarioRunner({
  scenario,
  status,
  mode = 'auto',
  paused = false,
  onRun,
  onReset,
  onTogglePause,
  idea = '',
  onIdeaChange,
  reducedMotion,
}: ScenarioRunnerProps) {
  const isIdle = status === 'idle';
  const isRunning = status === 'running' || status === 'paused-at-gate';

  // ---------- passive auto mode (default) ----------
  if (mode === 'auto') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium">Building:</span>
          <Badge variant="secondary">{scenario.label}</Badge>
        </div>
        <span className="text-xs text-muted-foreground">Scripted demo · no AI, no network</span>

        <div className="flex items-center gap-2 ml-auto">
          {/* Pause/Play only matters when there's motion to pause. */}
          {!reducedMotion && onTogglePause && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePause}
              aria-label={paused ? 'Resume the pipeline animation' : 'Pause the pipeline animation'}
              className="gap-1.5"
            >
              {paused ? <Play className="w-3.5 h-3.5" aria-hidden="true" /> : <Pause className="w-3.5 h-3.5" aria-hidden="true" />}
              {paused ? 'Play' : 'Pause'}
            </Button>
          )}
          <Button
            id={RUN_BUTTON_ID}
            variant="outline"
            size="sm"
            onClick={onReset}
            aria-label="Replay the pipeline from the start"
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Replay
          </Button>
        </div>
      </div>
    );
  }

  // ---------- retained interactive mode ----------
  const runLabel = isIdle ? 'Run pipeline' : isRunning ? 'Running…' : 'Completed';
  return (
    <div className="rounded-xl border border-border/60 dark:border-border/70 bg-card/60 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
        <span className="font-medium">Scenario</span>
        <Badge variant="secondary" className="ml-1">
          {scenario.label}
        </Badge>
      </div>

      <label htmlFor="aigentloop-idea" className="block text-sm text-muted-foreground mb-1.5">
        Your idea (optional — this demo runs the canned {scenario.label} build)
      </label>
      <input
        id="aigentloop-idea"
        type="text"
        value={idea}
        onChange={(e) => onIdeaChange?.(e.target.value)}
        disabled={isRunning}
        placeholder="e.g. a weather dashboard"
        className={cn(
          'w-full rounded-md border border-border/60 dark:border-input bg-background px-3 py-2 text-sm',
          'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      />

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button
          id={RUN_BUTTON_ID}
          onClick={onRun}
          disabled={!isIdle}
          aria-label="Run the AIgentLoop pipeline"
          className="gap-2"
        >
          {isRunning ? (
            <Loader2 className={cn('w-4 h-4', !reducedMotion && 'animate-spin')} aria-hidden="true" />
          ) : (
            <Play className="w-4 h-4" aria-hidden="true" />
          )}
          {runLabel}
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isIdle}
          aria-label="Reset the pipeline"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Reset
        </Button>
      </div>
    </div>
  );
}
