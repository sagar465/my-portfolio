import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgentCard, SHORT_LABEL } from './AgentCard';
import type { AgentStatus } from './engine/types';

function renderCard(status: AgentStatus, extra?: Partial<Parameters<typeof AgentCard>[0]>) {
  return render(<AgentCard id="requirements" status={status} index={1} reducedMotion={false} {...extra} />);
}

describe('AgentCard (signal-flow node — D-009)', () => {
  it('renders the short role label and the #step-<id> anchor target (AC-6.2)', () => {
    const { container } = renderCard('idle');
    expect(screen.getByText(SHORT_LABEL.requirements)).toBeInTheDocument();
    // Exactly one anchor with this id (the node is rendered once, not per-breakpoint).
    expect(container.querySelectorAll('#step-requirements')).toHaveLength(1);
  });

  it.each<[AgentStatus, string]>([
    ['idle', 'Waiting'],
    ['active', 'Working'],
    ['done', 'Done'],
    ['revise', 'Revising'],
  ])('conveys the "%s" status in the group aria-label, never colour-only (WCAG 1.4.1)', (status, word) => {
    renderCard(status);
    // Status word is carried in the role=group accessible name for screen readers.
    expect(
      screen.getByRole('group', { name: `${SHORT_LABEL.requirements} — ${word}` }),
    ).toBeInTheDocument();
  });

  it('shows the ordinal index in the disc only while not yet active/done', () => {
    renderCard('idle', { index: 3 });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('drops the ordinal once the node is done (icon replaces the number)', () => {
    renderCard('done', { index: 3 });
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('renders under reduced motion and still exposes its status label', () => {
    renderCard('active', { reducedMotion: true });
    expect(
      screen.getByRole('group', { name: `${SHORT_LABEL.requirements} — Working` }),
    ).toBeInTheDocument();
  });
});
