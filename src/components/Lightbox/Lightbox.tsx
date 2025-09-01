import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Download, Shield } from 'lucide-react';

interface LightboxProps {
  images: Array<{ src: string; alt: string; title?: string }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  protectionEnabled?: boolean;
}

export function Lightbox({ 
  images, 
  initialIndex, 
  isOpen, 
  onClose, 
  protectionEnabled = true 
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const currentImage = images[currentIndex];

  if (!isOpen || !currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-lg w-full h-full max-h-screen p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Image */}
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain"
            style={{ 
              pointerEvents: protectionEnabled ? 'none' : 'auto',
              userSelect: protectionEnabled ? 'none' : 'auto'
            }}
            onContextMenu={protectionEnabled ? (e) => e.preventDefault() : undefined}
            onDragStart={protectionEnabled ? (e) => e.preventDefault() : undefined}
          />

          {/* Image Info */}
          {(currentImage.title || currentImage.alt) && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded">
              <div className="flex items-center justify-between">
                <div>
                  {currentImage.title && (
                    <h3 className="font-medium">{currentImage.title}</h3>
                  )}
                  <p className="text-sm text-gray-300">{currentImage.alt}</p>
                  {images.length > 1 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {currentIndex + 1} of {images.length}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {protectionEnabled && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Shield className="w-3 h-3" />
                      <span>Protected</span>
                    </div>
                  )}
                  {!protectionEnabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = currentImage.src;
                        link.download = currentImage.title || 'image';
                        link.click();
                      }}
                      className="text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}