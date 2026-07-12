import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Same child mocks as Homepage.test.tsx, but this file supplies resume data WITH
// certifications so the Education section title takes its "Education &
// Certifications" branch (Homepage.tsx line 176 true-branch). Kept in a separate
// file because the resume-data mock is module-level and must differ per scenario.
vi.mock('./Hero', () => ({ Hero: () => <div data-testid="hero" /> }));
vi.mock('./Objective', () => ({ Objective: () => <div /> }));
vi.mock('./KeyAchievements', () => ({ KeyAchievements: () => <div /> }));
vi.mock('./Skills', () => ({ Skills: () => <div /> }));
vi.mock('./Experience', () => ({ Experience: () => <div /> }));
vi.mock('./Education', () => ({ Education: () => <div /> }));
vi.mock('./Languages', () => ({ Languages: () => <div /> }));
vi.mock('./Hobbies', () => ({ Hobbies: () => <div /> }));
vi.mock('./Projects', () => ({ Projects: () => <div /> }));
vi.mock('./Testimonials', () => ({ Testimonials: () => <div /> }));
vi.mock('./Contact', () => ({ Contact: () => <div /> }));
vi.mock('./Background', () => ({ Background: () => <div /> }));

vi.mock('../data/resume-manager-data', () => {
  const data = {
    profile: { firstName: 'Sagar' },
    contact: {},
    objective: { keyAchievements: ['a'] },
    skills: {},
    experience: [],
    projects: [],
    education: [],
    certifications: [{ name: 'AWS' }], // <- certifications present
    languages: [],
    hobbies: [],
    testimonials: [],
  };
  return { resumeData: data, default: data };
});

import { Homepage } from './Homepage';

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Homepage education title branch', () => {
  it('uses the "Education & Certifications" title when certifications exist', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Homepage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Education & Certifications' })
    ).toBeInTheDocument();
  });
});
