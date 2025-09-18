import { motion } from 'motion/react';
import { Heart, ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Back to Top Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="group"
            >
              <ArrowUp className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform duration-200" />
              Back to Top
            </Button>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-2"
          >
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              Built with <Heart className="w-4 h-4 text-red-500 fill-current" /> using React & Motion
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Alex Chen. All rights reserved.
            </p>
          </motion.div>

          {/* Tech Stack Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs text-muted-foreground text-center max-w-md"
          >
            This portfolio is designed for scalability - content structure is ready for migration to MongoDB 
            and the design system supports easy customization.
          </motion.div>
        </div>
      </div>
    </footer>
  );
}