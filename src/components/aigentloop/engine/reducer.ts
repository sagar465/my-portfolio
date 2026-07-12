/**
 * Flagship engine — the PURE reducer (architecture §3.3).
 *
 * This is a pure state machine: `(state, event) => state`. It has NO timers, NO
 * side effects, and reads NO clocks (`Date.now`) or randomness (`Math.random`) —
 * P4's `Pipeline.tsx` owns the `setTimeout` TICK loop and merely dispatches events
 * here. Purity is what makes every transition deterministically unit-testable.
 *
 * State table (idle → running → paused-at-gate → running → (revise → running)* →
 * done). Gate events (APPROVE/REVISE) are honored ONLY in `paused-at-gate` and are
 * guarded by a `transitioning` flag so a rapid double-activation is a no-op —
 * exactly one transition per decision (AC-4.10). RESET from ANY state returns a
 * clean initial state with no leftover done/paused artifacts (AC-4.9).
 */

import type {
  AgentId,
  AgentStatus,
  ArtifactStatus,
  EngineEvent,
  EngineState,
  Scenario,
  ScenarioStep,
} from './types';
import { FINAL_MESSAGE, WEATHER_DASHBOARD_SCENARIO } from './scenario';

/** All six agent ids initialised to `idle`. */
function initialAgents(scenario: Scenario): Record<AgentId, AgentStatus> {
  const agents = {} as Record<AgentId, AgentStatus>;
  for (const def of scenario.agents) {
    agents[def.id] = 'idle';
  }
  return agents;
}

/** Every artifact id initialised to `pending`. */
function initialArtifacts(scenario: Scenario): Record<string, ArtifactStatus> {
  const artifacts: Record<string, ArtifactStatus> = {};
  for (const def of scenario.agents) {
    artifacts[def.artifact.id] = 'pending';
  }
  return artifacts;
}

/**
 * A clean initial engine state for a scenario. Used by both the initialiser and
 * RESET so re-run == fresh run (AC-4.9). Nothing is `active`/`done`/`paused`.
 */
export function initEngineState(
  scenario: Scenario = WEATHER_DASHBOARD_SCENARIO,
): EngineState {
  return {
    status: 'idle',
    scenario,
    cursor: 0,
    agents: initialAgents(scenario),
    artifacts: initialArtifacts(scenario),
    activeGate: null,
    activeRevise: null,
    streamIndex: -1,
    transitioning: false,
    finalMessage: null,
  };
}

/** The agent def for an id (present for every valid scenario agent). */
function agentDef(state: EngineState, id: AgentId) {
  return state.scenario.agents.find((a) => a.id === id);
}

/**
 * Enter the step at `cursor`, producing the running-state shape for that step:
 * - `agent` step → mark that agent `active`, its artifact `active`, stream from 0.
 * - other step kinds are handled by their own events (REACH_GATE / ENTER_REVISE_LOOP)
 *   so `enterStep` is only ever called to (re-)activate an agent step.
 */
function activateAgentStep(state: EngineState, step: ScenarioStep): EngineState {
  const id = step.agent;
  if (!id) return state;
  const def = agentDef(state, id);
  return {
    ...state,
    status: 'running',
    agents: { ...state.agents, [id]: 'active' },
    artifacts: def
      ? { ...state.artifacts, [def.artifact.id]: 'active' }
      : state.artifacts,
    activeGate: null,
    streamIndex: 0,
    transitioning: false,
  };
}

/**
 * Advance the cursor past agent/gate/revise steps until the pipeline reaches the
 * next actionable state. Called after an agent finishes streaming, after APPROVE,
 * and after a revise re-run. Returns the next state.
 */
function advanceCursor(state: EngineState): EngineState {
  const steps = state.scenario.steps;
  const nextCursor = state.cursor + 1;

  // End of script → done (AC-4.6).
  if (nextCursor >= steps.length) {
    return {
      ...state,
      status: 'done',
      cursor: steps.length,
      activeGate: null,
      activeRevise: null,
      streamIndex: -1,
      transitioning: false,
      finalMessage: FINAL_MESSAGE,
    };
  }

  const next = steps[nextCursor];
  // `next` is guaranteed defined (nextCursor < steps.length was just checked); this
  // guard exists only to satisfy `noUncheckedIndexedAccess` and is unreachable.
  /* v8 ignore next */
  if (!next) return state;

  if (next.kind === 'gate' && next.gate) {
    // Pause at the human gate (AC-4.3).
    return {
      ...state,
      status: 'paused-at-gate',
      cursor: nextCursor,
      activeGate: next.gate,
      activeRevise: null,
      streamIndex: -1,
      transitioning: false,
    };
  }

  if (next.kind === 'revise' && next.revise) {
    // Canned QA-fail: mark the failing agent `done`, route back and re-run the
    // target agent (tester → implementer). The revise is visible (AC-4.5).
    const { from, to, reason } = next.revise;
    return {
      ...state,
      status: 'running',
      cursor: nextCursor,
      agents: { ...state.agents, [from]: 'done', [to]: 'revise' },
      activeGate: null,
      activeRevise: { from, to, reason },
      streamIndex: -1,
      transitioning: false,
    };
  }

  // Agent step → activate it.
  return activateAgentStep({ ...state, cursor: nextCursor }, next);
}

/** The step the cursor currently points at, if any. */
function currentStep(state: EngineState): ScenarioStep | undefined {
  return state.scenario.steps[state.cursor];
}

/**
 * The pure engine reducer. Ignores events that do not apply to the current state
 * (rather than throwing) so a stray dispatch is a safe no-op.
 */
export function engineReducer(state: EngineState, event: EngineEvent): EngineState {
  switch (event.type) {
    case 'RESET':
      // From ANY state → a clean initial state (AC-4.9). No leftover artifacts.
      return initEngineState(state.scenario);

    case 'RUN': {
      // Only starts from idle.
      if (state.status !== 'idle') return state;
      const first = state.scenario.steps[0];
      if (!first || first.kind !== 'agent') return state;
      return activateAgentStep({ ...state, cursor: 0 }, first);
    }

    case 'TICK': {
      // TICK only progresses a running pipeline.
      if (state.status !== 'running') {
        // Clear a stale transitioning flag even if not running.
        return state.transitioning ? { ...state, transitioning: false } : state;
      }

      const step = currentStep(state);
      if (!step) return { ...state, transitioning: false };

      // A revise step, once entered, re-runs its target agent on the next TICK.
      if (step.kind === 'revise' && step.revise) {
        const to = step.revise.to;
        const def = agentDef(state, to);
        return {
          ...state,
          agents: { ...state.agents, [to]: 'active' },
          artifacts: def
            ? { ...state.artifacts, [def.artifact.id]: 'active' }
            : state.artifacts,
          activeRevise: null,
          // Move the cursor onto the re-run agent step that follows the revise.
          cursor: state.cursor + 1,
          streamIndex: 0,
          transitioning: false,
        };
      }

      if (step.kind === 'agent' && step.agent) {
        const def = agentDef(state, step.agent);
        const lineCount = def ? def.statusLines.length : 0;

        // Still streaming this agent's status lines → reveal the next line.
        if (state.streamIndex < lineCount - 1) {
          return { ...state, streamIndex: state.streamIndex + 1, transitioning: false };
        }

        // Agent finished streaming → mark it + its artifact done, then advance.
        const finishedAgents: Record<AgentId, AgentStatus> = {
          ...state.agents,
          [step.agent]: 'done',
        };
        const finishedArtifacts = def
          ? { ...state.artifacts, [def.artifact.id]: 'done' as ArtifactStatus }
          : state.artifacts;
        return advanceCursor({
          ...state,
          agents: finishedAgents,
          artifacts: finishedArtifacts,
        });
      }

      return { ...state, transitioning: false };
    }

    case 'REACH_GATE': {
      // Honored only when the cursor sits on a gate step while running.
      if (state.status !== 'running') return state;
      const step = currentStep(state);
      if (!step || step.kind !== 'gate' || !step.gate) return state;
      return {
        ...state,
        status: 'paused-at-gate',
        activeGate: step.gate,
        streamIndex: -1,
        transitioning: false,
      };
    }

    case 'APPROVE': {
      // AC-4.4/4.10: only in paused-at-gate, only once (transitioning guard).
      if (state.status !== 'paused-at-gate' || state.transitioning) return state;
      // Advance past the gate to the next step, marking the transition in-flight
      // so a second rapid APPROVE/REVISE is a no-op until the next TICK clears it.
      return { ...advanceCursor(state), transitioning: true };
    }

    case 'REVISE': {
      // AC-4.5/4.10: visitor-triggered revise at a gate → route back to the gate's
      // agent, mark it `revise`, and re-run it. Only in paused-at-gate, only once.
      if (state.status !== 'paused-at-gate' || state.transitioning || !state.activeGate) {
        return state;
      }
      const target = state.activeGate.forAgent;
      const def = agentDef(state, target);
      // Find the agent's own step index so re-running lands on it.
      const targetCursor = state.scenario.steps.findIndex(
        (s) => s.kind === 'agent' && s.agent === target,
      );
      if (targetCursor < 0) return state;
      return {
        ...state,
        status: 'running',
        cursor: targetCursor,
        agents: { ...state.agents, [target]: 'active' },
        artifacts: def
          ? { ...state.artifacts, [def.artifact.id]: 'active' }
          : state.artifacts,
        activeGate: null,
        activeRevise: { from: 'tester', to: target, reason: 'requested revision' },
        streamIndex: 0,
        transitioning: true,
      };
    }

    case 'ENTER_REVISE_LOOP': {
      // Fire the canned tester→implementer feedback loop (AC-4.5). Honored only
      // when the cursor sits on the revise step while running.
      if (state.status !== 'running') return state;
      const step = currentStep(state);
      if (!step || step.kind !== 'revise' || !step.revise) return state;
      const { from, to, reason } = step.revise;
      return {
        ...state,
        agents: { ...state.agents, [from]: 'done', [to]: 'revise' },
        activeRevise: { from, to, reason },
        streamIndex: -1,
        transitioning: false,
      };
    }

    default:
      return state;
  }
}
