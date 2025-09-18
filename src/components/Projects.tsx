import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, Github, Star, Users, TrendingUp, Award, X, ChevronLeft, ChevronRight, Smartphone, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface Project {
  name: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
  screenshots: string[];
}

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<any>(null);

  const openGallery = (projectIndex: number) => {
    setSelectedProject(projectIndex);
    setSelectedImage(0);
  };

  const closeGallery = useCallback(() => {
    setSelectedProject(null);
    setSelectedImage(0);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedProject !== null) {
        closeGallery();
      }
    };

    if (selectedProject !== null) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedProject, closeGallery]);

  // Handle click outside with better detection
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeGallery();
    }
  }, [closeGallery]);

  const nextImage = useCallback(() => {
    if (selectedProject !== null) {
      const project = projects[selectedProject];
      setSelectedImage((prev) => (prev + 1) % project.screenshots.length);
      // Reset zoom and center when changing images
      setTimeout(() => {
        if (transformRef.current) {
          transformRef.current.setTransform(0, 0, 1, 200, "easeOut");
        }
      }, 50);
    }
  }, [selectedProject, projects]);

  const prevImage = useCallback(() => {
    if (selectedProject !== null) {
      const project = projects[selectedProject];
      setSelectedImage((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length);
      // Reset zoom and center when changing images
      setTimeout(() => {
        if (transformRef.current) {
          transformRef.current.setTransform(0, 0, 1, 200, "easeOut");
        }
      }, 50);
    }
  }, [selectedProject, projects]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedProject === null) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevImage();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextImage();
      }
    };

    if (selectedProject !== null) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, nextImage, prevImage]);

  // Reset and center when modal opens or image changes
  useEffect(() => {
    if (selectedProject !== null && transformRef.current) {
      const timer = setTimeout(() => {
        transformRef.current.setTransform(0, 0, 1, 200, "easeOut");
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [selectedProject, selectedImage]);

  const getHighlightIcon = (highlight: string) => {
    if (highlight.includes('star') || highlight.includes('rating')) return Star;
    if (highlight.includes('user') || highlight.includes('school')) return Users;
    if (highlight.includes('improvement') || highlight.includes('accuracy')) return TrendingUp;
    if (highlight.includes('featured') || highlight.includes('partnership')) return Award;
    return TrendingUp;
  };

  return (
    <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
      {projects.map((project, index) => (
        <motion.div
          key={project.name}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ y: -5 }}
          className="group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] xl:w-[calc(33.333%-1.33rem)] max-w-md"
        >
          <Card className="h-full overflow-hidden border-border/60 dark:border-border/70 hover:border-primary/60 dark:hover:border-primary/70 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
            {/* Project Image */}
            <div className="relative overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <ImageWithFallback
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
              {/* Project Header */}
              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Key Features */}
              <div className="mb-6 flex-1">
                <h4 className="font-medium mb-3 text-foreground">Key Features</h4>
                <div className="space-y-2">
                  {project.description.split('.').filter(sentence => sentence.trim()).slice(0, 3).map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.3, 
                        delay: (index * 0.1) + (featureIndex * 0.05)
                      }}
                      className="flex items-center gap-2 text-sm text-foreground/70"
                    >
                      <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature.trim()}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Project Links */}
              <div className="flex gap-3 pt-4 border-t border-border/60 dark:border-border/70">
                {project.link && (
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Learn More
                    </a>
                  </Button>
                )}
                {project.screenshots.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className={project.link ? '' : 'flex-1'}
                    onClick={() => openGallery(index)}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Screenshots ({project.screenshots.length})
                    </span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Screenshot Gallery Modal */}
      <AnimatePresence>
    {selectedProject !== null && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full h-full flex flex-col max-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with controls */}
              <div className="flex justify-between items-center p-3 sm:p-4 bg-black/30 backdrop-blur-sm shrink-0">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-1 truncate">
                    {projects[selectedProject].name}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm">
                    {selectedImage + 1} of {projects[selectedProject].screenshots.length}
                  </p>
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 sm:gap-2 mx-2 sm:mx-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => transformRef.current?.zoomIn()}
                    className="bg-black/50 text-white hover:bg-black/70 p-1.5 sm:p-2"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => transformRef.current?.zoomOut()}
                    className="bg-black/50 text-white hover:bg-black/70 p-1.5 sm:p-2"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (transformRef.current) {
                        transformRef.current.setTransform(0, 0, 1, 200, "easeOut");
                      }
                    }}
                    className="bg-black/50 text-white hover:bg-black/70 p-1.5 sm:p-2"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeGallery}
                  className="bg-black/50 text-white hover:bg-black/70 p-1.5 sm:p-2"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              {/* Main Screenshot with Zoom/Pan */}
              <div className="flex-1 relative bg-black/50 overflow-hidden min-h-0">
                <div className="absolute inset-0">
                  <TransformWrapper
                    ref={transformRef}
                    initialScale={1}
                    minScale={0.5}
                    maxScale={5}
                    centerOnInit={true}
                    centerZoomedOut={true}
                    wheel={{ step: 0.1 }}
                    pan={{ 
                      disabled: false,
                      velocityDisabled: true 
                    }}
                    pinch={{ 
                      disabled: false 
                    }}
                    doubleClick={{ 
                      disabled: false,
                      mode: 'toggle',
                      step: 0.7 
                    }}
                    limitToBounds={false}
                    smooth={true}
                    onInit={(ref) => {
                      transformRef.current = ref;
                    }}
                  >
                    <TransformComponent
                      wrapperClass="!w-full !h-full"
                      contentClass="!w-full !h-full !flex !items-center !justify-center"
                    >
                      {selectedProject !== null && (
                        <ImageWithFallback
                          src={projects[selectedProject].screenshots[selectedImage]}
                          alt={`${projects[selectedProject].name} screenshot ${selectedImage + 1}`}
                          className="max-w-full max-h-full object-contain select-none"
                        />
                      )}
                    </TransformComponent>
                  </TransformWrapper>
                </div>

                {/* Navigation Buttons */}
                {selectedProject !== null && projects[selectedProject].screenshots.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white hover:bg-black/90 backdrop-blur-sm z-10"
                      title="Previous Image (←)"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white hover:bg-black/90 backdrop-blur-sm z-10"
                      title="Next Image (→)"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}

                {/* Zoom Instructions */}
                {/* <div className="absolute bottom-4 left-4 bg-black/70 text-white/80 text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
                  <div>Double-click: Toggle zoom</div>
                  <div>Wheel: Zoom in/out</div>
                  <div>Drag: Pan around</div>
                </div> */}
              </div>

              {/* Footer with thumbnails and project info */}
              <div className="bg-black/30 backdrop-blur-sm p-3 sm:p-4 shrink-0">
                {/* Thumbnail Navigation */}
                {projects[selectedProject].screenshots.length > 1 && (
                  <div className="flex justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2">
                    {projects[selectedProject].screenshots.map((screenshot, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          // Reset zoom and center when changing images
                          setTimeout(() => {
                            if (transformRef.current) {
                              transformRef.current.setTransform(0, 0, 1, 200, "easeOut");
                            }
                          }, 50);
                        }}
                        className={`flex-shrink-0 w-10 h-16 sm:w-12 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === selectedImage 
                            ? 'border-white scale-110' 
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <ImageWithFallback
                          src={screenshot}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Project Info */}
                {/* <div className="text-center">
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-2">
                    {projects[selectedProject].tech.slice(0, 6).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs bg-white/10 text-white border-white/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                    {projects[selectedProject].description}
                  </p>
                </div> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}