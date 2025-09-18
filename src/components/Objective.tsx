import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Target, Zap, Users, TrendingUp } from 'lucide-react';

interface ObjectiveProps {
  objective: {
    headline: string;
    description: string;
  };
}

export function Objective({ objective }: ObjectiveProps) {
  const goalIcons = [Target, Zap, Users, TrendingUp];
  
  // Create goals based on the headline and experience
  const goals = [
    "Architect scalable, user-first applications across finance, travel, and retail domains",
    "Accelerate development workflows using AI tools like GitHub Copilot, Cursor AI, and Figma Make",
    "Lead cross-functional teams in delivering robust microservices and modern UI frameworks", 
    "Drive continuous innovation through 11+ years of full-stack development expertise"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-medium mb-4 text-primary">{objective.headline}</h3>
            <p className="text-lg leading-relaxed text-foreground/80">
              {objective.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal, index) => {
          const IconComponent = goalIcons[index % goalIcons.length];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full group border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300"
                    >
                      <IconComponent className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
                        {goal}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}