/**
 * GateControls — the human-gate APPROVE / REVISE buttons (interactive mode only).
 *
 * The passive flagship auto-approves the gate with a visible beat (D-009), so these
 * buttons render only when Pipeline runs in `mode="interactive"` (keyboard/a11y use
 * and tests). They are two distinct real `<button>`s, each with an explicit
 * `aria-label`; the pipeline does not advance until one is chosen. The APPROVE button
 * carries a stable `id` so Pipeline can focus it when the gate is reached (§4.4 — the
 * shadcn Button is not a forwardRef, so focus is by id, not ref). The stable `#gate-1`
 * deep-link target lives on the always-present gate diamond in `SignalFlow`, so it
 * resolves regardless of mode (AC-6.2).
 *
 * Buttons are the shadcn `ui/button` → Space/Enter fire natively (AC-5.1). No timers,
 * no engine logic — it only emits the caller's `onApprove` / `onRevise`.
 */

import { Check, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import type { GateDef } from './engine/types';

/** Stable id of the APPROVE button so Pipeline can focus it on REACH_GATE (§4.4). */
export const APPROVE_BUTTON_ID = 'aigentloop-approve';

export interface GateControlsProps {
  /** The gate awaiting a decision, or null when the pipeline is not paused. */
  gate: GateDef | null;
  /** Called when the visitor approves — advances the pipeline (AC-4.4). */
  onApprove: () => void;
  /** Called when the visitor requests a revision — routes back (AC-4.5). */
  onRevise: () => void;
}

/**
 * Render the gate buttons, or nothing when `gate` is null (both-ways contract).
 */
export function GateControls({ gate, onApprove, onRevise }: GateControlsProps) {
  if (!gate) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button id={APPROVE_BUTTON_ID} onClick={onApprove} aria-label="Approve requirements" className="gap-2">
        <Check className="w-4 h-4" aria-hidden="true" />
        Approve
      </Button>
      <Button variant="outline" onClick={onRevise} aria-label="Request revision" className="gap-2">
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        Request revision
      </Button>
    </div>
  );
}
