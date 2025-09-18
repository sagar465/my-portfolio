import { motion } from 'motion/react';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  data: {
    name: string;
    title: string;
    tagline: string;
    avatar: string;
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
}

export function Hero({ data, contact }: HeroProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 sm:pt-20">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-background/30 dark:bg-background/20 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-primary p-1"
              >
                <div className="w-full h-full rounded-full bg-background p-1">
                  <ImageWithFallback
                    src={data.avatar}
                    alt={data.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-medium mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
          >
            {data.name}
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-6"
          >
            {data.title}
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {data.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              View My Work
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 text-lg"
            >
              Get In Touch
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex items-center justify-center gap-6 mb-16"
          >
            {contact.github && (
              <motion.a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-background/60 dark:bg-background/40 backdrop-blur-lg border border-border/30 hover:border-primary transition-colors shadow-lg shadow-black/5 dark:shadow-black/20"
              >
                <Github className="w-6 h-6" />
              </motion.a>
            )}
            
            <motion.a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-background/60 dark:bg-background/40 backdrop-blur-lg border border-border/30 hover:border-primary transition-colors shadow-lg shadow-black/5 dark:shadow-black/20"
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>
            
            <motion.a
              href={`mailto:${contact.email}`}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-background/60 dark:bg-background/40 backdrop-blur-lg border border-border/30 hover:border-primary transition-colors shadow-lg shadow-black/5 dark:shadow-black/20"
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => scrollToSection('about')}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}