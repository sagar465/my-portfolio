import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';

// Skills renders one card per resume category (AC-2.1). We assert the rendered
// heading TEXT and member badges — not mere element presence.

const SEVEN = [
  { category: 'Frontend', members: ['React.js', 'Next.js'] },
  { category: 'Backend', members: ['Java', 'Spring Boot'] },
  { category: 'AI & Agentic', members: ['Multi-Agent Pipelines', 'MCP (Model Context Protocol)'] },
  { category: 'Architecture', members: ['Micro-Frontends (Webpack 5 Module Federation)'] },
  { category: 'Cloud & DevOps', members: ['AWS (ECR, Fargate, EC2, S3, Route53)', 'Docker'] },
  { category: 'Data', members: ['Oracle', 'Supabase (PostgreSQL)'] },
  { category: 'Testing', members: ['Jest', 'Playwright'] },
] as const;

describe('Skills', () => {
  it('renders exactly one heading per resume category (7 cards)', () => {
    render(<Skills skills={SEVEN} />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual([
      'Frontend',
      'Backend',
      'AI & Agentic',
      'Architecture',
      'Cloud & DevOps',
      'Data',
      'Testing',
    ]);
  });

  it('renders each category member as a badge', () => {
    render(<Skills skills={SEVEN} />);
    expect(screen.getByText('MCP (Model Context Protocol)')).toBeInTheDocument();
    expect(screen.getByText('AWS (ECR, Fargate, EC2, S3, Route53)')).toBeInTheDocument();
    expect(screen.getByText('Supabase (PostgreSQL)')).toBeInTheDocument();
    expect(screen.getByText('Playwright')).toBeInTheDocument();
  });

  it('null-guards a missing skills prop (previous-data shape) without crashing', () => {
    // The rollback/previous-data path may not supply the array; the component
    // must degrade to an empty grid, never throw.
    render(<Skills skills={undefined as unknown as typeof SEVEN} />);
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
  });

  it('falls back to a default style for an unknown category name', () => {
    render(<Skills skills={[{ category: 'Mystery', members: ['x'] }]} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Mystery');
    expect(screen.getByText('x')).toBeInTheDocument();
  });
});
