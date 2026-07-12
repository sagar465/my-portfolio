/**
 * Flagship engine — type set (architecture §3.2).
 *
 * These types model the script-driven, 100%-canned AIgentLoop demo: six agents,
 * one human gate, one self-correcting REVISE loop, ending at "Diff ready for human
 * commit". There is NO network, NO LLM, NO backend anywhere in this engine — the
 * scenario data IS the script (AC-4.8). Fully typed, no `any` (rubric non-neg #2).
 */

/** The six flagship agents, in their exact pipeline order (AC-4.2). */
export type AgentId =
  | 'requirements'
  | 'design'
  | 'architecture'
  | 'implementer'
  | 'tester'
  | 'handoff';

/** Lifecycle status of a single agent card. */
export type AgentStatus = 'idle' | 'active' | 'done' | 'revise';

/** Lifecycle status of a single artifact node in the artifact graph. */
export type ArtifactStatus = 'pending' | 'active' | 'done';

/** A canned artifact an agent produces (shown in the artifact graph). */
export interface Artifact {
  id: string;
  title: string;
  body: string;
}

/**
 * Static definition of one agent: its display label, the streamed status lines,
 * the artifact it advances to `done`, and its canned per-step duration (respected
 * by the P4 timer loop; collapses to instant under reduced motion — architecture
 * §3.2/§4.1). Pure data — no behavior.
 */
export interface AgentDef {
  id: AgentId;
  /** Resume-exact phase label, e.g. "Requirements (Jira)". */
  label: string;
  /** Streamed one-by-one, e.g. "Product-Owner drafting requirements…". */
  statusLines: string[];
  /** The canned artifact this agent produces. */
  artifact: Artifact;
  /** Canned timing per agent (ms); the reducer never reads clocks — P4 owns timers. */
  durationMs: number;
}

/** A human-gate definition attached to a `gate` step. */
export interface GateDef {
  id: string;
  /** e.g. "Awaiting your approval: requirements". */
  prompt: string;
  /** Which agent's output this gate reviews. */
  forAgent: AgentId;
}

/** A canned REVISE edge: a QA-style failure routing back to a prior agent. */
export interface ReviseDef {
  from: AgentId;
  to: AgentId;
  reason: string;
}

/**
 * One ordered step in the scenario script. A step is exactly one of:
 * - an `agent` run,
 * - a human `gate` (pauses for APPROVE/REVISE),
 * - a canned `revise` loop (auto-fires the tester→implementer feedback).
 */
export interface ScenarioStep {
  kind: 'agent' | 'gate' | 'revise';
  agent?: AgentId;
  gate?: GateDef;
  revise?: ReviseDef;
}

/** The one shipped scenario (weather-dashboard) — agents + ordered steps. */
export interface Scenario {
  id: string;
  label: string;
  agents: AgentDef[];
  steps: ScenarioStep[];
}

/** The high-level engine phase (architecture §3.3 state table). */
export type EngineStatus = 'idle' | 'running' | 'paused-at-gate' | 'done';

/**
 * The full engine state. Pure, serializable, no functions/refs. `cursor` is the
 * index into `scenario.steps`. Per-agent + per-artifact statuses are derived and
 * stored explicitly so the UI (P4) renders directly from state.
 */
export interface EngineState {
  status: EngineStatus;
  scenario: Scenario;
  /** Index of the CURRENT step in `scenario.steps`. */
  cursor: number;
  /** Status of each of the six agents, keyed by id. */
  agents: Record<AgentId, AgentStatus>;
  /** Status of each artifact, keyed by artifact id. */
  artifacts: Record<string, ArtifactStatus>;
  /** The gate awaiting a decision while `status === 'paused-at-gate'`, else null. */
  activeGate: GateDef | null;
  /** The revise edge currently being shown, else null (cleared once re-run). */
  activeRevise: ReviseDef | null;
  /**
   * Index of the status line currently streamed for the active agent. -1 when no
   * agent is streaming. The UI reveals `statusLines[0..streamIndex]`.
   */
  streamIndex: number;
  /**
   * Guard flag (architecture §3.3 / AC-4.10). Set true for the duration of a gate
   * decision transition so a second rapid gate event is a no-op — exactly one
   * transition per decision. Cleared on the next TICK.
   */
  transitioning: boolean;
  /** The terminal message shown in the `done` state (AC-4.6). */
  finalMessage: string | null;
}

/**
 * The discriminated-union event set the pure reducer processes (architecture
 * §3.2/§3.3). Timers live in P4's Pipeline.tsx, which dispatches `TICK`; the
 * reducer itself is pure and clock-free.
 */
export type EngineEvent =
  | { type: 'RUN' }
  | { type: 'TICK' }
  | { type: 'REACH_GATE' }
  | { type: 'APPROVE' }
  | { type: 'REVISE' }
  | { type: 'ENTER_REVISE_LOOP' }
  | { type: 'RESET' };
