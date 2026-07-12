import { describe, it, expect } from 'vitest';
import { resumeData } from './resume-manager-data';

// P1 fact-lock (AC-X.4): every corrected fact is asserted against the resume PDF
// (Sagar_Muppala_Architect_2026.pdf), which is the source of truth. A drift here
// is a regression — these tests fail loudly if the data is edited away from the
// resume. Values are asserted, never mere presence (rubric §A.2a).

describe('resume-manager-data — profile (AC-1.1/1.2)', () => {
  const p = resumeData.profile;

  it('name resolves to the full resume name', () => {
    expect(`${p.firstName} ${p.lastName}`).toBe('Venkata Sagar Varma Muppala');
  });

  it('title carries the AI & Agentic Systems suffix', () => {
    expect(p.title).toBe(
      'Full-Stack Software Architect · AI & Agentic Systems'
    );
  });

  it('tagline states 12+ years (not the stale 11+)', () => {
    expect(p.tagline).toContain('12+ years');
    expect(p.tagline).not.toContain('11+');
  });

  it('location is St. Louis, MO, USA', () => {
    expect(p.location).toBe('St. Louis, MO, USA');
  });

  it('links.linkedin is the canonical profile URL (with numeric suffix)', () => {
    expect(p.links.linkedin).toBe(
      'https://www.linkedin.com/in/venkata-sagar-varma-muppala-271ba369/'
    );
  });
});

describe('resume-manager-data — contact (AC-1.2: 5 channels, self-website removed D-017)', () => {
  const c = resumeData.contact;

  it('email matches the resume', () => {
    expect(c.email).toBe('sagar.varma8@gmail.com');
  });

  it('phone is the US number', () => {
    expect(c.phone).toBe('+1 (314) 514-5938');
  });

  it('whatsapp is the India number', () => {
    expect(c.whatsapp).toBe('+91 96325 93939');
  });

  it('linkedin is the canonical profile URL (with numeric suffix)', () => {
    expect(c.linkedin).toBe(
      'https://www.linkedin.com/in/venkata-sagar-varma-muppala-271ba369/'
    );
  });

  it('github points to the s4spublic handle', () => {
    expect(c.github).toBe('https://github.com/s4spublic');
  });

  // The site itself is the "website" — a self-referential link is removed (D-017),
  // so `contact.website` is intentionally unset and no Website channel renders.
  it('has no self-referential website channel', () => {
    expect(c.website).toBeUndefined();
  });
});

describe('resume-manager-data — objective (12+ years, AC-2.4)', () => {
  it('description states 12+ years', () => {
    expect(resumeData.objective.description).toContain('12+ years');
    expect(resumeData.objective.description).not.toContain('11+');
  });

  it('goals reference the multi-agent AI pipeline job', () => {
    const joined = resumeData.objective.goals.join(' | ');
    expect(joined).toMatch(/multi-agent/i);
  });
});

describe('resume-manager-data — keyAchievements metrics verbatim (AC-2.3)', () => {
  it('surfaces all four resume metrics ~85% ~99% ~90% ~75% verbatim', () => {
    const blob = resumeData.objective.keyAchievements
      .map((a) => `${a.title} ${a.description}`)
      .join(' ');
    expect(blob).toContain('~85%');
    expect(blob).toContain('~99%');
    expect(blob).toContain('~90%');
    expect(blob).toContain('~75%');
  });
});

describe('resume-manager-data — skills (AC-2.1: exactly 7 categories)', () => {
  const skills = resumeData.skills;

  it('has exactly the 7 resume categories in resume order', () => {
    expect(skills.map((s) => s.category)).toEqual([
      'Frontend',
      'Backend',
      'AI & Agentic',
      'Architecture',
      'Cloud & DevOps',
      'Data',
      'Testing',
    ]);
  });

  it('every category has at least one member', () => {
    for (const cat of skills) {
      expect(cat.members.length).toBeGreaterThan(0);
    }
  });

  it('AI & Agentic lists the resume tools verbatim', () => {
    const ai = skills.find((s) => s.category === 'AI & Agentic');
    expect(ai?.members).toContain('MCP (Model Context Protocol)');
    expect(ai?.members).toContain('Multi-Agent Pipelines');
  });
});

describe('resume-manager-data — experience (AC-2.2: 5 roles, corrected)', () => {
  const exp = resumeData.experience;

  it('lists exactly the 5 resume roles in order', () => {
    expect(exp.map((e) => `${e.role} @ ${e.company}`)).toEqual([
      'Software Architect III @ Sira Soft Solutions Inc',
      'Technical Lead @ Wells Fargo International Solutions',
      'Senior Software Engineer @ Amadeus Labs',
      'Senior Software Engineer @ Analytics Quotient',
      'Senior Systems Engineer @ Infosys Ltd',
    ]);
  });

  it('Sira location corrected to St. Louis, MO, USA', () => {
    expect(exp[0].Location).toBe('St. Louis, MO, USA');
  });

  it('Wells Fargo company name is the full legal name', () => {
    expect(exp[1].company).toBe('Wells Fargo International Solutions');
  });

  it('Infosys role + location corrected to the resume values', () => {
    const infosys = exp.find((e) => e.company === 'Infosys Ltd');
    expect(infosys?.role).toBe('Senior Systems Engineer');
    expect(infosys?.Location).toBe('Bengaluru, India');
  });
});

describe('resume-manager-data — languages (AC-2.4 levels)', () => {
  const spoken = resumeData.languages.spoken;

  it('English is Advanced, Telugu Native, Hindi Intermediate', () => {
    expect(spoken).toEqual([
      { name: 'English', level: 'Advanced' },
      { name: 'Telugu', level: 'Native' },
      { name: 'Hindi', level: 'Intermediate' },
    ]);
  });
});

describe('resume-manager-data — no stale/placeholder values (AC-1.3)', () => {
  it('contains no obvious placeholder tokens in the corrected surfaces', () => {
    const surfaces = JSON.stringify({
      profile: resumeData.profile,
      contact: resumeData.contact,
      objective: resumeData.objective,
      skills: resumeData.skills,
      experience: resumeData.experience.map((e) => ({
        role: e.role,
        company: e.company,
        Location: e.Location,
      })),
      languages: resumeData.languages.spoken,
    });
    expect(surfaces).not.toMatch(/lorem ipsum/i);
    expect(surfaces).not.toMatch(/placeholder/i);
    expect(surfaces).not.toMatch(/TODO/);
    expect(surfaces).not.toMatch(/your\.email@example/i);
  });
});
