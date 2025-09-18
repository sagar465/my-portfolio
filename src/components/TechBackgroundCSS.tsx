export function TechBackgroundCSS() {
  // Exact same tech symbols as the original
  const matrixChars = [
    // Core tech symbols
    '⚛️', '🅰️', '🔷', '🟨', '☕', '🐍', '🟢', '🍃', '📊', '🐳', '⚙️', '🚀', '🤖', '📱', '💻',
    // Programming symbols
    '{', '}', '<', '>', '/', '|', '+', '-', '=', '*', '@', '#',
    // Math symbols
    'λ', 'φ', 'π', '∞', '∑',
    // Binary
    '0', '1', 'A', 'B', 'C', 'D', 'E', 'F',
    // Operators
    '=>', '->', '++', '==', '&&',
  ];

  // Generate columns that mimic the original behavior
  const generateColumns = () => {
    const columns = [];
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const numColumns = Math.min(Math.floor(screenWidth / 40), 30); // Same logic as original
    
    for (let i = 0; i < numColumns; i++) {
      const trailLength = 6 + Math.floor(Math.random() * 5); // 6-10 characters (shorter trails)
      const columnChars = [];
      
      for (let j = 0; j < trailLength; j++) {
        const symbol = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const isHead = j === 0;
        const opacity = isHead ? 1 : Math.max(0, 1 - (j * 0.15)); // Same fade logic as original
        
        columnChars.push({
          symbol,
          y: j * 25, // Character spacing in the trail
          opacity,
          isHead,
          id: `${i}-${j}`
        });
      }
      
      columns.push({
        x: i * 40 + 20, // Exact same spacing as original (40px between columns)
        chars: columnChars,
        speed: 30 + Math.random() * 60, // Same speed range as original
        animationDelay: Math.random() * 5, // Random start delay
        id: i
      });
    }
    
    return columns;
  };

  const columns = generateColumns();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle gradient overlay - same as original */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
      
      {/* Matrix Digital Rain */}
      <div className="absolute inset-0">
        {columns.map(column => (
          <div 
            key={column.id}
            className="absolute top-0"
            style={{ left: column.x }}
          >
            {column.chars.map((char) => (
              <div
                key={char.id}
                className="absolute font-mono select-none matrix-char"
                style={{
                  fontSize: '13px', // Exact same as original
                  color: char.isHead 
                    ? '#00ff41' // Bright green for head character
                    : `rgba(0, 255, 65, ${char.opacity * 0.6})`, // Fading green trail
                  textShadow: char.isHead 
                    ? '0 0 3px #00ff41' 
                    : 'none',
                  fontWeight: char.isHead ? '500' : '400',
                  opacity: char.opacity,
                  top: char.y,
                  animationDelay: `${column.animationDelay}s`,
                  animationDuration: `${8 + (column.speed / 10)}s`, // Speed varies based on column
                }}
              >
                {char.symbol}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Matrix-style ambient effects - same as original */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, #00ff41 0%, transparent 50%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* CSS Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .matrix-char {
            animation: matrixFall linear infinite;
          }
          
          @keyframes matrixFall {
            0% {
              transform: translateY(-30px);
              opacity: 0;
            }
            5% {
              opacity: 1;
            }
            95% {
              opacity: 1;
            }
            100% {
              transform: translateY(calc(100vh + 50px));
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
}