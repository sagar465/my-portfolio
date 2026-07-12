import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StageDetail, type StageDetailProps } from './StageDetail';
import { SHORT_LABEL } from './AgentCard';
import { WEATHER_DASHBOARD_SCENARIO, FINAL_MESSAGE } from './engine/scenario';
import type { ArtifactStatus, GateDef, ReviseDef } from './engine/types';

const SCENARIO = WEATHER_DASHBOARD_SCENARIO;
const REQ = SCENARIO.agents[0]; // requirements
const IMPL = SCENARIO.agents.find((a) => a.id === 'implementer')!;

/** All artifacts pending unless overridden. */
function artifacts(overrides: Record<string, ArtifactStatus> = {}): Record<string, ArtifactStatus> {
  const base = Object.fromEntries(SCENARIO.agents.map((a) => [a.artifact.id, 'pending'])) as Record<string, ArtifactStatus>;
  return { ...base, ...overrides };
}

function renderDetail(overrides: Partial<StageDetailProps>) {
  const props: StageDetailProps = {
    scenario: SCENARIO,
    status: 'idle',
    activeDef: undefined,
    streamLine: undefined,
    activeGate: null,
    activeRevise: null,
    finalMessage: null,
    artifacts: artifacts(),
    reducedMotion: false,
    ...overrides,
  };
  return render(<StageDetail {...props} />);
}

describe('StageDetail (synced detail panel — D-009)', () => {
  it('shows a ready message in the idle state', () => {
    renderDetail({ status: 'idle' });
    expect(screen.getByText(/Ready — the pipeline runs itself/i)).toBeInTheDocument();
  });

  it('streams the active agent line and names the artifact it produces (AC-4.1)', () => {
    renderDetail({
      status: 'running',
      activeDef: REQ,
      streamLine: REQ.statusLines[0],
    });
    expect(screen.getByText(REQ.statusLines[0])).toBeInTheDocument();
    // The artifact being produced is named on the "→ title" line (distinct from the
    // artifact strip, which lists the title without the arrow).
    expect(screen.getByText(new RegExp(`→ ${REQ.artifact.title}`))).toBeInTheDocument();
    // The "Now" chip carries the short stage label.
    expect(screen.getByText(SHORT_LABEL.requirements)).toBeInTheDocument();
  });

  it('shows the gate prompt and (interactive) gate buttons when paused (AC-4.3)', () => {
    const gate: GateDef = { id: 'gate-1', prompt: 'Awaiting your approval: requirements', forAgent: 'requirements' };
    renderDetail({
      status: 'paused-at-gate',
      activeGate: gate,
      gateControls: <button type="button">Approve requirements</button>,
    });
    expect(screen.getByText(/Awaiting your approval: requirements/i)).toBeInTheDocument();
    expect(screen.getByText('Human gate')).toBeInTheDocument();
    // The interactive controls slot is rendered when provided.
    expect(screen.getByRole('button', { name: 'Approve requirements' })).toBeInTheDocument();
  });

  it('does NOT render gate controls when none are provided (passive mode)', () => {
    const gate: GateDef = { id: 'gate-1', prompt: 'Awaiting your approval: requirements', forAgent: 'requirements' };
    renderDetail({ status: 'paused-at-gate', activeGate: gate });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows the revise reason and the routing target (AC-4.5)', () => {
    const revise: ReviseDef = { from: 'tester', to: 'implementer', reason: 'contrast bug on the temp card' };
    renderDetail({ status: 'running', activeDef: IMPL, activeRevise: revise });
    expect(screen.getByText(/contrast bug on the temp card/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`routing back to ${SHORT_LABEL.implementer}`, 'i'))).toBeInTheDocument();
    expect(screen.getByText('Revision')).toBeInTheDocument();
  });

  it('shows the final diff message and the human-commit note in the done state (AC-4.6)', () => {
    renderDetail({ status: 'done', finalMessage: FINAL_MESSAGE });
    expect(screen.getByText(FINAL_MESSAGE)).toBeInTheDocument();
    expect(screen.getByText(/human reviews and commits|Nothing is committed/i)).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('renders the artifact strip reflecting produced files', () => {
    renderDetail({
      status: 'running',
      activeDef: REQ,
      artifacts: artifacts({ [REQ.artifact.id]: 'done' }),
    });
    // The artifact list is present and labelled.
    expect(screen.getByRole('list', { name: /Pipeline artifacts/i })).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(`${REQ.artifact.title} — Done`))).toBeInTheDocument();
  });

  it('renders under reduced motion', () => {
    renderDetail({ status: 'done', finalMessage: FINAL_MESSAGE, reducedMotion: true });
    expect(screen.getByText(FINAL_MESSAGE)).toBeInTheDocument();
  });
});
