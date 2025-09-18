import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, MapPin, Calendar } from 'lucide-react';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  Location?: string;  // Optional location field (capital L to match JSON)
  location?: string;  // Also support lowercase for flexibility
  stack: string[];
  achievements: string[];
}

interface ExperienceProps {
  experience: ExperienceItem[];
}

export function Experience({ experience }: ExperienceProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0])); // First item expanded by default

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="space-y-6">
      {experience.map((item, index) => (
        <motion.div
          key={`${item.company}-${item.role}`}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border/60 dark:border-border/70 hover:border-primary/60 dark:hover:border-primary/70">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                      {item.role}
                    </h3>
                    <span className="text-lg text-primary">@ {item.company}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.period}</span>
                    </div>
                    {(item.Location || item.location) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.Location || item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(index)}
                  className="self-start lg:self-center"
                >
                  {expandedItems.has(index) ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Expand
                    </>
                  )}
                </Button>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.stack.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Expandable Achievements */}
              <AnimatePresence>
                {expandedItems.has(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border/60 dark:border-border/70 pt-4"
                  >
                    <h4 className="font-medium mb-3 text-foreground">Key Achievements</h4>
                    <ul className="space-y-2">
                      {item.achievements.map((achievement, achievementIndex) => (
                        <motion.li
                          key={achievementIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: achievementIndex * 0.1 
                          }}
                          className="flex items-start gap-3 text-foreground/70"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}