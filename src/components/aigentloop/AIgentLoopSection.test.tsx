import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AIgentLoopSection } from './AIgentLoopSection';

// The section now carries a <Link> to the deep-dive, so it must render under a router.
const renderSection = () =>
  render(
    <MemoryRouter>
      <AIgentLoopSection />
    </MemoryRouter>,
  );

describe('AIgentLoopSection (homepage embed)', () => {
  it('renders the flagship section shell with the aigentloop id and heading', () => {
    const { container } = renderSection();
    // Reuses the site Section wrapper → same id + heading treatment as other sections.
    expect(container.querySelector('section#aigentloop')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'AIgentLoop' })).toBeInTheDocument();
  });

  it('frames it as my own recent agentic project (ownership signal for recruiters, D-018)', () => {
    renderSection();
    // Eyebrow badge + first-person copy make clear this is a project I built, not a demo.
    expect(screen.getByText(/Recent project · Agentic AI/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A multi-agent AI system I designed and built/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I built AIgentLoop to explore agentic software delivery/i),
    ).toBeInTheDocument();
  });

  it('links to the /aigentloop deep-dive page', () => {
    renderSection();
    expect(
      screen.getByRole('link', { name: /Explore the deep-dive/i }),
    ).toHaveAttribute('href', '/aigentloop');
  });

  it('lazy-loads the real Pipeline (section variant) and shows the passive Replay control', async () => {
    // Exercises the React.lazy import factory + Suspense fallback — the real flagship
    // mounts in the homepage embed, not a placeholder. The default passive mode plays
    // itself, so the surfaced control is Replay (not a click-to-Run button).
    renderSection();
    expect(
      await screen.findByRole('button', { name: 'Replay the pipeline from the start' }),
    ).toBeInTheDocument();
    // The six agent nodes are rendered exactly once (single responsive list, not a
    // duplicated desktop+mobile set — valid ids, one role=group per agent).
    expect(await screen.findAllByRole('group')).toHaveLength(6);
  });
});
