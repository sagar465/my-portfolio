import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Languages } from './Languages';

const LANGS = {
  spoken: [
    { name: 'English', level: 'Advanced' },
    { name: 'Telugu', level: 'Native' },
    { name: 'Hindi', level: 'Intermediate' },
  ],
  programming: [],
};

describe('Languages', () => {
  it('renders each spoken language name and its corrected level (AC-2.4)', () => {
    render(<Languages languages={LANGS} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    expect(screen.getByText('Telugu')).toBeInTheDocument();
    expect(screen.getByText('Native')).toBeInTheDocument();
    expect(screen.getByText('Hindi')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  it('themes the Advanced badge (not the gray default) so it is legible', () => {
    render(<Languages languages={LANGS} />);
    const badge = screen.getByText('Advanced');
    // The new `advanced` case maps to the blue theme; it must NOT fall through
    // to the gray default (which caused low-contrast text).
    expect(badge.className).toContain('text-blue-800');
    expect(badge.className).not.toContain('text-gray-800');
  });

  it('themes every supported proficiency level (covers both level switches)', () => {
    render(
      <Languages
        languages={{
          spoken: [
            { name: 'A', level: 'Native' },
            { name: 'B', level: 'Advanced' },
            { name: 'C', level: 'Fluent' },
            { name: 'D', level: 'Conversational' },
            { name: 'E', level: 'Intermediate' },
            { name: 'F', level: 'Basic' },
            { name: 'G', level: 'Unknownish' }, // default branch
          ],
          programming: [],
        }}
      />
    );
    expect(screen.getByText('Native').className).toContain('text-green-800');
    expect(screen.getByText('Fluent').className).toContain('text-blue-800');
    expect(screen.getByText('Conversational').className).toContain('text-orange-800');
    expect(screen.getByText('Intermediate').className).toContain('text-yellow-800');
    expect(screen.getByText('Basic').className).toContain('text-red-800');
    expect(screen.getByText('Unknownish').className).toContain('text-gray-800');
  });

  it('renders a flag/icon for each known language and a globe fallback', () => {
    render(
      <Languages
        languages={{
          spoken: [
            { name: 'English', level: 'Advanced' },
            { name: 'Telugu', level: 'Native' },
            { name: 'Hindi', level: 'Intermediate' },
            { name: 'Klingon', level: 'Basic' }, // default icon branch
          ],
          programming: [],
        }}
      />
    );
    expect(screen.getByText('Klingon')).toBeInTheDocument();
  });
});
