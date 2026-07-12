import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

// Critical Components (loaded immediately)
import { Header } from './components/Header';
import { TechBackgroundSVG } from './components/TechBackgroundSVG';
import { TechBackgroundSimple } from './components/TechBackgroundSimple';
import { ScrollProgress } from './components/ScrollProgress';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToAnchor } from './components/ScrollToAnchor';
import { Homepage } from './components/Homepage';
import { AigentLoopPage } from './components/AigentLoopPage';

// Chrome that stays outside <Routes> so every route inherits it.
const Footer = lazy(() =>
  import('./components/Footer').then(m => ({ default: m.Footer })).catch(() => ({ default: () => <div>Error loading content</div> }))
);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [useSimpleBackground, setUseSimpleBackground] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Use simple background only if user prefers reduced motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setUseSimpleBackground(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Tech Background with fallback */}
      <ErrorBoundary>
        {useSimpleBackground ? <TechBackgroundSimple /> : <TechBackgroundSVG />}
      </ErrorBoundary>

      {/* Header — rendered outside <Routes> so nav parity holds on every route */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Resolves hash deep links (/#skills, /aigentloop#gate-1) after navigation */}
      <ScrollToAnchor />

      {/* Routed content (architecture §2.2 route table) */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/aigentloop" element={<AigentLoopPage />} />
        <Route path="/projects/edusarvam" element={<Homepage anchor="edusarvam" />} />
        <Route path="/experience/wells-fargo" element={<Homepage anchor="experience-wells-fargo" />} />
        {/* Catch-all → graceful in-app landing, never a raw 404/blank (AC-6.4) */}
        <Route path="*" element={<Homepage />} />
      </Routes>

      {/* Footer */}
      <Suspense fallback={<div className="h-24 bg-muted/50 flex items-center justify-center"><span className="text-sm text-muted-foreground">Loading footer...</span></div>}>
        <Footer />
      </Suspense>

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
