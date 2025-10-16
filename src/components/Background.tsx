import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { GraduationCap, Code, Users, Briefcase, Rocket } from 'lucide-react';
// import resumeData from '../data/resume-data';
import resumeData from '../data/resume-manager-data';

interface BackgroundProps {}

// Icon mapping for timeline entries
const iconMap = {
  GraduationCap,
  Code, 
  Users,
  Briefcase,
  Rocket
};

export function Background({}: BackgroundProps) {
  const timeline = resumeData.background.timeline;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

        <div className="space-y-8">
          {timeline.map((item, index) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline Dot */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="relative z-10 flex-shrink-0"
                >
                  <div className="w-16 h-16 bg-gradient-to-br bg-black from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className="absolute inset-0 bg-primary/20 rounded-full"
                  />
                </motion.div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl font-bold text-primary">
                            {item.year}
                          </span>
                          <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">
                          {item.title}
                        </h3>
                        <div className="mb-3">
                          <span className="text-sm text-primary/80 font-medium">
                            {item.role} • {item.company}
                          </span>
                        </div>
                        <p className="text-foreground/70 leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}