import { useState, useEffect, lazy, Suspense, memo } from 'react';
import { motion } from 'motion/react';
import { Toaster } from './components/ui/sonner';

// Critical Components (loaded immediately)
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Section } from './components/Section';
import { TechBackgroundSVG } from './components/TechBackgroundSVG';
import { TechBackgroundSimple } from './components/TechBackgroundSimple';
import { ScrollProgress } from './components/ScrollProgress';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-loaded Components (loaded when needed) with better error handling
const Objective = lazy(() => 
  import('./components/Objective').then(m => ({ default: m.Objective })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Skills = lazy(() => 
  import('./components/Skills').then(m => ({ default: m.Skills })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Experience = lazy(() => 
  import('./components/Experience').then(m => ({ default: m.Experience })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Education = lazy(() => 
  import('./components/Education').then(m => ({ default: m.Education })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Languages = lazy(() => 
  import('./components/Languages').then(m => ({ default: m.Languages })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Hobbies = lazy(() => 
  import('./components/Hobbies').then(m => ({ default: m.Hobbies })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Projects = lazy(() => 
  import('./components/Projects').then(m => ({ default: m.Projects })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Testimonials = lazy(() => 
  import('./components/Testimonials').then(m => ({ default: m.Testimonials })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Contact = lazy(() => 
  import('./components/Contact').then(m => ({ default: m.Contact })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Footer = lazy(() => 
  import('./components/Footer').then(m => ({ default: m.Footer })).catch(() => ({ default: () => <div>Error loading content</div> }))
);
const Background = lazy(() => 
  import('./components/Background').then(m => ({ default: m.Background })).catch(() => ({ default: () => <div>Error loading content</div> }))
);

// Data
import { resumeData } from './data/resume-data';

// Loading fallback component
const LoadingFallback = memo(({ height = "32" }: { height?: string }) => (
  <div className={`h-${height} animate-pulse bg-muted/50 rounded-lg flex items-center justify-center`}>
    <div className="text-sm text-muted-foreground">Loading...</div>
  </div>
));

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

  // Performance fallback - use simple background if needed
  useEffect(() => {
    const timer = setTimeout(() => {
      // If page hasn't loaded within 3 seconds, use simple background
      setUseSimpleBackground(true);
    }, 3000);

    const handleLoad = () => {
      clearTimeout(timer);
    };

    // Check if we should use simple background immediately based on device
    const shouldUseSimple = window.innerWidth < 768 || navigator.hardwareConcurrency < 4;
    if (shouldUseSimple) {
      setUseSimpleBackground(true);
      clearTimeout(timer);
    }

    if (document.readyState === 'complete') {
      clearTimeout(timer);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
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
      
      {/* Header */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero 
          data={resumeData.profile} 
          contact={resumeData.contact}
        />

        {/* About/Objective Section */}
        <Section 
          id="about" 
          title="About Me" 
          subtitle="Driven by purpose, powered by technology"
          background="muted"
        >
          <Suspense fallback={<LoadingFallback />}>
            <Objective objective={resumeData.objective} />
          </Suspense>
        </Section>

        {/* Skills Section */}
        <Section 
          id="skills" 
          title="Technical Expertise" 
          subtitle="Full-stack development with modern technologies"
        >
          <Suspense fallback={<LoadingFallback />}>
            <Skills skills={resumeData.skills} />
          </Suspense>
        </Section>

        {/* Experience Section */}
        <Section 
          id="experience" 
          title="Professional Journey" 
          subtitle="Building scalable solutions across diverse industries"
          background="muted"
        >
          <Suspense fallback={<LoadingFallback height="48" />}>
            <Experience experience={resumeData.experience} />
          </Suspense>
        </Section>

        {/* Projects Section */}
        <Section 
          id="projects" 
          title="Featured Projects" 
          subtitle="Innovative solutions that make an impact"
        >
          <Suspense fallback={<LoadingFallback height="64" />}>
            <Projects projects={resumeData.projects} />
          </Suspense>
        </Section>

        {/* Education Section */}
        <Section 
          id="education" 
          title={resumeData.certifications && resumeData.certifications.length > 0 ? "Education & Certifications" : "Education"} 
          subtitle="Continuous learning and professional development"
          background="muted"
        >
          <Suspense fallback={<LoadingFallback />}>
            <Education 
              education={resumeData.education} 
              certifications={resumeData.certifications}
            />
          </Suspense>
        </Section>

        {/* Languages Section */}
        <Section 
          id="languages" 
          title="Languages" 
          subtitle="Communication across cultures and technologies"
        >
          <Suspense fallback={<LoadingFallback />}>
            <Languages languages={resumeData.languages} />
          </Suspense>
        </Section>

        {/* Background Timeline Section */}
        <Section 
          id="background" 
          title="My Journey" 
          subtitle="The path that led me here"
          background="muted"
        >
          <Suspense fallback={<LoadingFallback height="48" />}>
            <Background />
          </Suspense>
        </Section>

        {/* Hobbies Section */}
        <Section 
          id="hobbies" 
          title="Beyond Code" 
          subtitle="Passions that inspire creativity and innovation"
          background="muted"
        >
          <Suspense fallback={<LoadingFallback height="48" />}>
            <Hobbies hobbies={resumeData.hobbies} />
          </Suspense>
        </Section>

        {/* Testimonials Section - Only show if testimonials exist */}
        {resumeData.testimonials && resumeData.testimonials.length > 0 && (
          <Section 
            id="testimonials" 
            title="What Others Say" 
            subtitle="Feedback from collaborators and clients"
          >
            <Suspense fallback={<LoadingFallback />}>
              <Testimonials testimonials={resumeData.testimonials} />
            </Suspense>
          </Section>
        )}

        {/* Contact Section */}
        <Section 
          id="contact" 
          title="Let's Build Something Amazing" 
          subtitle="Ready to bring your ideas to life"
          background="muted"
        >
          <Suspense fallback={<LoadingFallback />}>
            <Contact contact={resumeData.contact} />
          </Suspense>
        </Section>
      </main>

      {/* Footer */}
      <Suspense fallback={<div className="h-24 bg-muted/50 flex items-center justify-center"><span className="text-sm text-muted-foreground">Loading footer...</span></div>}>
        <Footer />
      </Suspense>

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Toast Notifications */}
      <Toaster />

      {/* Performance Monitor (dev only) */}
      <PerformanceMonitor />
    </div>
  );
}