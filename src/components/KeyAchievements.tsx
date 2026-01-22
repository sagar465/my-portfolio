import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';

type KeyAchievement = {
  title: string;
  description: string;
  bullets?: string[];
};

interface KeyAchievementsProps {
  achievements: KeyAchievement[];
}

export function KeyAchievements({ achievements }: KeyAchievementsProps) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6">
      {achievements.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-2 text-foreground">{item.title}</h3>
              <p className="text-foreground/80 leading-relaxed">{item.description}</p>

              {item.bullets && item.bullets.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/70">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
