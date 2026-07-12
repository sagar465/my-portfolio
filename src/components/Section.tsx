import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  /**
   * Optional accent label rendered as a pill ABOVE the title — used to tag a section
   * with context a scanner should catch first (e.g. "Recent project · Agentic AI").
   */
  eyebrow?: ReactNode;
  children: ReactNode;
  className?: string;
  background?: 'default' | 'muted';
}

export function Section({
  id,
  title,
  subtitle,
  eyebrow,
  children,
  className = '',
  background = 'default'
}: SectionProps) {
  return (
    <section id={id} className={`py-20 relative ${className}`}>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          {eyebrow && (
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}