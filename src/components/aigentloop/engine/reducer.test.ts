/**
 * reducer.test.ts — the phase's PRIMARY gate. Asserts EVERY transition in the
 * architecture §3.3 state table, both ways, from the acceptance criteria (AC-4.1
 * through AC-4.10 at the logic level), NOT from the implementation.
 *
 * The reducer is PURE, so every case is a plain `(state, event) => state` check —
 * no timers, no DOM, no mocks.
 */

import { describe, it, expect } from 'vitest';
import { engineReducer, initEngineState } from './reducer';
import { FINAL_MESSAGE, WEATHER_DASHBOARD_SCENARIO } from './scenario';
import type { AgentId, EngineEvent, EngineState } from './types';

/** Fresh initial state for each test. */
function fresh(): EngineState {
  return initEngineState(WEATHER_DASHBOARD_SCENARIO);
}

/** Apply a sequence of events to a state. */
function apply(state: EngineState, events: EngineEvent[]): EngineState {
  return events.reduce((s, e) => engineReducer(s, e), state);
}

/**
 * Drive the pipeline until it settles in a non-running state (paused-at-gate or
 * done), or until a frame budget is hit. Dispatches TICK, and auto-emits
 * REACH_GATE / ENTER_REVISE_LOOP when the cursor lands on those step kinds — this
 * mirrors what P4's timer loop will do, letting the tests reach every state.
 */
function run(state: EngineState, opts: { stopAtGate?: boolean } = {}): EngineState {
  let s = state;
  // Kick off an idle pipeline (TICK is a no-op from idle by design).
  if (s.status === 'idle') s = engineReducer(s, { type: 'RUN' });
  for (let i = 0; i < 200; i += 1) {
    if (s.status === 'done') return s;
    if (s.status === 'paused-at-gate') {
      if (opts.stopAtGate) return s;
      s = engineReducer(s, { type: 'APPROVE' });
      continue;
    }
    const step = s.scenario.steps[s.cursor];
    if (step?.kind === 'gate') {
      s = engineReducer(s, { type: 'REACH_GATE' });
      continue;
    }
    if (step?.kind === 'revise') {
      s = engineReducer(s, { type: 'ENTER_REVISE_LOOP' });
      // then TICK to re-run the target agent
      s = engineReducer(s, { type: 'TICK' });
      continue;
    }
    s = engineReducer(s, { type: 'TICK' });
  }
  return s;
}

// ── initial state ──────────────────────────────────────────────────────────
describe('initEngineState', () => {
  it('starts idle with every agent idle and every artifact pending', () => {
    const s = fresh();
    expect(s.status).toBe('idle');
    expect(s.cursor).toBe(0);
    expect(s.activeGate).toBeNull();
    expect(s.activeRevise).toBeNull();
    expect(s.streamIndex).toBe(-1);
    expect(s.transitioning).toBe(false);
    expect(s.finalMessage).toBeNull();
    for (const agent of s.scenario.agents) {
      expect(s.agents[agent.id]).toBe('idle');
      expect(s.artifacts[agent.artifact.id]).toBe('pending');
    }
  });

  it('defaults to the weather-dashboard scenario when none is passed', () => {
    const s = initEngineState();
    expect(s.scenario.id).toBe('weather-dashboard');
  });
});

// ── RUN ────────────────────────────────────────────────────────────────────
describe('RUN', () => {
  it('idle → running: first agent (Requirements) active + streaming (AC-4.1)', () => {
    const s = engineReducer(fresh(), { type: 'RUN' });
    expect(s.status).toBe('running');
    expect(s.cursor).toBe(0);
    expect(s.agents.requirements).toBe('active');
    expect(s.artifacts['requirements.md']).toBe('active');
    expect(s.streamIndex).toBe(0);
  });

  it('is a no-op from any non-idle state (running)', () => {
    const running = engineReducer(fresh(), { type: 'RUN' });
    const again = engineReducer(running, { type: 'RUN' });
    expect(again).toEqual(running);
  });

  it('is a no-op from done', () => {
    const done = run(fresh());
    expect(done.status).toBe('done');
    expect(engineReducer(done, { type: 'RUN' })).toEqual(done);
  });
});

// ── TICK ───────────────────────────────────────────────────────────────────
describe('TICK', () => {
  it('reveals the next status line while an agent is still streaming (AC-4.2)', () => {
    let s = engineReducer(fresh(), { type: 'RUN' });
    expect(s.streamIndex).toBe(0);
    s = engineReducer(s, { type: 'TICK' });
    expect(s.streamIndex).toBe(1);
    expect(s.agents.requirements).toBe('active'); // still active, not yet done
  });

  it('marks the agent + its artifact done when streaming ends, then pauses at gate-1', () => {
    // Requirements has 3 lines → streamIndex 0,1,2 then finish on the next TICK.
    let s = engineReducer(fresh(), { type: 'RUN' }); // streamIndex 0
    s = engineReducer(s, { type: 'TICK' }); // 1
    s = engineReducer(s, { type: 'TICK' }); // 2 (last line)
    s = engineReducer(s, { type: 'TICK' }); // finish → advance to gate step
    expect(s.agents.requirements).toBe('done');
    expect(s.artifacts['requirements.md']).toBe('done');
    // The next step is gate-1 → advanceCursor lands paused-at-gate.
    expect(s.status).toBe('paused-at-gate');
    expect(s.activeGate?.id).toBe('gate-1');
  });

  it('is a no-op from idle (clears no state, stays idle)', () => {
    const s = engineReducer(fresh(), { type: 'TICK' });
    expect(s.status).toBe('idle');
  });

  it('clears a stale transitioning flag even when not running', () => {
    const paused = run(fresh(), { stopAtGate: true });
    const approved = engineReducer(paused, { type: 'APPROVE' }); // transitioning true
    expect(approved.transitioning).toBe(true);
    // Design is now active/running; a TICK clears the flag as it streams.
    const ticked = engineReducer(approved, { type: 'TICK' });
    expect(ticked.transitioning).toBe(false);
  });

  it('handles a TICK on a paused (non-running) state with transitioning set → clears it', () => {
    const paused = run(fresh(), { stopAtGate: true });
    const withFlag: EngineState = { ...paused, transitioning: true };
    const ticked = engineReducer(withFlag, { type: 'TICK' });
    expect(ticked.transitioning).toBe(false);
    expect(ticked.status).toBe('paused-at-gate');
  });
});

// ── REACH_GATE ─────────────────────────────────────────────────────────────
describe('REACH_GATE', () => {
  it('running (cursor on gate) → paused-at-gate with the gate exposed (AC-4.3)', () => {
    // Advance until the cursor sits on the gate step but still running.
    let s = engineReducer(fresh(), { type: 'RUN' });
    // finish requirements streaming so advanceCursor moves onto the gate.
    // advanceCursor auto-pauses; to test REACH_GATE explicitly, reconstruct a
    // running state whose cursor points at the gate step (index 1).
    const gateCursor = WEATHER_DASHBOARD_SCENARIO.steps.findIndex((x) => x.kind === 'gate');
    const runningAtGate: EngineState = { ...s, status: 'running', cursor: gateCursor };
    s = engineReducer(runningAtGate, { type: 'REACH_GATE' });
    expect(s.status).toBe('paused-at-gate');
    expect(s.activeGate?.id).toBe('gate-1');
    expect(s.streamIndex).toBe(-1);
  });

  it('is a no-op when not running', () => {
    const s = fresh();
    expect(engineReducer(s, { type: 'REACH_GATE' })).toEqual(s);
  });

  it('is a no-op when the cursor is not on a gate step', () => {
    const running = engineReducer(fresh(), { type: 'RUN' }); // cursor on an agent step
    expect(engineReducer(running, { type: 'REACH_GATE' })).toEqual(running);
  });
});

// ── APPROVE ────────────────────────────────────────────────────────────────
describe('APPROVE', () => {
  it('paused-at-gate → running: resumes to the next agent, clears the gate (AC-4.4)', () => {
    const paused = run(fresh(), { stopAtGate: true });
    expect(paused.status).toBe('paused-at-gate');
    const s = engineReducer(paused, { type: 'APPROVE' });
    expect(s.status).toBe('running');
    expect(s.activeGate).toBeNull();
    expect(s.agents.design).toBe('active'); // next agent after Requirements
    expect(s.transitioning).toBe(true); // guard set until next TICK
  });

  it('is a no-op from any non-paused state — running (AC-4.10)', () => {
    const running = engineReducer(fresh(), { type: 'RUN' });
    expect(engineReducer(running, { type: 'APPROVE' })).toEqual(running);
  });

  it('is a no-op from idle', () => {
    const s = fresh();
    expect(engineReducer(s, { type: 'APPROVE' })).toEqual(s);
  });

  it('is a no-op from done', () => {
    const done = run(fresh());
    expect(engineReducer(done, { type: 'APPROVE' })).toEqual(done);
  });

  it('double-dispatch of APPROVE yields exactly ONE transition (AC-4.10 guard)', () => {
    const paused = run(fresh(), { stopAtGate: true });
    const once = engineReducer(paused, { type: 'APPROVE' });
    const twice = engineReducer(once, { type: 'APPROVE' }); // transitioning → no-op
    expect(twice).toEqual(once);
    expect(twice.agents.design).toBe('active');
    // architecture must NOT have advanced twice (would be 'active' if it did).
    expect(twice.agents.architecture).toBe('idle');
  });
});

// ── REVISE (visitor-triggered at the gate) ──────────────────────────────────
describe('REVISE', () => {
  it('paused-at-gate → running: routes back to the gate agent, marks it revise (AC-4.5)', () => {
    const paused = run(fresh(), { stopAtGate: true });
    const s = engineReducer(paused, { type: 'REVISE' });
    expect(s.status).toBe('running');
    expect(s.activeGate).toBeNull();
    // gate-1 is for requirements → re-runs requirements, visibly marked revise.
    expect(s.agents.requirements).toBe('active');
    expect(s.activeRevise?.to).toBe('requirements');
    expect(s.transitioning).toBe(true);
    // cursor lands on the requirements agent step (index 0).
    expect(s.cursor).toBe(0);
  });

  it('is a no-op from any non-paused state', () => {
    const running = engineReducer(fresh(), { type: 'RUN' });
    expect(engineReducer(running, { type: 'REVISE' })).toEqual(running);
  });

  it('double-dispatch of REVISE yields exactly ONE transition (AC-4.10 guard)', () => {
    const paused = run(fresh(), { stopAtGate: true });
    const once = engineReducer(paused, { type: 'REVISE' });
    const twice = engineReducer(once, { type: 'REVISE' });
    expect(twice).toEqual(once);
  });

  it('is a no-op if there is somehow no active gate while paused', () => {
    const paused = run(fresh(), { stopAtGate: true });
    const noGate: EngineState = { ...paused, activeGate: null };
    expect(engineReducer(noGate, { type: 'REVISE' })).toEqual(noGate);
  });
});

// ── ENTER_REVISE_LOOP (canned tester → implementer) ─────────────────────────
describe('ENTER_REVISE_LOOP', () => {
  it('fires the canned tester→implementer loop, marking tester done + implementer revise (AC-4.5)', () => {
    // Drive to the revise step: run through the gate then advance to just after Tester.
    let s = run(fresh(), { stopAtGate: true });
    s = engineReducer(s, { type: 'APPROVE' }); // resume past gate-1
    // Now TICK/advance through design, architecture, implementer, tester until the
    // cursor sits on the revise step.
    for (let i = 0; i < 100; i += 1) {
      const step = s.scenario.steps[s.cursor];
      if (step?.kind === 'revise') break;
      s = engineReducer(s, { type: 'TICK' });
    }
    const step = s.scenario.steps[s.cursor];
    expect(step?.kind).toBe('revise');
    expect(s.status).toBe('running');

    const revised = engineReducer(s, { type: 'ENTER_REVISE_LOOP' });
    expect(revised.agents.tester).toBe('done');
    expect(revised.agents.implementer).toBe('revise');
    expect(revised.activeRevise).toEqual({
      from: 'tester',
      to: 'implementer',
      reason: 'contrast bug on the temp card',
    });
  });

  it('is a no-op when not running', () => {
    const s = fresh();
    expect(engineReducer(s, { type: 'ENTER_REVISE_LOOP' })).toEqual(s);
  });

  it('is a no-op when the cursor is not on a revise step', () => {
    const running = engineReducer(fresh(), { type: 'RUN' });
    expect(engineReducer(running, { type: 'ENTER_REVISE_LOOP' })).toEqual(running);
  });

  it('on the next TICK, re-runs the implementer (active + streaming)', () => {
    let s = run(fresh(), { stopAtGate: true });
    s = engineReducer(s, { type: 'APPROVE' });
    for (let i = 0; i < 100; i += 1) {
      const step = s.scenario.steps[s.cursor];
      if (step?.kind === 'revise') break;
      s = engineReducer(s, { type: 'TICK' });
    }
    s = engineReducer(s, { type: 'ENTER_REVISE_LOOP' });
    const rerun = engineReducer(s, { type: 'TICK' });
    expect(rerun.agents.implementer).toBe('active');
    expect(rerun.streamIndex).toBe(0);
    expect(rerun.activeRevise).toBeNull();
  });
});

// ── full run to done ────────────────────────────────────────────────────────
describe('full pipeline run', () => {
  it('reaches done with the exact final message (AC-4.6)', () => {
    const done = run(fresh());
    expect(done.status).toBe('done');
    expect(done.finalMessage).toBe(FINAL_MESSAGE);
    expect(done.finalMessage).toBe('Diff ready for human commit');
    expect(done.activeGate).toBeNull();
    expect(done.activeRevise).toBeNull();
  });

  it('marks all six agents done at the end', () => {
    const done = run(fresh());
    const ids: AgentId[] = [
      'requirements',
      'design',
      'architecture',
      'implementer',
      'tester',
      'handoff',
    ];
    for (const id of ids) {
      expect(done.agents[id]).toBe('done');
    }
  });

  it('marks every artifact done at the end', () => {
    const done = run(fresh());
    for (const value of Object.values(done.artifacts)) {
      expect(value).toBe('done');
    }
  });

  it('advances the six agents through the exact order via a REVISE at the gate too', () => {
    // A run where the visitor REVISES once, then APPROVEs, still completes.
    let s = run(fresh(), { stopAtGate: true });
    s = engineReducer(s, { type: 'REVISE' }); // re-run requirements
    // stream requirements again to completion → back to the gate.
    s = run(s, { stopAtGate: true });
    expect(s.status).toBe('paused-at-gate');
    s = engineReducer(s, { type: 'APPROVE' });
    s = run(s);
    expect(s.status).toBe('done');
    expect(s.finalMessage).toBe(FINAL_MESSAGE);
  });
});

// ── RESET from EVERY state (AC-4.9) ─────────────────────────────────────────
describe('RESET (AC-4.9 — clean initial from any state)', () => {
  const clean = fresh();

  it('from idle → clean initial', () => {
    expect(engineReducer(fresh(), { type: 'RESET' })).toEqual(clean);
  });

  it('from running → clean initial (no leftover active agents/artifacts)', () => {
    const running = engineReducer(fresh(), { type: 'RUN' });
    expect(running.agents.requirements).toBe('active');
    const reset = engineReducer(running, { type: 'RESET' });
    expect(reset).toEqual(clean);
    expect(reset.agents.requirements).toBe('idle');
  });

  it('from paused-at-gate → clean initial (no leftover paused gate)', () => {
    const paused = run(fresh(), { stopAtGate: true });
    expect(paused.activeGate).not.toBeNull();
    const reset = engineReducer(paused, { type: 'RESET' });
    expect(reset).toEqual(clean);
    expect(reset.activeGate).toBeNull();
  });

  it('from a revise state → clean initial (no leftover revise)', () => {
    let s = run(fresh(), { stopAtGate: true });
    s = engineReducer(s, { type: 'REVISE' });
    expect(s.activeRevise).not.toBeNull();
    const reset = engineReducer(s, { type: 'RESET' });
    expect(reset).toEqual(clean);
    expect(reset.activeRevise).toBeNull();
  });

  it('from done → clean initial (no leftover done artifacts, re-run works)', () => {
    const done = run(fresh());
    expect(done.status).toBe('done');
    const reset = engineReducer(done, { type: 'RESET' });
    expect(reset).toEqual(clean);
    for (const value of Object.values(reset.artifacts)) {
      expect(value).toBe('pending');
    }
    // re-run after reset behaves exactly like a first run.
    const rerun = engineReducer(reset, { type: 'RUN' });
    expect(rerun.agents.requirements).toBe('active');
  });

  it('preserves the scenario identity across RESET', () => {
    const reset = engineReducer(run(fresh()), { type: 'RESET' });
    expect(reset.scenario.id).toBe(WEATHER_DASHBOARD_SCENARIO.id);
  });
});

// ── unknown / defensive ─────────────────────────────────────────────────────
describe('defensive behavior', () => {
  it('returns the same state for an unknown event type', () => {
    const s = fresh();
    // @ts-expect-error — deliberately invalid event to prove the default branch.
    expect(engineReducer(s, { type: 'NOPE' })).toEqual(s);
  });

  it('does not mutate the input state (immutability)', () => {
    const s = fresh();
    const snapshot = JSON.stringify(s);
    engineReducer(s, { type: 'RUN' });
    expect(JSON.stringify(s)).toBe(snapshot);
  });
});

// ── malformed-input guards (the reducer degrades safely, never throws) ───────
// These feed deliberately-malformed scenario/state shapes to exercise the
// type-safety guards that a well-formed scenario never reaches, proving the pure
// reducer returns a safe state instead of throwing on bad input.
describe('degrades safely on malformed input', () => {
  /** A scenario whose first step is a gate (not an agent). */
  function scenarioFirstStepGate() {
    const base = fresh();
    return {
      ...base,
      scenario: {
        ...base.scenario,
        steps: [{ kind: 'gate' as const, gate: { id: 'g', prompt: 'p', forAgent: 'requirements' as AgentId } }],
      },
    };
  }

  it('RUN is a no-op when the first step is not an agent step (guard L172)', () => {
    const s = scenarioFirstStepGate();
    expect(engineReducer(s, { type: 'RUN' })).toEqual(s);
  });

  it('RUN is a no-op when there are no steps at all', () => {
    const base = fresh();
    const s = { ...base, scenario: { ...base.scenario, steps: [] } };
    expect(engineReducer(s, { type: 'RUN' })).toEqual(s);
  });

  it('RUN on an agent step whose `agent` is missing returns state unchanged (guard L79)', () => {
    const base = fresh();
    const s = {
      ...base,
      scenario: { ...base.scenario, steps: [{ kind: 'agent' as const }] },
    };
    // activateAgentStep hits `if (!id) return state` → cursor 0, still idle shape.
    const out = engineReducer(s, { type: 'RUN' });
    expect(out.agents.requirements).toBe('idle');
  });

  it('TICK on an agent step with an unknown agent id finishes without an artifact (guards L85/L206/L218)', () => {
    const base = fresh();
    const unknown = 'ghost' as AgentId;
    const s: EngineState = {
      ...base,
      status: 'running',
      cursor: 0,
      streamIndex: 0,
      scenario: {
        ...base.scenario,
        steps: [{ kind: 'agent', agent: unknown }],
      },
    };
    // lineCount 0 (no def) → streamIndex (0) is NOT < -1 → finish path with no def.
    const out = engineReducer(s, { type: 'TICK' });
    expect(out.status).toBe('done'); // advanceCursor off the only step → done
  });

  it('TICK is a safe no-op when the cursor is past the last step while running (guard L184)', () => {
    const base = fresh();
    const s: EngineState = {
      ...base,
      status: 'running',
      cursor: base.scenario.steps.length + 5,
      transitioning: true,
    };
    const out = engineReducer(s, { type: 'TICK' });
    expect(out.transitioning).toBe(false);
  });

  it('TICK re-runs a revise step whose target agent is unknown, without an artifact (guard L193)', () => {
    const base = fresh();
    const s: EngineState = {
      ...base,
      status: 'running',
      cursor: 0,
      scenario: {
        ...base.scenario,
        steps: [
          { kind: 'revise', revise: { from: 'tester', to: 'ghost' as AgentId, reason: 'x' } },
          { kind: 'agent', agent: 'ghost' as AgentId },
        ],
      },
    };
    const out = engineReducer(s, { type: 'TICK' });
    // agents map gains the ghost key as active; no throw on the missing def.
    expect(out.agents['ghost' as AgentId]).toBe('active');
    expect(out.activeRevise).toBeNull();
  });

  it('REVISE is a no-op when the gate agent has no matching agent step (guard targetCursor < 0)', () => {
    const paused = run(fresh(), { stopAtGate: true });
    const s: EngineState = {
      ...paused,
      // point the gate at an agent that has no agent step in the script.
      activeGate: { id: 'gate-1', prompt: 'p', forAgent: 'ghost' as AgentId },
      scenario: {
        ...paused.scenario,
        steps: paused.scenario.steps.filter((x) => x.kind !== 'agent' || x.agent !== 'ghost'),
      },
    };
    expect(engineReducer(s, { type: 'REVISE' })).toEqual(s);
  });

  it('ENTER_REVISE_LOOP with an unknown target still marks statuses, no throw (guard L271)', () => {
    const base = fresh();
    const s: EngineState = {
      ...base,
      status: 'running',
      cursor: 0,
      scenario: {
        ...base.scenario,
        steps: [{ kind: 'revise', revise: { from: 'tester', to: 'ghost' as AgentId, reason: 'r' } }],
      },
    };
    const out = engineReducer(s, { type: 'ENTER_REVISE_LOOP' });
    expect(out.agents.tester).toBe('done');
    expect(out.agents['ghost' as AgentId]).toBe('revise');
  });

  it('RUN whose first agent id has no matching def still activates without an artifact (guard L85)', () => {
    const base = fresh();
    const s: EngineState = {
      ...base,
      scenario: {
        ...base.scenario,
        steps: [{ kind: 'agent', agent: 'ghost' as AgentId }],
      },
    };
    const out = engineReducer(s, { type: 'RUN' });
    expect(out.status).toBe('running');
    expect(out.agents['ghost' as AgentId]).toBe('active');
  });

  it('TICK on a running gate step (neither agent nor revise) is a safe no-op (guard L204 → L228)', () => {
    const base = fresh();
    const gateCursor = base.scenario.steps.findIndex((x) => x.kind === 'gate');
    const s: EngineState = {
      ...base,
      status: 'running',
      cursor: gateCursor,
      transitioning: true,
    };
    const out = engineReducer(s, { type: 'TICK' });
    expect(out.transitioning).toBe(false);
    expect(out.status).toBe('running');
  });
});
