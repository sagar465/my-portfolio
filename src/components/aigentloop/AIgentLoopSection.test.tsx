import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AIgentLoopSection } from './AIgentLoopSection';

describe('AIgentLoopSection (homepage embed)', () => {
  it('renders the flagship section shell with the aigentloop id and heading', () => {
    const { container } = render(<AIgentLoopSection />);
    // Reuses the site Section wrapper → same id + heading treatment as other sections.
    expect(container.querySelector('section#aigentloop')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'AIgentLoop' })).toBeInTheDocument();
  });

  it('carries the passive "watch it work" subtitle (D-009 — self-playing, not click-to-run)', () => {
    render(<AIgentLoopSection />);
    expect(
      screen.getByText(/An autonomous multi-agent build pipeline — watch it work/i),
    ).toBeInTheDocument();
  });

  it('lazy-loads the real Pipeline (section variant) and shows the passive Replay control', async () => {
    // Exercises the React.lazy import factory + Suspense fallback — the real flagship
    // mounts in the homepage embed, not a placeholder. The default passive mode plays
    // itself, so the surfaced control is Replay (not a click-to-Run button).
    render(<AIgentLoopSection />);
    expect(
      await screen.findByRole('button', { name: 'Replay the pipeline from the start' }),
    ).toBeInTheDocument();
    // The six agent nodes are rendered exactly once (single responsive list, not a
    // duplicated desktop+mobile set — valid ids, one role=group per agent).
    expect(await screen.findAllByRole('group')).toHaveLength(6);
  });
});
