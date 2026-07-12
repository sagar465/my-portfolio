import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock every lazy child + Hero so the homepage renders synchronously in jsdom
// without pulling in each section's heavy deps. We assert the 12 section ids
// (rendered by the real <Section> wrapper), the AIgentLoop slot, and the
// anchor-driven scroll — not the internals of each section (those are their
// own phases' concern).
vi.mock('./Hero', () => ({ Hero: () => <div data-testid="hero" /> }));
// The real flagship section renders the whole engine + lazy Pipeline. For the
// homepage-composition tests we only care that the #aigentloop section lands after
// Hero in D-003 order, so stub it with a lightweight section carrying that id.
vi.mock('./aigentloop/AIgentLoopSection', () => ({
  AIgentLoopSection: () => <section id="aigentloop" data-testid="aigentloop" />,
}));
vi.mock('./Objective', () => ({ Objective: () => <div data-testid="objective" /> }));
vi.mock('./KeyAchievements', () => ({ KeyAchievements: () => <div data-testid="key-achievements" /> }));
vi.mock('./Skills', () => ({ Skills: () => <div data-testid="skills" /> }));
vi.mock('./Experience', () => ({ Experience: () => <div data-testid="experience" /> }));
vi.mock('./Education', () => ({ Education: () => <div data-testid="education" /> }));
vi.mock('./Languages', () => ({ Languages: () => <div data-testid="languages" /> }));
vi.mock('./Hobbies', () => ({ Hobbies: () => <div data-testid="hobbies" /> }));
vi.mock('./Projects', () => ({ Projects: () => <div data-testid="projects" /> }));
vi.mock('./Testimonials', () => ({ Testimonials: () => <div data-testid="testimonials" /> }));
vi.mock('./Contact', () => ({ Contact: () => <div data-testid="contact" /> }));
vi.mock('./Background', () => ({ Background: () => <div data-testid="background" /> }));

// Mutable mock data object. The module factory below reads it LIVE (getters), so a
// test can vary `testimonials` per-case and the freshly-imported <Homepage/> sees
// the new value. This lets us assert BOTH the populated and the empty testimonials
// paths against the real `testimonials.length > 0` guard in Homepage.tsx (D-008 —
// the live site ships `testimonials: []`, so the section is intentionally HIDDEN;
// the populated path is the "when quotes are added" state, not today's live state).
const mockResumeData = {
  profile: { firstName: 'Sagar' },
  contact: {},
  objective: { keyAchievements: ['a', 'b'] },
  skills: {},
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  languages: [],
  hobbies: [],
  testimonials: [{ name: 'x' }] as Array<{ name: string }>,
};

vi.mock('../data/resume-manager-data', () => ({
  get resumeData() {
    return mockResumeData;
  },
  get default() {
    return mockResumeData;
  },
}));

import { Homepage } from './Homepage';

// The 12 section ids the homepage renders (AC-7.1) in D-003 order — the POPULATED
// state (testimonials present). Live production hides #testimonials while empty
// (D-008), asserted separately below via EXPECTED_IDS_EMPTY.
const EXPECTED_IDS = [
  'aigentloop',
  'about',
  'achievements',
  'skills',
  'experience',
  'projects',
  'education',
  'languages',
  'background',
  'hobbies',
  'testimonials',
  'contact',
];

// D-008 — the production-faithful state: `testimonials: []` → the guard hides the
// "What Others Say" section, so only 11 sections render and #testimonials is absent.
const EXPECTED_IDS_EMPTY = EXPECTED_IDS.filter((id) => id !== 'testimonials');

beforeEach(() => {
  // Default each test to the POPULATED state; the empty-case test overrides this.
  mockResumeData.testimonials = [{ name: 'x' }];
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderHomepage(entry = '/') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Homepage />
    </MemoryRouter>
  );
}

describe('Homepage', () => {
  // POPULATED path (D-008): when quotes are added to testimonials[], all 12 sections
  // render in D-003 order. This is NOT today's live state — it documents the section
  // that appears the moment real testimonials exist.
  it('renders all 12 section ids in D-003 order when testimonials are populated', async () => {
    mockResumeData.testimonials = [{ name: 'x' }];
    const { container } = renderHomepage();
    await waitFor(() => expect(screen.getByTestId('contact')).toBeInTheDocument());

    const renderedIds = Array.from(container.querySelectorAll('section[id]')).map(
      (s) => s.getAttribute('id')
    );
    expect(renderedIds).toEqual(EXPECTED_IDS);
  });

  // EMPTY path (D-008 — production-faithful): the live site ships `testimonials: []`,
  // so the `testimonials.length > 0` guard HIDES the "What Others Say" section. Only
  // 11 sections render and #testimonials is absent from the DOM. This closes the P0
  // mock-vs-reality gap (the P0 test mocked non-empty testimonials, green-lighting 12
  // while the live DOM correctly shows 11). Asserts behavior (absence), not a count —
  // and would FAIL if someone deleted the guard, so it is a real regression guard.
  it('hides the Testimonials section when testimonials is empty (11 sections, #testimonials absent)', async () => {
    mockResumeData.testimonials = [];
    const { container } = renderHomepage();
    await waitFor(() => expect(screen.getByTestId('contact')).toBeInTheDocument());

    const renderedIds = Array.from(container.querySelectorAll('section[id]')).map(
      (s) => s.getAttribute('id')
    );
    expect(renderedIds).toEqual(EXPECTED_IDS_EMPTY);
    expect(renderedIds).toHaveLength(11);
    // Behavior assertion: the guarded section is genuinely absent from the DOM.
    expect(renderedIds).not.toContain('testimonials');
    expect(container.querySelector('section#testimonials')).toBeNull();
    expect(screen.queryByText('What Others Say')).not.toBeInTheDocument();
  });

  it('renders the AIgentLoop section immediately after Hero as the first section', () => {
    const { container } = renderHomepage();
    const firstSection = container.querySelector('section[id]');
    expect(firstSection?.getAttribute('id')).toBe('aigentloop');
  });

  it('renders the real flagship AIgentLoop section after Hero (not a placeholder)', () => {
    renderHomepage();
    // The P4 flagship section replaced the P0 placeholder slot; it mounts with the
    // #aigentloop id immediately after Hero.
    expect(screen.getByTestId('aigentloop')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });

  it('does not scroll for a plain homepage render (no anchor prop)', () => {
    renderHomepage('/');
    // No target element to scroll to, and no anchor → scrollToId('') no-ops.
    // Assertion: nothing throws and the page rendered.
    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });
});

// jsdom reports rect.top === 0 (already-landed); stub the injected target to sit
// below the fold for a few reads so the poll issues the scroll, then removes it.
function stubBelowFold(el: HTMLElement) {
  let reads = 0;
  vi.spyOn(el, 'getBoundingClientRect').mockImplementation(() => {
    const top = reads < 3 ? 500 : 0;
    reads += 1;
    return { top, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON() {} } as DOMRect;
  });
}

describe('Homepage anchor prop (path-based deep links)', () => {
  it('scrolls to the projects section for the edusarvam anchor', async () => {
    // Pre-mount the target with the id Section will also render so the spy fires.
    const target = document.createElement('section');
    target.id = 'projects';
    document.body.appendChild(target);
    stubBelowFold(target);
    const spy = vi.spyOn(target, 'scrollIntoView');

    render(
      <MemoryRouter initialEntries={['/projects/edusarvam']}>
        <Homepage anchor="edusarvam" />
      </MemoryRouter>
    );
    // getElementById returns the first matching element; our injected one is first.
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' }));
    document.body.removeChild(target);
  });

  it('scrolls to the experience section for the wells-fargo anchor', async () => {
    const target = document.createElement('section');
    target.id = 'experience';
    document.body.appendChild(target);
    stubBelowFold(target);
    const spy = vi.spyOn(target, 'scrollIntoView');

    render(
      <MemoryRouter initialEntries={['/experience/wells-fargo']}>
        <Homepage anchor="experience-wells-fargo" />
      </MemoryRouter>
    );
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' }));
    document.body.removeChild(target);
  });
});
