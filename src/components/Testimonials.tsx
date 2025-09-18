import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.2,
            ease: "easeOut"
          }}
          whileHover={{ y: -5 }}
        >
          <Card className="h-full border-border/60 dark:border-border/70 hover:border-primary/60 dark:hover:border-primary/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden">
            {/* Background Quote Icon */}
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="w-12 h-12 text-primary" />
            </div>

            <CardContent className="p-6 relative">
              {/* Quote Content */}
              <div className="mb-6">
                <Quote className="w-6 h-6 text-primary mb-3" />
                <p className="text-foreground/80 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                    <ImageWithFallback
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
                </motion.div>

                <div>
                  <h4 className="font-medium text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}