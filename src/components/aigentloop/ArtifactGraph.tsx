/**
 * ArtifactGraph — the row of artifact nodes the pipeline produces (AC-4.2).
 *
 * One node per agent artifact (requirements.md, design-spec.md, …, release-notes.md).
 * A node advances pending → active → done as its agent runs, mirroring the engine's
 * `artifacts` map. Status is text ("Done"/"In progress"/"Pending") + icon, never
 * colour alone (WCAG 1.4.1). Pure presentational — reads only the derived status
 * map Pipeline passes down.
 */

import { motion } from 'motion/react';
import { CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';
import type { AgentDef, ArtifactStatus } from './engine/types';

/** Text label per artifact status — carried into the node's aria-label. */
const ARTIFACT_STATUS_LABEL: Record<ArtifactStatus, string> = {
  pending: 'Pending',
  active: 'In progress',
  done: 'Done',
};

function ArtifactIcon({ status, spin }: { status: ArtifactStatus; spin: boolean }) {
  const className = 'w-4 h-4';
  if (status === 'done') return <CheckCircle2 className={className} aria-hidden="true" />;
  if (status === 'active') {
    return <Loader2 className={cn(className, spin && 'animate-spin')} aria-hidden="true" />;
  }
  return <FileText className={className} aria-hidden="true" />;
}

export interface ArtifactGraphProps {
  /** Agent defs, in pipeline order — each carries the artifact to render. */
  agents: AgentDef[];
  /** Per-artifact status map from engine state, keyed by artifact id. */
  artifacts: Record<string, ArtifactStatus>;
  /** Drop enter animation to a plain swap under reduced motion (AC-5.3). */
  reducedMotion: boolean;
}

/**
 * Render the artifact nodes as a wrapping, horizontally-scrollable row. Each node
 * shows the artifact title + a status pill; done nodes are visually settled but the
 * status text still reads "Done" for non-colour comprehension.
 */
export function ArtifactGraph({ agents, artifacts, reducedMotion }: ArtifactGraphProps) {
  return (
    <ul
      className="flex flex-wrap gap-2 sm:gap-3 list-none p-0 m-0"
      aria-label="Pipeline artifacts"
    >
      {agents.map((agent, index) => {
        const status = artifacts[agent.artifact.id] ?? 'pending';
        const statusText = ARTIFACT_STATUS_LABEL[status];
        const isDone = status === 'done';
        const isActive = status === 'active';

        return (
          <motion.li
            key={agent.artifact.id}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.25, delay: index * 0.03 }}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors duration-300',
              'border-border/60 dark:border-border/70 bg-card/60',
              isActive && 'border-primary/70 dark:border-primary/70 text-foreground',
              isDone && 'text-foreground',
              status === 'pending' && 'text-muted-foreground',
            )}
            aria-label={`${agent.artifact.title} — ${statusText}`}
          >
            <span
              className={cn(
                'shrink-0',
                isDone && 'text-primary',
                isActive && 'text-primary',
              )}
            >
              <ArtifactIcon status={status} spin={!reducedMotion} />
            </span>
            <span className="font-mono text-xs sm:text-sm truncate max-w-[10rem]">
              {agent.artifact.title}
            </span>
            {/* Visible status word so comprehension never depends on the icon/colour. */}
            <span className="text-xs text-muted-foreground shrink-0">· {statusText}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}
