import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Server, Globe, Cloud, Zap } from 'lucide-react';

interface SkillsProps {
  skills: {
    backend: string[];
    frontend: string[];
    cloud: string[];
    aiTools: string[];
  };
}

export function Skills({ skills }: SkillsProps) {
  const skillCategories = [
    {
      title: 'Frontend Development',
      technologies: skills.frontend,
      icon: Globe,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Backend Development',
      technologies: skills.backend,
      icon: Server,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Cloud & DevOps',
      technologies: skills.cloud,
      icon: Cloud,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'AI Tools & Productivity',
      technologies: skills.aiTools,
      icon: Zap,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {skillCategories.map((category, index) => {
        const IconComponent = category.icon;
        
        return (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <Card className="group h-full border-border/60 dark:border-border/70 hover:border-primary/60 dark:hover:border-primary/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.3, 
                        delay: (index * 0.1) + (techIndex * 0.05)
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-default"
                      >
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}