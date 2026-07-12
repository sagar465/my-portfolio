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
      subtitle="An autonomous multi-agent build pipeline — watch it work"
      background="muted"
    >
      <Suspense fallback={<PipelineFallback />}>
        <Pipeline variant="section" />
      </Suspense>
    </Section>
  );
}
