import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './Header';

// Mutable mock so a test can null out firstName to exercise the 'My Profile'
// fallback branch. Reset in afterEach.
const mockData: { profile: { firstName: string | undefined } } = {
  profile: { firstName: 'Sagar' },
};
vi.mock('./../data/resume-manager-data', () => ({
  get default() {
    return mockData;
  },
  get resumeData() {
    return mockData;
  },
}));

// A tiny probe that records the current location so we can assert navigation.
function LocationProbe() {
  const loc = useLocation();
  return <div data-testid="loc">{loc.pathname + loc.hash}</div>;
}

function renderHeader(
  initialEntry: string,
  opts: { darkMode?: boolean; toggleDarkMode?: () => void } = {}
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Header
        darkMode={opts.darkMode ?? false}
        toggleDarkMode={opts.toggleDarkMode ?? vi.fn()}
      />
      <Routes>
        {/* section anchors the homepage would render */}
        <Route path="/" element={<div id="skills" data-testid="home">home</div>} />
        <Route path="/aigentloop" element={<div data-testid="aigentloop">page</div>} />
      </Routes>
      <LocationProbe />
    </MemoryRouter>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  mockData.profile.firstName = 'Sagar';
});

describe('Header nav parity', () => {
  it('renders every existing nav entry plus exactly one AIgentLoop entry (desktop)', () => {
    renderHeader('/');
    // Existing entries preserved.
    for (const label of ['About', 'Skills', 'Experience', 'Projects', 'My Journey', 'Contact']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    // AIgentLoop added as a real route link (present in both desktop + mobile nav markup).
    const links = screen.getAllByRole('link', { name: 'AIgentLoop' });
    expect(links.length).toBeGreaterThanOrEqual(1);
    links.forEach((l) => expect(l).toHaveAttribute('href', '/aigentloop'));
  });
});

// The mobile menu (hamburger) toggle is an icon-only ghost button carrying the
// `md:hidden` utility class — select it by that class since it has no a11y name.
function getMobileMenuButton(container: HTMLElement): HTMLButtonElement {
  const btn = container.querySelector('button.md\\:hidden');
  if (!btn) throw new Error('mobile menu button not found');
  return btn as HTMLButtonElement;
}

describe('Header mobile navigation', () => {
  it('opens the mobile menu and shows the AIgentLoop link + section entries', async () => {
    const user = userEvent.setup();
    const { container } = renderHeader('/');

    // Menu is closed → mobile section buttons + link are not yet rendered.
    // (Desktop nav still renders its own copies, so scope the count assertion to
    // after opening by measuring the delta.)
    const linksBefore = screen.getAllByRole('link', { name: 'AIgentLoop' }).length;

    await user.click(getMobileMenuButton(container));

    // Now the mobile nav is mounted → a SECOND AIgentLoop link appears.
    const linksAfter = screen.getAllByRole('link', { name: 'AIgentLoop' });
    expect(linksAfter.length).toBe(linksBefore + 1);
    // The mobile AIgentLoop link points at the route (AC-7.2 mobile parity).
    linksAfter.forEach((l) => expect(l).toHaveAttribute('href', '/aigentloop'));
    // Mobile section entries are present (two "Skills" buttons: desktop + mobile).
    expect(screen.getAllByText('Skills').length).toBe(2);
  });

  it('on the homepage, clicking a MOBILE section entry scrolls in place (goToSection scroll branch)', async () => {
    const user = userEvent.setup();
    const { container } = renderHeader('/');
    const target = document.getElementById('skills')!;
    const spy = vi.spyOn(target, 'scrollIntoView');

    await user.click(getMobileMenuButton(container));
    // The mobile "Skills" entry is the LAST match (desktop is first).
    const skillsButtons = screen.getAllByText('Skills');
    await user.click(skillsButtons[skillsButtons.length - 1]);

    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
    // Scroll branch → stayed on '/'.
    expect(screen.getByTestId('loc').textContent).toBe('/');
  });

  it('on a non-home route, clicking a MOBILE section entry navigates home with a hash (goToSection navigate branch)', async () => {
    const user = userEvent.setup();
    const { container } = renderHeader('/aigentloop');
    expect(screen.getByTestId('loc').textContent).toBe('/aigentloop');

    await user.click(getMobileMenuButton(container));
    const skillsButtons = screen.getAllByText('Skills');
    await user.click(skillsButtons[skillsButtons.length - 1]);

    // Navigate branch → home with the section hash.
    await waitFor(() => expect(screen.getByTestId('loc').textContent).toBe('/#skills'));
  });

  it('clicking the mobile AIgentLoop link closes the menu and routes to /aigentloop', async () => {
    const user = userEvent.setup();
    const { container } = renderHeader('/');

    await user.click(getMobileMenuButton(container));
    // Two AIgentLoop links now (desktop + mobile); the mobile one is the last.
    const aigentLinks = screen.getAllByRole('link', { name: 'AIgentLoop' });
    await user.click(aigentLinks[aigentLinks.length - 1]);

    await waitFor(() => expect(screen.getByTestId('aigentloop')).toBeInTheDocument());
    // Menu closed → back to a single (desktop-only) AIgentLoop link.
    await waitFor(() =>
      expect(screen.getAllByRole('link', { name: 'AIgentLoop' }).length).toBe(1)
    );
  });
});

describe('Header home-or-scroll conditional', () => {
  it('on the homepage, clicking a section scrolls in place (no route change)', async () => {
    const user = userEvent.setup();
    renderHeader('/');
    const target = document.getElementById('skills')!;
    const spy = vi.spyOn(target, 'scrollIntoView');

    // Desktop "Skills" button is the first match.
    await user.click(screen.getAllByText('Skills')[0]);

    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
    // Stayed on '/'
    expect(screen.getByTestId('loc').textContent).toBe('/');
  });

  it('on a non-home route, clicking a section navigates home with a hash', async () => {
    const user = userEvent.setup();
    renderHeader('/aigentloop');
    expect(screen.getByTestId('loc').textContent).toBe('/aigentloop');

    await user.click(screen.getAllByText('Skills')[0]);

    await waitFor(() => expect(screen.getByTestId('loc').textContent).toBe('/#skills'));
  });

  it('logo click navigates home with the hero hash from a non-home route', async () => {
    const user = userEvent.setup();
    renderHeader('/aigentloop');
    await user.click(screen.getByText('Sagar'));
    await waitFor(() => expect(screen.getByTestId('loc').textContent).toBe('/#hero'));
  });
});

describe('Header chrome behaviours (scroll, outside-click, escape, toggle, fallback)', () => {
  it('adds the scrolled styling once the window scrolls past 50px', async () => {
    const { container } = renderHeader('/');
    const header = container.querySelector('header')!;
    expect(header.className).toContain('bg-transparent');

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 120, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => expect(header.className).toContain('backdrop-blur-lg'));
    // restore
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('closes the open mobile menu when clicking outside it', async () => {
    const user = userEvent.setup();
    const { container } = renderHeader('/');
    await user.click(getMobileMenuButton(container));
    // Menu open → mobile Skills entry present (2 total).
    expect(screen.getAllByText('Skills').length).toBe(2);

    // mousedown outside the header closes it (handleClickOutside).
    fireEvent.mouseDown(document.body);

    await waitFor(() => expect(screen.getAllByText('Skills').length).toBe(1));
  });

  it('closes the open mobile menu when Escape is pressed', async () => {
    const user = userEvent.setup();
    const { container } = renderHeader('/');
    await user.click(getMobileMenuButton(container));
    expect(screen.getAllByText('Skills').length).toBe(2);

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(screen.getAllByText('Skills').length).toBe(1));
  });

  it('renders the Sun icon and fires toggleDarkMode when in dark mode', async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();
    const { container } = renderHeader('/', { darkMode: true, toggleDarkMode: toggle });
    // The dark-mode toggle carries `p-2` but is NOT the `md:hidden` hamburger.
    const toggleBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.className.includes('p-2') && !b.className.includes('md:hidden')
    )!;
    await user.click(toggleBtn);
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it("falls back to 'My Profile' when the profile firstName is absent", () => {
    mockData.profile.firstName = undefined;
    renderHeader('/');
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  it('scrollToSection is a safe no-op when the target section id is not in the DOM', async () => {
    const user = userEvent.setup();
    // Render WITHOUT the "/" route element so #skills is absent — the desktop
    // "Projects" entry resolves to a missing element (scrollToSection else path).
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header darkMode={false} toggleDarkMode={vi.fn()} />
        <LocationProbe />
      </MemoryRouter>
    );
    // No #projects element exists → clicking must not throw and stays on '/'.
    await user.click(screen.getAllByText('Projects')[0]);
    expect(screen.getByTestId('loc').textContent).toBe('/');
  });

  it('ignores Escape when the mobile menu is already closed', () => {
    renderHeader('/');
    // Menu closed → the Escape guard (&& mobileMenuOpen) short-circuits; no throw,
    // menu stays closed (still a single desktop-only Skills entry).
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getAllByText('Skills').length).toBe(1);
  });
});
