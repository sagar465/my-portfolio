import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GateControls, APPROVE_BUTTON_ID } from './GateControls';
import type { GateDef } from './engine/types';

const GATE: GateDef = {
  id: 'gate-1',
  prompt: 'Awaiting your approval: requirements',
  forAgent: 'requirements',
};

describe('GateControls (interactive-mode gate buttons — D-009)', () => {
  it('renders nothing when there is no gate (both-ways, AC-4.3)', () => {
    const { container } = render(<GateControls gate={null} onApprove={() => {}} onRevise={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows distinct APPROVE / REVISE buttons when a gate is present (AC-4.3)', () => {
    render(<GateControls gate={GATE} onApprove={() => {}} onRevise={() => {}} />);
    expect(screen.getByRole('button', { name: 'Approve requirements' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request revision' })).toBeInTheDocument();
  });

  it('fires onApprove and onRevise when the buttons are activated (AC-4.4/4.5)', async () => {
    const onApprove = vi.fn();
    const onRevise = vi.fn();
    const user = userEvent.setup();
    render(<GateControls gate={GATE} onApprove={onApprove} onRevise={onRevise} />);
    await user.click(screen.getByRole('button', { name: 'Approve requirements' }));
    expect(onApprove).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Request revision' }));
    expect(onRevise).toHaveBeenCalledTimes(1);
  });

  it('is keyboard-operable — Enter on the focused Approve fires it (AC-5.1)', async () => {
    const onApprove = vi.fn();
    const user = userEvent.setup();
    render(<GateControls gate={GATE} onApprove={onApprove} onRevise={() => {}} />);
    screen.getByRole('button', { name: 'Approve requirements' }).focus();
    await user.keyboard('{Enter}');
    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it('gives the Approve button a stable id so Pipeline can focus it by id (§4.4)', () => {
    // The shadcn Button is not a forwardRef, so Pipeline focuses by stable id, not ref.
    render(<GateControls gate={GATE} onApprove={() => {}} onRevise={() => {}} />);
    const approve = screen.getByRole('button', { name: 'Approve requirements' });
    expect(approve).toHaveAttribute('id', APPROVE_BUTTON_ID);
    expect(document.getElementById(APPROVE_BUTTON_ID)).toBe(approve);
  });
});
