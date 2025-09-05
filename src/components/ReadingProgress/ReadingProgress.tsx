import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ReadingProgressProps {
  className?: string;
}

export default function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className={cn("fixed top-4 right-4 z-50", className)}>
      <div className="relative w-12 h-12">
        <svg
          className="w-12 h-12 transform -rotate-90"
          viewBox="0 0 36 36"
        >
          <path
            className="stroke-muted-foreground/20"
            strokeWidth="3"
            fill="none"
            d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
          />
          <path
            className="stroke-primary"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${progress}, 100`}
            d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}