import { lazy, Suspense, memo, useEffect } from 'react';

// Critical Components (loaded immediately)
import { Hero } from './Hero';
import { Section } from './Section';
import { AIgentLoopSection } from './aigentloop/AIgentLoopSection';
import { resolveAnchorId, scrollToId } from './ScrollToAnchor';

// Data
import { resumeData } from '../data/resume-manager-data';

// Lazy-loaded Components (loaded when needed) with better error handling.
// Preserved verbatim from the pre-router App.tsx (codebase-map §3): the code-split
// boundaries, the dynamic import() factories, and their defensive `.catch(...)`
// module-load fallbacks are moved UNCHANGED — no logic was authored here in P0.
// The fallback arrows only run when a chunk fails to load at runtime, which a
// green unit test never triggers; they are excluded from coverage as preserved,
// non-P0 defensive paths (the new P0 logic — anchor scroll + the AIgentLoop slot
// below — is fully covered).
/* v8 ignore start */
const Objective = lazy(() =>
  import('./Objective').then(m => ({ default: m.Objective })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const KeyAchievements = lazy(() =>
  import('./KeyAchievements').then(m => ({ default: m.KeyAchievements })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Skills = lazy(() =>
  import('./Skills').then(m => ({ default: m.Skills })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Experience = lazy(() =>
  import('./Experience').then(m => ({ default: m.Experience })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Education = lazy(() =>
  import('./Education').then(m => ({ default: m.Education })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Languages = lazy(() =>
  import('./Languages').then(m => ({ default: m.Languages })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Hobbies = lazy(() =>
  import('./Hobbies').then(m => ({ default: m.Hobbies })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Projects = lazy(() =>
  import('./Projects').then(m => ({ default: m.Projects })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Testimonials = lazy(() =>
  import('./Testimonials').then(m => ({ default: m.Testimonials })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Contact = lazy(() =>
  import('./Contact').then(m => ({ default: m.Contact })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Background = lazy(() =>
  import('./Background').then(m => ({ default: m.Background })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
/* v8 ignore stop */

// Loading fallback component (preserved from App.tsx)
const LoadingFallback = memo(({ height = "32" }: { height?: string }) => (
  <div className={`h-${height} animate-pulse bg-muted/50 rounded-lg flex items-center justify-center`}>
    <div className="text-sm text-muted-foreground">Loading...</div>
  </div>
));

interface HomepageProps {
  /**
   * Route anchor intent (architecture §2.2). When a path route such as
   * /projects/edusarvam or /experience/wells-fargo renders the homepage, the
   * router passes the intent here and we scroll to the resolved section.
   */
  anchor?: string;
}

/**
 * The homepage body — all 12 sections in D-003 order, with the AIgentLoop live
 * section inserted immediately after Hero. Extracted verbatim from the pre-router
 * App.tsx <main> (AC-7.1/7.3): no section content, id, prop, or lazy/Suspense flow
 * was changed. The only structural additions are (a) the AIgentLoop slot after
 * Hero and (b) the `anchor`-driven scroll for path-based deep links.
 *
 * P0 note: the after-Hero AIgentLoop slot is a lightweight placeholder; the real
 * flagship (AIgentLoopSection) lands in P4.
 */
export function Homepage({ anchor }: HomepageProps) {
  // Path-based deep links (/projects/edusarvam, /experience/wells-fargo) resolve
  // their target section id and scroll to it once the page has painted. Hash
  // deep links (/#skills) are handled by <ScrollToAnchor/> at the App shell.
  useEffect(() => {
    // scrollToId polls across frames until the target (a lazy + Suspense section
    // that has not laid out on the first frame) exists and its offsetTop is
    // stable, then scrolls — so deep links land even after the chunk mounts late.
    // Cancel the pending poll on unmount / anchor change so no rAF leaks.
    const cancel = scrollToId(resolveAnchorId(anchor));
    return cancel;
  }, [anchor]);

  return (
    <main>
      {/* Hero Section */}
      <Hero
        data={resumeData.profile}
        contact={resumeData.contact}
      />

      {/* AIgentLoop Live Section (after Hero, D-003) — the real flagship pipeline.
          Single insertion; no other section is touched (AC-7.3). */}
      <AIgentLoopSection />

      {/* About/Objective Section */}
      <Section
        id="about"
        title="About Me"
        subtitle="Driven by purpose, powered by technology"
        background="muted"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Objective objective={resumeData.objective} />
        </Suspense>
      </Section>

      {/* Key Achievements Section */}
      {resumeData.objective.keyAchievements && resumeData.objective.keyAchievements.length > 0 && (
        <Section
          id="achievements"
          title="Key Achievements"
          subtitle="Highlights that reflect how I deliver impact"
        >
          <Suspense fallback={<LoadingFallback height="48" />}>
            <KeyAchievements achievements={resumeData.objective.keyAchievements} />
          </Suspense>
        </Section>
      )}

      {/* Skills Section */}
      <Section
        id="skills"
        title="Technical Expertise"
        subtitle="Full-stack development with modern technologies"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Skills skills={resumeData.skills} />
        </Suspense>
      </Section>

      {/* Experience Section */}
      <Section
        id="experience"
        title="Professional Journey"
        subtitle="Building scalable solutions across diverse industries"
        background="muted"
      >
        <Suspense fallback={<LoadingFallback height="48" />}>
          <Experience experience={resumeData.experience} />
        </Suspense>
      </Section>

      {/* Projects Section */}
      <Section
        id="projects"
        title="Featured Projects"
        subtitle="Innovative solutions that make an impact"
      >
        <Suspense fallback={<LoadingFallback height="64" />}>
          <Projects projects={resumeData.projects} />
        </Suspense>
      </Section>

      {/* Education Section */}
      <Section
        id="education"
        title={resumeData.certifications && resumeData.certifications.length > 0 ? "Education & Certifications" : "Education"}
        subtitle="Continuous learning and professional development"
        background="muted"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Education
            education={resumeData.education}
            certifications={resumeData.certifications}
          />
        </Suspense>
      </Section>

      {/* Languages Section */}
      <Section
        id="languages"
        title="Languages"
        subtitle="Communication across cultures and technologies"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Languages languages={resumeData.languages} />
        </Suspense>
      </Section>

      {/* Background Timeline Section */}
      <Section
        id="background"
        title="My Journey"
        subtitle="The path that led me here"
        background="muted"
      >
        <Suspense fallback={<LoadingFallback height="48" />}>
          <Background />
        </Suspense>
      </Section>

      {/* Hobbies Section */}
      <Section
        id="hobbies"
        title="Beyond Code"
        subtitle="Passions that inspire creativity and innovation"
        background="muted"
      >
        <Suspense fallback={<LoadingFallback height="48" />}>
          <Hobbies hobbies={resumeData.hobbies} />
        </Suspense>
      </Section>

      {/* Testimonials Section - Only show if testimonials exist */}
      {resumeData.testimonials && resumeData.testimonials.length > 0 && (
        <Section
          id="testimonials"
          title="What Others Say"
          subtitle="Feedback from collaborators and clients"
        >
          <Suspense fallback={<LoadingFallback />}>
            <Testimonials testimonials={resumeData.testimonials} />
          </Suspense>
        </Section>
      )}

      {/* Contact Section */}
      <Section
        id="contact"
        title="Let's Build Something Amazing"
        subtitle="Ready to bring your ideas to life"
        background="muted"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Contact contact={resumeData.contact} />
        </Suspense>
      </Section>
    </main>
  );
}
