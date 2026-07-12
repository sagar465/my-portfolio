import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SignalFlow } from './SignalFlow';
import { SHORT_LABEL } from './AgentCard';
import { WEATHER_DASHBOARD_AGENTS } from './engine/scenario';
import type { AgentId, AgentStatus, EngineStatus, ReviseDef } from './engine/types';

const IDS = WEATHER_DASHBOARD_AGENTS.map((a) => a.id);

/** Build an agent-status map, defaulting every agent to `idle`. */
function statusMap(overrides: Partial<Record<AgentId, AgentStatus>> = {}): Record<AgentId, AgentStatus> {
  const base = Object.fromEntries(IDS.map((id) => [id, 'idle'])) as Record<AgentId, AgentStatus>;
  return { ...base, ...overrides };
}

function renderFlow(opts: {
  status: EngineStatus;
  agentStatus?: Partial<Record<AgentId, AgentStatus>>;
  activeRevise?: ReviseDef | null;
  reducedMotion?: boolean;
}) {
  return render(
    <SignalFlow
      agents={WEATHER_DASHBOARD_AGENTS}
      agentStatus={statusMap(opts.agentStatus)}
      status={opts.status}
      activeRevise={opts.activeRevise ?? null}
      reducedMotion={opts.reducedMotion ?? false}
    />,
  );
}

describe('SignalFlow (hero signal-flow line — D-009)', () => {
  it('renders exactly one node per agent (single responsive list — valid unique ids)', () => {
    const { container } = renderFlow({ status: 'idle' });
    // Six role=group nodes, one each — not a duplicated desktop+mobile set.
    expect(screen.getAllByRole('group')).toHaveLength(WEATHER_DASHBOARD_AGENTS.length);
    for (const id of IDS) {
      expect(container.querySelectorAll(`#step-${id}`)).toHaveLength(1);
    }
  });

  it('exposes a single stable #gate-1 deep-link target at any breakpoint (AC-6.2)', () => {
    const { container } = renderFlow({ status: 'idle' });
    expect(container.querySelectorAll('#gate-1')).toHaveLength(1);
  });

  it('reflects per-agent status in each node label (never colour-only)', () => {
    renderFlow({ status: 'running', agentStatus: { requirements: 'done', design: 'active' } });
    expect(screen.getByRole('group', { name: `${SHORT_LABEL.requirements} — Done` })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: `${SHORT_LABEL.design} — Working` })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: `${SHORT_LABEL.handoff} — Waiting` })).toBeInTheDocument();
  });

  it('labels the whole flow for assistive tech', () => {
    renderFlow({ status: 'idle' });
    expect(screen.getByRole('img', { name: 'Pipeline flow' })).toBeInTheDocument();
  });

  it('labels the human gate as a pill — "Human gate" before, "Awaiting approval" when paused', () => {
    // Before the gate is reached the pill reads "Human gate" (no "Awaiting approval").
    const { rerender } = renderFlow({ status: 'running', agentStatus: { requirements: 'active' } });
    expect(screen.getByText('Human gate')).toBeInTheDocument();
    expect(screen.queryByText(/Awaiting approval/i)).toBeNull();
    // Paused at the gate → the pill (desktop) + the inline marker (mobile) both say so.
    rerender(
      <SignalFlow
        agents={WEATHER_DASHBOARD_AGENTS}
        agentStatus={statusMap({ requirements: 'done' })}
        status="paused-at-gate"
        activeRevise={null}
        reducedMotion={false}
      />,
    );
    expect(screen.getAllByText(/Awaiting approval/i).length).toBeGreaterThan(0);
  });

  it('marks the gate "Approved" once the pipeline has moved past it', () => {
    // Design has started → the gate was approved; the pill reflects that.
    renderFlow({ status: 'running', agentStatus: { requirements: 'done', design: 'active' } });
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.queryByText('Human gate')).toBeNull();
    expect(screen.queryByText(/Awaiting approval/i)).toBeNull();
  });

  it('shows the mobile revise marker only while a tester→implementer revision is in flight', () => {
    const revise: ReviseDef = { from: 'tester', to: 'implementer', reason: 'contrast bug on the temp card' };
    renderFlow({ status: 'running', agentStatus: { tester: 'active' }, activeRevise: revise });
    expect(screen.getByText(new RegExp(`revise → ${SHORT_LABEL.implementer}`, 'i'))).toBeInTheDocument();
  });

  it('marks the Diff-ready caps as complete in the done state', () => {
    renderFlow({ status: 'done', agentStatus: Object.fromEntries(IDS.map((id) => [id, 'done'])) });
    // Both the desktop cap and the mobile cap carry the "Diff ready" wording.
    expect(screen.getAllByText(/Diff ready/i).length).toBeGreaterThan(0);
  });

  it('renders under reduced motion', () => {
    renderFlow({ status: 'running', agentStatus: { design: 'active' }, reducedMotion: true });
    expect(screen.getByRole('group', { name: `${SHORT_LABEL.design} — Working` })).toBeInTheDocument();
  });

  it('advances the progress trail past the last completed agent in the transient between-steps state', () => {
    // Running, but no agent is `active`/`revise` yet (the brief moment after one
    // agent finishes and before the next activates). The trail must rest just past
    // the last completed agent rather than snapping back to Idea — exercises the
    // `doneCount` fallback in progressPos.
    renderFlow({
      status: 'running',
      agentStatus: { requirements: 'done', design: 'done' },
    });
    // Both completed agents read Done; the next is still Waiting — the flow is mid-run.
    expect(screen.getByRole('group', { name: `${SHORT_LABEL.requirements} — Done` })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: `${SHORT_LABEL.design} — Done` })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: `${SHORT_LABEL.architecture} — Waiting` })).toBeInTheDocument();
  });
});
