import { useEffect, useState } from 'react';

export function PerformanceMonitor() {
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    
    const handleLoad = () => {
      const endTime = performance.now();
      setLoadTime(endTime - startTime);
      console.log(`Page loaded in ${(endTime - startTime).toFixed(2)}ms`);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Only show in development - always hide in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded z-50">
      {loadTime ? `Loaded: ${loadTime.toFixed(0)}ms` : 'Loading...'}
    </div>
  );
}