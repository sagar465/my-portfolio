import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from './Hero';

const DATA = {
  name: 'Venkata Sagar Varma Muppala',
  title: 'Full-Stack Software Architect · AI & Agentic Systems',
  tagline: '12+ years designing and delivering scalable web and mobile apps.',
  avatar: '',
};

const CONTACT = {
  email: 'sagar.varma8@gmail.com',
  linkedin: 'https://linkedin.com/in/venkata-sagar-varma-muppala',
  github: 'https://github.com/s4spublic',
};

describe('Hero', () => {
  it('renders the full name and title incl. the AI & Agentic suffix (AC-1.1)', () => {
    render(<Hero data={DATA} contact={CONTACT} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Venkata Sagar Varma Muppala'
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Full-Stack Software Architect · AI & Agentic Systems'
    );
  });

  it('renders the social links with correct hrefs (github now enabled)', () => {
    render(<Hero data={DATA} contact={CONTACT} />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/s4spublic'
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/venkata-sagar-varma-muppala'
    );
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:sagar.varma8@gmail.com'
    );
  });

  it('omits the GitHub link when contact.github is empty (negative case)', () => {
    render(<Hero data={DATA} contact={{ ...CONTACT, github: '' }} />);
    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();
    // LinkedIn + Email still present.
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
  });

  describe('CTA + scroll interactions', () => {
    beforeEach(() => {
      // jsdom has no layout engine; stub the scroll target lookup + scroll call.
      Element.prototype.scrollIntoView = vi.fn();
    });
    afterEach(() => vi.restoreAllMocks());

    it('scrolls to #projects on "View My Work"', async () => {
      const target = document.createElement('div');
      target.id = 'projects';
      document.body.appendChild(target);
      const spy = vi.spyOn(target, 'scrollIntoView');
      render(<Hero data={DATA} contact={CONTACT} />);
      await userEvent.click(screen.getByRole('button', { name: /view my work/i }));
      expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
      document.body.removeChild(target);
    });

    it('scrolls to #contact on "Get In Touch"', async () => {
      const target = document.createElement('div');
      target.id = 'contact';
      document.body.appendChild(target);
      const spy = vi.spyOn(target, 'scrollIntoView');
      render(<Hero data={DATA} contact={CONTACT} />);
      await userEvent.click(screen.getByRole('button', { name: /get in touch/i }));
      expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
      document.body.removeChild(target);
    });

    it('scrolls to #about via the scroll-to-explore indicator', async () => {
      const target = document.createElement('div');
      target.id = 'about';
      document.body.appendChild(target);
      const spy = vi.spyOn(target, 'scrollIntoView');
      render(<Hero data={DATA} contact={CONTACT} />);
      await userEvent.click(screen.getByText(/scroll to explore/i));
      expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
      document.body.removeChild(target);
    });

    it('no-ops when the scroll target is missing', async () => {
      render(<Hero data={DATA} contact={CONTACT} />);
      // No #projects element in the DOM → handler hits the `if (element)` false branch.
      await userEvent.click(screen.getByRole('button', { name: /view my work/i }));
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
