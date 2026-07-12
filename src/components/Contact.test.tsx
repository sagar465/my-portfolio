import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Contact } from './Contact';

// sonner is aliased in vite.config; stub it so the toast import is inert in jsdom.
vi.mock('sonner@2.0.3', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// The full 6-channel contact object (AC-1.2). Each channel that has data must
// render as an actionable link with the correct href — asserted by VALUE.
const FULL_CONTACT = {
  email: 'sagar.varma8@gmail.com',
  phone: '+1 (314) 514-5938',
  whatsapp: '+91 96325 93939',
  linkedin: 'https://linkedin.com/in/venkata-sagar-varma-muppala',
  github: 'https://github.com/s4spublic',
  website: 'https://knowaboutsagarmuppala.dev',
};

function hrefFor(name: string): string | null {
  return screen.getByRole('link', { name }).getAttribute('href');
}

describe('Contact — channels render with correct hrefs (AC-1.2)', () => {
  it('renders all 6 actionable channels', () => {
    render(<Contact contact={FULL_CONTACT} />);
    expect(hrefFor('Email')).toBe('mailto:sagar.varma8@gmail.com');
    expect(hrefFor('Phone')).toBe('tel:+13145145938');
    expect(hrefFor('WhatsApp')).toBe('https://wa.me/919632593939');
    expect(hrefFor('LinkedIn')).toBe(
      'https://linkedin.com/in/venkata-sagar-varma-muppala'
    );
    expect(hrefFor('GitHub')).toBe('https://github.com/s4spublic');
    expect(hrefFor('Website')).toBe('https://knowaboutsagarmuppala.dev');
  });

  it('opens external channels in a new tab but keeps mailto/tel in-place', () => {
    render(<Contact contact={FULL_CONTACT} />);
    // External links get target=_blank + noopener; mailto/tel do not.
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: 'Phone' })).not.toHaveAttribute('target');
  });

  it('WhatsApp strips spaces/+ to international digits for wa.me', () => {
    render(<Contact contact={{ email: 'a@b.com', whatsapp: '+91 96325 93939' }} />);
    expect(hrefFor('WhatsApp')).toBe('https://wa.me/919632593939');
  });

  it('drops a channel with no data (negative case — no LinkedIn link)', () => {
    render(<Contact contact={{ email: 'a@b.com' }} />);
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'WhatsApp' })).not.toBeInTheDocument();
    // Email is still present.
    expect(hrefFor('Email')).toBe('mailto:a@b.com');
  });
});

// The message form's network senders (Web3Forms / EmailJS / Netlify) hit
// external services, so — per the cost/external-send discipline — we NEVER let a
// real request escape: `fetch` is stubbed to reject, driving the deterministic
// mailto fallback (the only non-external branch). This exercises input binding,
// submit, the fallback path, and re-enable, without any real send.
describe('Contact — message form (external senders stubbed, mailto fallback)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline in test')));
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('binds inputs and falls back to mailto on submit when senders fail', async () => {
    const user = userEvent.setup();
    render(<Contact contact={{ email: 'sagar.varma8@gmail.com' }} />);

    // Target form inputs by their unique placeholders (the word "Email" also
    // appears as a contact-channel link label, so getByLabelText is ambiguous).
    await user.type(screen.getByPlaceholderText('Your name'), 'Asha');
    await user.type(screen.getByPlaceholderText('your.email@example.com'), 'asha@example.com');
    await user.type(screen.getByPlaceholderText('What would you like to discuss?'), 'Hello');
    await user.type(screen.getByPlaceholderText(/Tell me about your project/i), 'Lets build.');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    // The three network senders each rejected → the mailto fallback opens a
    // pre-filled mail composer to the resume email.
    await waitFor(() => expect(window.open).toHaveBeenCalled());
    const [url, target] = (window.open as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('mailto:sagar.varma8@gmail.com');
    expect(url).toContain('subject=Hello');
    expect(target).toBe('_self');
  });
});
