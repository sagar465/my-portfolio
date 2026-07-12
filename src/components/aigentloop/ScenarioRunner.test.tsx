import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScenarioRunner, RUN_BUTTON_ID } from './ScenarioRunner';
import { WEATHER_DASHBOARD_SCENARIO } from './engine/scenario';
import type { EngineStatus } from './engine/types';

function renderRunner(status: EngineStatus, extra?: Partial<Parameters<typeof ScenarioRunner>[0]>) {
  const onRun = vi.fn();
  const onReset = vi.fn();
  const onTogglePause = vi.fn();
  const onIdeaChange = vi.fn();
  render(
    <ScenarioRunner
      scenario={WEATHER_DASHBOARD_SCENARIO}
      status={status}
      onRun={onRun}
      onReset={onReset}
      onTogglePause={onTogglePause}
      idea=""
      onIdeaChange={onIdeaChange}
      reducedMotion={false}
      {...extra}
    />,
  );
  return { onRun, onReset, onTogglePause, onIdeaChange };
}

describe('ScenarioRunner — passive auto mode (default, D-009)', () => {
  it('shows the scenario being built and the "no AI, no network" reassurance', () => {
    renderRunner('running');
    expect(screen.getByText(WEATHER_DASHBOARD_SCENARIO.label)).toBeInTheDocument();
    expect(screen.getByText(/Scripted demo · no AI, no network/i)).toBeInTheDocument();
  });

  it('surfaces a Play/Pause toggle and a Replay control (self-playing, light control)', () => {
    renderRunner('running');
    expect(screen.getByRole('button', { name: 'Pause the pipeline animation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Replay the pipeline from the start' })).toBeInTheDocument();
  });

  it('shows Play (not Pause) when already paused (state-aware control)', () => {
    renderRunner('running', { paused: true });
    expect(screen.getByRole('button', { name: 'Resume the pipeline animation' })).toBeInTheDocument();
  });

  it('fires onTogglePause when the pause control is clicked', async () => {
    const user = userEvent.setup();
    const { onTogglePause } = renderRunner('running');
    await user.click(screen.getByRole('button', { name: 'Pause the pipeline animation' }));
    expect(onTogglePause).toHaveBeenCalledTimes(1);
  });

  it('fires onReset when Replay is clicked (AC-4.9)', async () => {
    const user = userEvent.setup();
    const { onReset } = renderRunner('done');
    await user.click(screen.getByRole('button', { name: 'Replay the pipeline from the start' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('hides the Play/Pause toggle under reduced motion (no motion to pause)', () => {
    renderRunner('running', { reducedMotion: true });
    expect(screen.queryByRole('button', { name: /the pipeline animation/i })).toBeNull();
    // Replay is still available under reduced motion.
    expect(screen.getByRole('button', { name: 'Replay the pipeline from the start' })).toBeInTheDocument();
  });

  it('gives the Replay button the stable RUN_BUTTON_ID (focus target, §4.4)', () => {
    renderRunner('idle');
    const replay = screen.getByRole('button', { name: 'Replay the pipeline from the start' });
    expect(replay).toHaveAttribute('id', RUN_BUTTON_ID);
    expect(document.getElementById(RUN_BUTTON_ID)).toBe(replay);
  });
});

describe('ScenarioRunner — retained interactive mode', () => {
  it('shows the single scenario label and both Run/Reset buttons', () => {
    renderRunner('idle', { mode: 'interactive' });
    expect(screen.getByText(WEATHER_DASHBOARD_SCENARIO.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Run the AIgentLoop pipeline' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset the pipeline' })).toBeInTheDocument();
  });

  it('fires onRun when Run is clicked from idle (AC-4.1)', async () => {
    const user = userEvent.setup();
    const { onRun } = renderRunner('idle', { mode: 'interactive' });
    await user.click(screen.getByRole('button', { name: 'Run the AIgentLoop pipeline' }));
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('disables Run and shows a "Running…" feedback label while running (AC-X.2)', () => {
    renderRunner('running', { mode: 'interactive' });
    const run = screen.getByRole('button', { name: 'Run the AIgentLoop pipeline' });
    expect(run).toBeDisabled();
    expect(screen.getByText('Running…')).toBeInTheDocument();
  });

  it('enables Reset and fires onReset once running (AC-4.9)', async () => {
    const user = userEvent.setup();
    const { onReset } = renderRunner('running', { mode: 'interactive' });
    const reset = screen.getByRole('button', { name: 'Reset the pipeline' });
    expect(reset).toBeEnabled();
    await user.click(reset);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('disables Reset while idle (nothing to reset — both-ways)', () => {
    renderRunner('idle', { mode: 'interactive' });
    expect(screen.getByRole('button', { name: 'Reset the pipeline' })).toBeDisabled();
  });

  it('reports idea edits through onIdeaChange', async () => {
    const user = userEvent.setup();
    const { onIdeaChange } = renderRunner('idle', { mode: 'interactive' });
    await user.type(screen.getByLabelText(/Your idea/i), 'x');
    expect(onIdeaChange).toHaveBeenCalled();
  });

  it('gives the Run button the stable RUN_BUTTON_ID (§4.4)', () => {
    renderRunner('idle', { mode: 'interactive' });
    const run = screen.getByRole('button', { name: 'Run the AIgentLoop pipeline' });
    expect(run).toHaveAttribute('id', RUN_BUTTON_ID);
    expect(document.getElementById(RUN_BUTTON_ID)).toBe(run);
  });
});
