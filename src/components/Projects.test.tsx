import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { Projects } from './Projects';
import { resumeData } from '../data/resume-manager-data';

// The screenshot gallery modal mounts react-zoom-pan-pinch, which needs
// ResizeObserver (absent in jsdom). Shim it locally so the gallery-open
// regression test can exercise the modal path without a DOM error.
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
});

// P2 — EduSarvam deep-dive card (AC-3.1/3.2/3.3, AC-6.3). These assert the exact
// rendered VALUES from the resume PDF (not mere DOM presence): the 5 sub-feature
// titles, the exact stack line, and the `#edusarvam` anchor target the route
// /projects/edusarvam scrolls to.

const STACK_LINE = 'React · React Native · NestJS · Supabase · Gemini';

const SUB_FEATURE_TITLES = [
  'Multi-tenant SaaS for schools',
  '"Okta" — Gemini-powered AI assistant',
  'AI quiz generation',
  'Live bus tracking',
  'Provider-agnostic AI service',
] as const;

const eduSarvam = {
  name: 'EduSarvam - Multi-Tenant School Management Platform (AI-Powered)',
  description:
    'Architected a multi-tenant SaaS for Indian schools — role-based web & mobile apps for Students, Teachers, Parents, and Admins.',
  stack: STACK_LINE,
  tech: ['React', 'React Native', 'NestJS', 'Supabase', 'Gemini'],
  image: '',
  link: '',
  screenshots: [] as string[],
  subFeatures: [
    { title: SUB_FEATURE_TITLES[0], detail: 'A multi-tenant SaaS for Indian schools with role-based web & mobile apps.' },
    { title: SUB_FEATURE_TITLES[1], detail: 'A Gemini-powered, role-aware chatbot using function-calling / tool-use over live school data.' },
    { title: SUB_FEATURE_TITLES[2], detail: 'An LLM pipeline that generates CBSE/ICSE-aligned questions with a teacher-review workflow.' },
    { title: SUB_FEATURE_TITLES[3], detail: 'A real-time transport module — GPS-based trip tracking with delay alerts.' },
    { title: SUB_FEATURE_TITLES[4], detail: 'A provider-agnostic AI service (Gemini/Groq) backed by a NestJS API with project-per-tenant isolation.' },
  ],
};

const galleryProject = {
  name: 'EduManage - Mobile School Management App',
  description: 'Multi-role mobile app with role-based dashboards. Real-time notifications. Attendance tracking.',
  tech: ['React Native', 'Expo'],
  image: 'https://example.com/img.png',
  link: '',
  screenshots: ['https://example.com/s1.png', 'https://example.com/s2.png'],
};

describe('Projects — EduSarvam deep-dive card', () => {
  it('renders all 5 sub-feature titles (AC-3.1)', () => {
    render(<Projects projects={[eduSarvam, galleryProject]} />);
    for (const title of SUB_FEATURE_TITLES) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('renders the exact resume stack line (AC-3.1)', () => {
    render(<Projects projects={[eduSarvam]} />);
    expect(screen.getByText(STACK_LINE)).toBeInTheDocument();
  });

  it('exposes the #edusarvam anchor target the route scrolls to (AC-6.3)', () => {
    const { container } = render(<Projects projects={[eduSarvam]} />);
    const anchor = container.querySelector('#edusarvam');
    expect(anchor).not.toBeNull();
    // The card carrying the anchor also carries the EduSarvam heading — so
    // /projects/edusarvam lands the visitor on the right card, not an empty node.
    expect(
      within(anchor as HTMLElement).getByRole('heading', { level: 3, name: /EduSarvam/ }),
    ).toBeInTheDocument();
  });

  it('renders each sub-feature as an expandable accordion trigger (AC-3.2)', () => {
    render(<Projects projects={[eduSarvam]} />);
    // Radix accordion triggers are buttons — one per sub-feature, expandable.
    const triggers = screen
      .getAllByRole('button')
      .filter((b) => SUB_FEATURE_TITLES.some((t) => b.textContent?.includes(t)));
    expect(triggers).toHaveLength(SUB_FEATURE_TITLES.length);
    // Open by default (defaultValue = all) → detail is reachable/visible.
    expect(
      screen.getByText(/A Gemini-powered, role-aware chatbot/),
    ).toBeInTheDocument();
  });

  it('renders the EduSarvam tech badges (AC-3.1)', () => {
    render(<Projects projects={[eduSarvam]} />);
    expect(screen.getByText('NestJS')).toBeInTheDocument();
    expect(screen.getByText('Supabase')).toBeInTheDocument();
    expect(screen.getByText('Gemini')).toBeInTheDocument();
  });
});

describe('Projects — gallery cards unaffected', () => {
  it('still renders non-deep-dive projects with their image card', () => {
    render(<Projects projects={[eduSarvam, galleryProject]} />);
    expect(
      screen.getByRole('heading', { level: 3, name: /EduManage/ }),
    ).toBeInTheDocument();
    // The gallery card exposes a Screenshots button with its count.
    expect(screen.getByText(/Screenshots \(2\)/)).toBeInTheDocument();
  });

  it('opens the gallery modal for the correct project even with a deep-dive card present', () => {
    // With the deep-dive EduSarvam card first, the gallery card is the 2nd entry;
    // clicking Screenshots must resolve the ORIGINAL projects index (galleryIndexOf)
    // and open the modal on the right project, not the deep-dive one.
    render(<Projects projects={[eduSarvam, galleryProject]} />);
    fireEvent.click(screen.getByText(/Screenshots \(2\)/).closest('button')!);
    // Modal header shows the gallery project's name + "1 of 2" — proving the
    // correct original index was resolved (not the deep-dive EduSarvam entry).
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: /EduManage/, level: 3 }).length).toBeGreaterThan(0);
  });

  it('renders only gallery cards when no deep-dive entry is present (no #edusarvam)', () => {
    const { container } = render(<Projects projects={[galleryProject]} />);
    expect(container.querySelector('#edusarvam')).toBeNull();
    expect(
      screen.getByRole('heading', { level: 3, name: /EduManage/ }),
    ).toBeInTheDocument();
  });
});

// Data fact-lock for the P2 surface — the EduSarvam entry + the D-007 My Journey
// timeline corrections are asserted against the resume PDF (source of truth).
// Read/write parity: everything asserted here also renders (via <Projects/> above
// and the My Journey section). Values, never mere presence (rubric §A.2a).
describe('resume-manager-data — EduSarvam entry (AC-3.1/3.3)', () => {
  const edusarvam = resumeData.projects.find((p) =>
    p.name.includes('EduSarvam'),
  ) as (typeof resumeData.projects)[number] & {
    stack?: string;
    subFeatures?: { title: string; detail: string }[];
  };

  it('is present as the first project entry with the exact stack line', () => {
    expect(edusarvam).toBeDefined();
    expect(edusarvam.stack).toBe(
      'React · React Native · NestJS · Supabase · Gemini',
    );
  });

  it('carries exactly the 5 resume sub-features in order', () => {
    expect(edusarvam.subFeatures?.map((s) => s.title)).toEqual([
      'Multi-tenant SaaS for schools',
      '"Okta" — Gemini-powered AI assistant',
      'AI quiz generation',
      'Live bus tracking',
      'Provider-agnostic AI service',
    ]);
  });

  it('sub-feature details match resume facts (Gemini "Okta", NestJS isolation)', () => {
    const blob = (edusarvam.subFeatures ?? [])
      .map((s) => `${s.title} ${s.detail}`)
      .join(' ');
    expect(blob).toMatch(/Gemini-powered/);
    expect(blob).toMatch(/prompt-injection guards/);
    expect(blob).toMatch(/CBSE\/ICSE/);
    expect(blob).toMatch(/GPS-based trip tracking/);
    expect(blob).toMatch(/project-per-tenant isolation/);
    // Negative — no non-resume provider / invented metric (AC-3.3).
    expect(blob).not.toMatch(/OpenAI|GPT-4|Anthropic|Claude/);
  });

  it('EduManage / NutriFind gallery projects are preserved (additive)', () => {
    const names = resumeData.projects.map((p) => p.name);
    expect(names.some((n) => n.includes('EduManage'))).toBe(true);
    expect(names.some((n) => n.includes('NutriFind'))).toBe(true);
  });
});

describe('resume-manager-data — D-007 My Journey timeline fact-lock (AC-X.4)', () => {
  const timeline = resumeData.background.timeline;

  it('2021 entry employer is the full legal Wells Fargo name (not "Wells Fargo India")', () => {
    const wf = timeline.find((t) => t.year === '2021');
    expect(wf?.company).toBe('Wells Fargo International Solutions');
    expect(wf?.company).not.toBe('Wells Fargo India');
    expect(wf?.role).toBe('Technical Lead');
  });

  it('2014 Infosys entry title is Senior Systems Engineer (not "Software Engineer")', () => {
    const infosys = timeline.find((t) => t.year === '2014');
    expect(infosys?.company).toBe('Infosys Ltd');
    expect(infosys?.role).toBe('Senior Systems Engineer');
    expect(infosys?.role).not.toBe('Software Engineer');
    expect(infosys?.description).toContain('Senior Systems Engineer');
  });

  it('preserves the 5-entry timeline structure (My Journey intact, AC-7.4)', () => {
    expect(timeline.map((t) => t.year)).toEqual([
      '2014',
      '2018',
      '2019',
      '2021',
      '2024',
    ]);
  });
});
