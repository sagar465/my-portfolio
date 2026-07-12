/**
 * The ONE shipped, fully-canned scenario (architecture §3.2, Q3 DECIDED):
 * a "weather-dashboard" build, mirroring the M3 dogfood the AIgentLoop pipeline
 * itself ran. This module is pure static data — the script IS the data. There is
 * NO network, NO LLM, NO backend, nothing paid (AC-4.8).
 *
 * Shape contract (asserted in scenario.test.ts from the ACs, not the code):
 * - exactly 6 agents in exact order: Requirements → Design → Architecture →
 *   Implementer → Tester → Handoff (AC-4.2)
 * - exactly one human gate: `gate-1` after Requirements (AC-4.3/4.4)
 * - exactly one canned REVISE loop: Tester → Implementer, "contrast bug on the
 *   temp card" (AC-4.5)
 * - final terminal message: "Diff ready for human commit" (AC-4.6)
 */

import type { AgentDef, Scenario, ScenarioStep } from './types';

/** The terminal message shown when the pipeline reaches `done` (AC-4.6). */
export const FINAL_MESSAGE = 'Diff ready for human commit';

/**
 * The six agents in exact pipeline order with resume-exact phase labels
 * (requirements.md source-of-truth lock), each with streamed status lines and one
 * canned artifact.
 */
export const WEATHER_DASHBOARD_AGENTS: AgentDef[] = [
  {
    id: 'requirements',
    label: 'Requirements (Jira)',
    statusLines: [
      'Product-Owner drafting requirements…',
      'Deriving jobs-to-be-done + acceptance criteria…',
      'Requirements ready for your approval.',
    ],
    artifact: {
      id: 'requirements.md',
      title: 'requirements.md',
      body: 'Weather dashboard: search a city, see current conditions + a 5-day forecast. WCAG AA, mobile-first, no API keys in the client.',
    },
    durationMs: 1600,
  },
  {
    id: 'design',
    label: 'Design (Figma · MCP)',
    statusLines: [
      'Design-Analyst reading the Figma frames over MCP…',
      'Mapping tokens → components (search, current card, forecast row)…',
      'Design spec handed off.',
    ],
    artifact: {
      id: 'design-spec.md',
      title: 'design-spec.md',
      body: 'Search input, current-conditions card, 5-day forecast strip. Tokens: existing palette, 8px rhythm, reduced-motion variants.',
    },
    durationMs: 1500,
  },
  {
    id: 'architecture',
    label: 'Architecture (tech design)',
    statusLines: [
      'Solution-Architect choosing the stack…',
      'React + Vite + TanStack Query; proxy the weather API server-side…',
      'Architecture approved.',
    ],
    artifact: {
      id: 'architecture.md',
      title: 'architecture.md',
      body: 'React + Vite + TS. Server-side proxy hides the provider key. TanStack Query for fetch/cache. No secret ships to the client.',
    },
    durationMs: 1500,
  },
  {
    id: 'implementer',
    label: 'Implementer (build + unit)',
    statusLines: [
      'Fullstack-Engineer scaffolding components…',
      'Wiring the query hook + writing unit tests…',
      'Build green; unit tests passing.',
    ],
    artifact: {
      id: 'code + unit-tests',
      title: 'code + unit-tests',
      body: 'SearchBar, CurrentCard, ForecastStrip built; useWeather query hook; Vitest suite at 96% on the changed surface.',
    },
    durationMs: 1800,
  },
  {
    id: 'tester',
    label: 'Tester (QA · visual)',
    statusLines: [
      'QA-Engineer driving the running app un-mocked…',
      'Screenshotting 390 + 1440 in light + dark…',
      'Contrast bug found on the temp card — routing back.',
    ],
    artifact: {
      id: 'qa-report.md',
      title: 'qa-report.md',
      body: 'Real-path pass on the running app. Visual gate FAIL: temperature text on the current-conditions card fails AA contrast in dark theme.',
    },
    durationMs: 1600,
  },
  {
    id: 'handoff',
    label: 'Handoff (release)',
    statusLines: [
      'Re-verified: contrast fixed, all gates green…',
      'Assembling the reviewable diff…',
      FINAL_MESSAGE + '.',
    ],
    artifact: {
      id: 'release-notes.md',
      title: 'release-notes.md',
      body: 'Weather dashboard complete. Diff staged for the human to commit — the pipeline never commits, pushes, or deploys on its own.',
    },
    durationMs: 1500,
  },
];

/**
 * The ordered step script (architecture §3.2). Agents run in order; a human gate
 * pauses after Requirements; a canned REVISE fires after Tester, routing back to
 * Implementer, which then re-runs and re-verifies (Tester passes) before Handoff.
 */
export const WEATHER_DASHBOARD_STEPS: ScenarioStep[] = [
  { kind: 'agent', agent: 'requirements' },
  {
    kind: 'gate',
    gate: { id: 'gate-1', prompt: 'Awaiting your approval: requirements', forAgent: 'requirements' },
  },
  { kind: 'agent', agent: 'design' },
  { kind: 'agent', agent: 'architecture' },
  { kind: 'agent', agent: 'implementer' },
  { kind: 'agent', agent: 'tester' },
  {
    kind: 'revise',
    revise: { from: 'tester', to: 'implementer', reason: 'contrast bug on the temp card' },
  },
  { kind: 'agent', agent: 'implementer' }, // re-work
  { kind: 'agent', agent: 'tester' }, // re-verify (passes)
  { kind: 'agent', agent: 'handoff' },
];

/** The single canned scenario shipped this run (Q3 DECIDED — one scenario). */
export const WEATHER_DASHBOARD_SCENARIO: Scenario = {
  id: 'weather-dashboard',
  label: 'Weather dashboard',
  agents: WEATHER_DASHBOARD_AGENTS,
  steps: WEATHER_DASHBOARD_STEPS,
};
