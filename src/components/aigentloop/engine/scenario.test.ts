/**
 * scenario.test.ts — asserts the canned scenario's SHAPE against the acceptance
 * criteria (requirements.md AC-4.2/4.3/4.5/4.6), not against the implementation.
 * The scenario is the contract the flagship demo is measured against.
 */

import { describe, it, expect } from 'vitest';
import {
  FINAL_MESSAGE,
  WEATHER_DASHBOARD_AGENTS,
  WEATHER_DASHBOARD_SCENARIO,
  WEATHER_DASHBOARD_STEPS,
} from './scenario';
import type { AgentId } from './types';

const EXPECTED_ORDER: AgentId[] = [
  'requirements',
  'design',
  'architecture',
  'implementer',
  'tester',
  'handoff',
];

describe('weather-dashboard scenario — agents', () => {
  it('defines exactly 6 agents (AC-4.2 — 6 agents, not 9)', () => {
    expect(WEATHER_DASHBOARD_AGENTS).toHaveLength(6);
    expect(WEATHER_DASHBOARD_SCENARIO.agents).toHaveLength(6);
  });

  it('lists the 6 agents in the exact resume order (AC-4.2)', () => {
    expect(WEATHER_DASHBOARD_AGENTS.map((a) => a.id)).toEqual(EXPECTED_ORDER);
  });

  it('carries the exact resume phase labels', () => {
    const labels = WEATHER_DASHBOARD_AGENTS.map((a) => a.label);
    expect(labels).toEqual([
      'Requirements (Jira)',
      'Design (Figma · MCP)',
      'Architecture (tech design)',
      'Implementer (build + unit)',
      'Tester (QA · visual)',
      'Handoff (release)',
    ]);
  });

  it('gives every agent at least one streamed status line and a non-empty artifact', () => {
    for (const agent of WEATHER_DASHBOARD_AGENTS) {
      expect(agent.statusLines.length).toBeGreaterThan(0);
      expect(agent.artifact.id).toBeTruthy();
      expect(agent.artifact.title).toBeTruthy();
      expect(agent.artifact.body).toBeTruthy();
      expect(agent.durationMs).toBeGreaterThan(0);
    }
  });

  it('uses unique artifact ids (artifact graph nodes are distinct)', () => {
    const ids = WEATHER_DASHBOARD_AGENTS.map((a) => a.artifact.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('weather-dashboard scenario — steps', () => {
  it('opens with the Requirements agent step (AC-4.1)', () => {
    const first = WEATHER_DASHBOARD_STEPS[0];
    expect(first?.kind).toBe('agent');
    expect(first?.agent).toBe('requirements');
  });

  it('has exactly one gate — gate-1, after Requirements (AC-4.3)', () => {
    const gates = WEATHER_DASHBOARD_STEPS.filter((s) => s.kind === 'gate');
    expect(gates).toHaveLength(1);
    const gate = gates[0]?.gate;
    expect(gate?.id).toBe('gate-1');
    expect(gate?.forAgent).toBe('requirements');
    expect(gate?.prompt).toContain('approval');

    // gate-1 immediately follows the Requirements agent step.
    const gateIndex = WEATHER_DASHBOARD_STEPS.findIndex((s) => s.kind === 'gate');
    const prev = WEATHER_DASHBOARD_STEPS[gateIndex - 1];
    expect(prev?.kind).toBe('agent');
    expect(prev?.agent).toBe('requirements');
  });

  it('has exactly one canned revise — tester → implementer, contrast bug (AC-4.5)', () => {
    const revises = WEATHER_DASHBOARD_STEPS.filter((s) => s.kind === 'revise');
    expect(revises).toHaveLength(1);
    const revise = revises[0]?.revise;
    expect(revise?.from).toBe('tester');
    expect(revise?.to).toBe('implementer');
    expect(revise?.reason).toBe('contrast bug on the temp card');
  });

  it('places the revise after the first Tester run and before a re-work + re-verify', () => {
    const reviseIndex = WEATHER_DASHBOARD_STEPS.findIndex((s) => s.kind === 'revise');
    // The step before the revise is the Tester run that failed.
    expect(WEATHER_DASHBOARD_STEPS[reviseIndex - 1]?.agent).toBe('tester');
    // The step after the revise is the Implementer re-work.
    expect(WEATHER_DASHBOARD_STEPS[reviseIndex + 1]?.agent).toBe('implementer');
    // Followed by a Tester re-verify.
    expect(WEATHER_DASHBOARD_STEPS[reviseIndex + 2]?.agent).toBe('tester');
  });

  it('ends on the Handoff agent step (AC-4.6)', () => {
    const last = WEATHER_DASHBOARD_STEPS[WEATHER_DASHBOARD_STEPS.length - 1];
    expect(last?.kind).toBe('agent');
    expect(last?.agent).toBe('handoff');
  });

  it('every agent step references a defined agent (no orphan step)', () => {
    const definedIds = new Set(WEATHER_DASHBOARD_AGENTS.map((a) => a.id));
    for (const step of WEATHER_DASHBOARD_STEPS) {
      if (step.kind === 'agent') {
        expect(step.agent).toBeDefined();
        expect(definedIds.has(step.agent as AgentId)).toBe(true);
      }
    }
  });
});

describe('weather-dashboard scenario — terminal state', () => {
  it('exposes the exact final message "Diff ready for human commit" (AC-4.6)', () => {
    expect(FINAL_MESSAGE).toBe('Diff ready for human commit');
  });

  it('has a stable scenario id + label', () => {
    expect(WEATHER_DASHBOARD_SCENARIO.id).toBe('weather-dashboard');
    expect(WEATHER_DASHBOARD_SCENARIO.label).toBeTruthy();
  });
});
