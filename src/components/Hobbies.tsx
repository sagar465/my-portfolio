import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Hobby {
  name: string;
  description: string;
  images: string[];
}

interface HobbiesProps {
  hobbies: {
    items: Hobby[];
  };
}

export function Hobbies({ hobbies }: HobbiesProps) {
  // If there are no hobbies, show a placeholder message
  if (!hobbies.items || hobbies.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Hobbies and interests will be added soon...
        </p>
      </div>
    );
  }
  const [selectedHobby, setSelectedHobby] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const openGallery = (hobbyIndex: number) => {
    setSelectedHobby(hobbyIndex);
    setSelectedImage(0);
  };

  const closeGallery = () => {
    setSelectedHobby(null);
    setSelectedImage(0);
  };

  const nextImage = () => {
    if (selectedHobby !== null) {
      const hobby = hobbies.items[selectedHobby];
      setSelectedImage((prev) => (prev + 1) % hobby.images.length);
    }
  };

  const prevImage = () => {
    if (selectedHobby !== null) {
      const hobby = hobbies.items[selectedHobby];
      setSelectedImage((prev) => (prev - 1 + hobby.images.length) % hobby.images.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hobbies.items.map((hobby, index) => (
          <motion.div
            key={hobby.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="relative">
                {/* Image Grid Preview */}
                <div className="grid grid-cols-2 gap-1 h-48 overflow-hidden">
                  {hobby.images.slice(0, 4).map((image, imageIndex) => (
                    <div key={imageIndex} className="relative overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <ImageWithFallback
                          src={image}
                          alt={`${hobby.name} ${imageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      {imageIndex === 3 && hobby.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium">
                            +{hobby.images.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* View Gallery Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={() => openGallery(index)}
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-medium">
                    View Gallery
                  </div>
                </motion.button>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                  {hobby.name}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {hobby.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedHobby !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeGallery}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Main Image */}
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={hobbies.items[selectedHobby].images[selectedImage]}
                  alt={`${hobbies.items[selectedHobby].name} ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Buttons */}
                {hobbies.items[selectedHobby].images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Image Counter */}
              <div className="text-center mt-4 text-white/70">
                {selectedImage + 1} of {hobbies.items[selectedHobby].images.length}
              </div>

              {/* Thumbnail Navigation */}
              {hobbies.items[selectedHobby].images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
                  {hobbies.items[selectedHobby].images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImage 
                          ? 'border-white scale-110' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}