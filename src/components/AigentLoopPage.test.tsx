import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AigentLoopPage } from './AigentLoopPage';

describe('AigentLoopPage (P0 stub)', () => {
  it('renders the AIgentLoop deep-dive page so the /aigentloop route resolves', () => {
    render(
      <MemoryRouter>
        <AigentLoopPage />
      </MemoryRouter>
    );
    // Heading from the Section wrapper.
    expect(screen.getByRole('heading', { name: 'AIgentLoop' })).toBeInTheDocument();
  });

  it('mounts a section with the aigentloop id', () => {
    const { container } = render(
      <MemoryRouter>
        <AigentLoopPage />
      </MemoryRouter>
    );
    expect(container.querySelector('section#aigentloop')).not.toBeNull();
  });

  it('frames it as my own recent agentic project (ownership signal for recruiters, D-018)', () => {
    render(
      <MemoryRouter>
        <AigentLoopPage />
      </MemoryRouter>
    );
    // Eyebrow badge + first-person subtitle/intro make ownership explicit.
    expect(screen.getByText(/Recent project · Agentic AI/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A multi-agent AI software build pipeline I designed and built/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/AIgentLoop is one of my recent projects/i),
    ).toBeInTheDocument();
  });

  it('explains the six-agent pipeline to a cold visitor', () => {
    render(
      <MemoryRouter>
        <AigentLoopPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Requirements, Design, Architecture, Implementer, Tester, and Handoff/i)).toBeInTheDocument();
  });

  it('lazy-loads the real Pipeline (page variant) and shows the passive Replay control', async () => {
    // Exercises the React.lazy import factory + Suspense fallback resolution — the
    // real flagship mounts on the /aigentloop route. The default passive mode plays
    // itself, so the surfaced control is Replay (not a click-to-Run button).
    render(
      <MemoryRouter>
        <AigentLoopPage />
      </MemoryRouter>
    );
    expect(
      await screen.findByRole('button', { name: 'Replay the pipeline from the start' }),
    ).toBeInTheDocument();
  });
});
