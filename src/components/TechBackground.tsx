import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface MatrixColumn {
  id: number;
  x: number;
  characters: Array<{
    id: number;
    char: string;
    y: number;
    opacity: number;
    isHead: boolean;
  }>;
  speed: number;
  nextCharDelay: number;
}

export function TechBackground() {
  const [columns, setColumns] = useState<MatrixColumn[]>([]);

  // Simplified tech symbols for Matrix rain (reduced set for better performance)
  const matrixChars = [
    // Core tech symbols
    '⚛️', '🅰️', '🔷', '🟨', '☕', '🐍', '🟢', '🍃', '📊', '🐳', '⚙️', '🚀', '🤖', '📱', '💻',
    // Programming symbols (reduced)
    '{', '}', '<', '>', '/', '|', '+', '-', '=', '*', '@', '#',
    // Math symbols (reduced)
    'λ', 'φ', 'π', '∞', '∑',
    // Binary
    '0', '1', 'A', 'B', 'C', 'D', 'E', 'F',
    // Operators
    '=>', '->', '++', '==', '&&',
  ];

  useEffect(() => {
    const createColumns = () => {
      const numColumns = Math.floor(window.innerWidth / 40); // Reduced density: One column every 40px
      const newColumns: MatrixColumn[] = [];

      for (let i = 0; i < Math.min(numColumns, 30); i++) { // Cap at 30 columns max
        newColumns.push({
          id: i,
          x: i * 40 + 20, // Increased spacing to 40px between columns
          characters: [],
          speed: 30 + Math.random() * 60, // Reduced speed range
          nextCharDelay: Math.random() * 3000, // Longer delays
        });
      }

      setColumns(newColumns);
    };

    createColumns();
    window.addEventListener('resize', createColumns);
    return () => window.removeEventListener('resize', createColumns);
  }, []);

  useEffect(() => {
    if (columns.length === 0) return;

    const interval = setInterval(() => {
      setColumns(prevColumns => 
        prevColumns.map(column => {
          const newCharacters = [...column.characters];
          
          // Add new character at the top less frequently
          if (Math.random() < 0.08 && (newCharacters.length === 0 || newCharacters[0].y > 80)) {
            newCharacters.unshift({
              id: Date.now() + Math.random(),
              char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
              y: -30,
              opacity: 1,
              isHead: true,
            });
          }

          // Update existing characters
          return {
            ...column,
            characters: newCharacters
              .map((char, index) => ({
                ...char,
                y: char.y + column.speed * 0.015, // Slower movement
                opacity: char.isHead 
                  ? 1 
                  : Math.max(0, 1 - (index * 0.15)), // Faster fade
                isHead: index === 0,
              }))
              .filter(char => char.y < window.innerHeight + 50) // Remove characters that are off-screen
              .slice(0, 10) // Shorter trails
          };
        })
      );
    }, 80); // Less frequent updates

    return () => clearInterval(interval);
  }, [columns.length]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
      
      {/* Matrix Digital Rain */}
      <div className="absolute inset-0">
        {columns.map(column => (
          <div 
            key={column.id}
            className="absolute top-0"
            style={{ left: column.x }}
          >
            {column.characters.map((char, index) => (
              <div
                key={char.id}
                className="absolute font-mono select-none"
                style={{
                  top: char.y,
                  fontSize: '13px',
                  color: char.isHead 
                    ? '#00ff41' // Bright green for head character
                    : `rgba(0, 255, 65, ${char.opacity * 0.6})`, // Fading green trail
                  textShadow: char.isHead 
                    ? '0 0 3px #00ff41' 
                    : 'none',
                  fontWeight: char.isHead ? '500' : '400',
                  opacity: char.opacity,
                  transition: 'opacity 0.1s ease-out',
                }}
              >
                {char.char}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Additional Matrix-style ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Matrix-style glow overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, #00ff41 0%, transparent 50%)',
            filter: 'blur(100px)',
          }}
        />
      </div>
    </div>
  );
}