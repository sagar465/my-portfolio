import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { GraduationCap, Award, Calendar } from 'lucide-react';

interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  period: string;
  GPA: string;
}

interface EducationProps {
  education: EducationItem[];
  certifications?: string[];
}

export function Education({ education, certifications }: EducationProps) {
  const hasCertifications = certifications && certifications.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Education */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Education
        </h3>
        
        <div className="space-y-4">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-border/60 dark:border-border/70 hover:border-primary/60 dark:hover:border-primary/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium mb-1">{item.degree}</h4>
                      <p className="text-foreground/70 mb-2">{item.field}</p>
                      <p className="text-primary font-medium">{item.institution}</p>
                    </div>
                    
                    <div className="flex flex-col lg:items-end gap-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{item.period}</span>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        GPA: {item.GPA}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certifications - Only render if certifications exist */}
      {hasCertifications && (
        <div className="space-y-6">
          <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Certifications
          </h3>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-border/60 dark:border-border/70">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications!.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1 
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-foreground/80">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}