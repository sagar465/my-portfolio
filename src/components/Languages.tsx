import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Globe } from 'lucide-react';

interface SpokenLanguage {
  name: string;
  level: string;
}

interface LanguagesProps {
  languages: {
    spoken: SpokenLanguage[];
    programming: string[];
  };
}

// Language flag/icon components using CSS flags
const LanguageIcon = ({ language }: { language: string }) => {
  const getLanguageIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'english':
        return (
          <div className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-blue-600 text-white text-xs font-medium shadow-sm">
            🇺🇸
          </div>
        );
      case 'telugu':
        return (
          <div className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-orange-500 text-white text-xs font-medium shadow-sm">
            🇮🇳
          </div>
        );
      case 'hindi':
        return (
          <div className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-green-600 text-white text-xs font-medium shadow-sm">
            🇮🇳
          </div>
        );
      default:
        return (
          <div className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-gray-500 text-white text-xs font-medium shadow-sm">
            🌐
          </div>
        );
    }
  };

  return getLanguageIcon(language);
};

const getLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'native': return 'from-green-500/20 to-green-600/30 border-green-500/40';
    case 'fluent': return 'from-blue-500/20 to-blue-600/30 border-blue-500/40';
    case 'conversational': return 'from-orange-500/20 to-orange-600/30 border-orange-500/40';
    case 'intermediate': return 'from-yellow-500/20 to-yellow-600/30 border-yellow-500/40';
    case 'basic': return 'from-red-500/20 to-red-600/30 border-red-500/40';
    default: return 'from-gray-500/20 to-gray-600/30 border-gray-500/40';
  }
};

const getLevelBadgeColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'native': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'fluent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'conversational': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'basic': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

export function Languages({ languages }: LanguagesProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Spoken Languages */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-border/60 dark:border-border/70 hover:border-primary/60 dark:hover:border-primary/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium">Spoken Languages</h3>
            </div>
            
            {/* Horizontal Language Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {languages.spoken.map((lang, index) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`p-6 rounded-xl bg-gradient-to-br ${getLevelColor(lang.level)} border backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <LanguageIcon language={lang.name} />
                    <h4 className="font-medium text-lg">{lang.name}</h4>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={`${getLevelBadgeColor(lang.level)} border-0 font-medium`}
                  >
                    {lang.level}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* Note about communication */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50"
            >
              <p className="text-sm text-foreground/70 leading-relaxed text-center">
                <strong>Multilingual communication</strong> enables effective collaboration with diverse teams and clients across global markets, 
                particularly valuable in India's tech ecosystem and international projects.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Programming Languages - COMMENTED OUT as requested */}
      {/* 
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="h-full border-border/60 dark:border-border/70 hover:border-primary/60 dark:hover:border-primary/70 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium">Programming Languages</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {languages.programming.map((lang, index) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="text-sm py-2 px-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-default"
                  >
                    {lang}
                  </Badge>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50"
            >
              <p className="text-sm text-foreground/70 leading-relaxed">
                <strong>11+ years</strong> of professional experience across multiple programming paradigms, 
                with deep expertise in full-stack development, system architecture, and modern frameworks.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      */}
    </div>
  );
}