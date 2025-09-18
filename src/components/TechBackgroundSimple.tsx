import { memo } from 'react';

export const TechBackgroundSimple = memo(function TechBackgroundSimple() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-30 dark:opacity-40">
      {/* Simple CSS-based animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent"></div>
      
      {/* Simple floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 3) * 20}%`,
              animation: `float ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
      `}</style>
    </div>
  );
});