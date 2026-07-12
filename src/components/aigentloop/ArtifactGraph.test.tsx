import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArtifactGraph } from './ArtifactGraph';
import { WEATHER_DASHBOARD_AGENTS } from './engine/scenario';
import type { ArtifactStatus } from './engine/types';

function statusMap(overrides: Record<string, ArtifactStatus> = {}) {
  const map: Record<string, ArtifactStatus> = {};
  for (const a of WEATHER_DASHBOARD_AGENTS) map[a.artifact.id] = 'pending';
  return { ...map, ...overrides };
}

describe('ArtifactGraph', () => {
  it('renders one node per agent artifact', () => {
    render(
      <ArtifactGraph
        agents={WEATHER_DASHBOARD_AGENTS}
        artifacts={statusMap()}
        reducedMotion={false}
      />,
    );
    for (const a of WEATHER_DASHBOARD_AGENTS) {
      expect(screen.getByText(a.artifact.title)).toBeInTheDocument();
    }
  });

  it('conveys each artifact status as text, not colour alone (AC-4.2)', () => {
    render(
      <ArtifactGraph
        agents={WEATHER_DASHBOARD_AGENTS}
        artifacts={statusMap({
          'requirements.md': 'done',
          'design-spec.md': 'active',
        })}
        reducedMotion={false}
      />,
    );
    // aria-label carries the status word for each node.
    expect(
      screen.getByLabelText('requirements.md — Done'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('design-spec.md — In progress'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('architecture.md — Pending'),
    ).toBeInTheDocument();
  });

  it('advances a node to done when its status flips (AC-4.2)', () => {
    const { rerender } = render(
      <ArtifactGraph
        agents={WEATHER_DASHBOARD_AGENTS}
        artifacts={statusMap()}
        reducedMotion={false}
      />,
    );
    expect(screen.getByLabelText('requirements.md — Pending')).toBeInTheDocument();

    rerender(
      <ArtifactGraph
        agents={WEATHER_DASHBOARD_AGENTS}
        artifacts={statusMap({ 'requirements.md': 'done' })}
        reducedMotion={false}
      />,
    );
    expect(screen.getByLabelText('requirements.md — Done')).toBeInTheDocument();
  });

  it('falls back to pending for a missing artifact status and renders under reduced motion', () => {
    render(
      <ArtifactGraph
        agents={WEATHER_DASHBOARD_AGENTS}
        artifacts={{}}
        reducedMotion={true}
      />,
    );
    expect(screen.getByLabelText('requirements.md — Pending')).toBeInTheDocument();
  });
});
