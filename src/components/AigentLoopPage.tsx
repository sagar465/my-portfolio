import { lazy, Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import { Section } from './Section';

/**
 * Dedicated /aigentloop deep-dive page — the flagship at page weight
 * (`<Pipeline variant="page"/>`), plus short intro copy for a cold visitor.
 *
 * The heavy `Pipeline` (engine + agent-card UI) is `React.lazy`-loaded here so its
 * JS is NOT in the homepage critical path (architecture §7) — App.tsx statically
 * imports only this thin page shell; the engine chunk loads when the page renders.
 *
 * Rendered under the App shell (Header/Footer/background inherited) so nav parity
 * holds here too (AC-7.2). The `#gate-1` / `#step-<agent>` anchor targets that deep
 * links resolve to live inside `<Pipeline/>` (AC-6.2).
 */

const Pipeline = lazy(() =>
  import('./aigentloop/Pipeline').then((m) => ({ default: m.Pipeline })),
);

function PipelineFallback() {
  return (
    <div className="h-40 animate-pulse bg-muted/50 rounded-xl flex items-center justify-center">
      <span className="text-sm text-muted-foreground">Loading the pipeline…</span>
    </div>
  );
}

export function AigentLoopPage() {
  return (
    <main className="pt-16">
      <Section
        id="aigentloop"
        title="AIgentLoop"
        eyebrow={
          <>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Recent project · Agentic AI
          </>
        }
        subtitle="A multi-agent AI software build pipeline I designed and built"
      >
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <p className="text-muted-foreground">
            AIgentLoop is one of my recent projects — I built it to explore agentic
            software delivery. It coordinates a team of specialised AI agents —
            Requirements, Design, Architecture, Implementer, Tester, and Handoff — to take
            an idea from spec to a diff that is ready for a human to commit. It pauses at
            human approval gates and self-corrects through revise loops.
          </p>
          <p className="text-muted-foreground">
            The pipeline below plays itself: watch each agent hand off its artifact,
            pause at the human approval gate, and self-correct when the tester sends a
            fix back to the implementer — before the run ends at a reviewable diff.
          </p>
        </div>

        <Suspense fallback={<PipelineFallback />}>
          <Pipeline variant="page" />
        </Suspense>
      </Section>
    </main>
  );
}
