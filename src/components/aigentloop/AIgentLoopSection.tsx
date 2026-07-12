/**
 * AIgentLoopSection — the homepage embed (after Hero, D-003 order).
 *
 * A thin wrapper that drops `<Pipeline variant="section"/>` into the existing
 * `<Section id="aigentloop">` shell so it reuses the site's tokens, rhythm, and
 * heading treatment (AC-X.5) and reads as the same site. `Pipeline` (which pulls in
 * the whole engine + agent-card UI) is `React.lazy`-loaded so the flagship's JS stays
 * OFF the homepage critical path (architecture §7) — the initial `/` payload only
 * carries this small shell + a Suspense fallback, matching the other lazy sections.
 */

import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Section } from '../Section';

// Lazy so the engine + pipeline UI split into their own chunk (architecture §7).
const Pipeline = lazy(() =>
  import('./Pipeline').then((m) => ({ default: m.Pipeline })),
);

/** Loading fallback consistent with the homepage's other lazy sections. */
function PipelineFallback() {
  return (
    <div className="h-40 animate-pulse bg-muted/50 rounded-xl flex items-center justify-center">
      <span className="text-sm text-muted-foreground">Loading the pipeline…</span>
    </div>
  );
}

export function AIgentLoopSection() {
  return (
    <Section
      id="aigentloop"
      title="AIgentLoop"
      eyebrow={
        <>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Recent project · Agentic AI
        </>
      }
      subtitle="A multi-agent AI system I designed and built — watch it run itself."
      background="muted"
    >
      {/* Ownership + context for a scanning recruiter: this is my own recent build,
          not a generic demo — with a path to the deep-dive page. */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
        <p className="text-muted-foreground">
          I built AIgentLoop to explore agentic software delivery: a self-orchestrating
          team of six AI agents that carries a feature from requirements through
          implementation and testing to a human-reviewable diff — pausing at approval
          gates and self-correcting when the tester sends a fix back.
        </p>
        <div>
          <Link
            to="/aigentloop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Explore the deep-dive
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Suspense fallback={<PipelineFallback />}>
        <Pipeline variant="section" />
      </Suspense>
    </Section>
  );
}
