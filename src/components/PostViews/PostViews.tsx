import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { apiCall } from '@/hooks/useApi';

interface PostViewsProps {
  postId: string;
  initialViews?: number;
  className?: string;
}

export function PostViews({ postId, initialViews = 0, className = '' }: PostViewsProps) {
  const [views, setViews] = useState(initialViews);
  const [hasRecorded, setHasRecorded] = useState(false);

  useEffect(() => {
    // Record view after a delay to ensure it's a genuine view
    const timer = setTimeout(async () => {
      if (!hasRecorded) {
        try {
          const response = await apiCall<{ views: number }>(`/posts/${postId}/view`, {
            method: 'POST'
          });
          setViews(response.views);
          setHasRecorded(true);
        } catch (error) {
          // Fallback: increment client-side
          setViews(prev => prev + 1);
          setHasRecorded(true);
        }
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [postId, hasRecorded]);

  const formatViews = (count: number) => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
    return (count / 1000000).toFixed(1) + 'M';
  };

  return (
    <div className={`flex items-center space-x-1 text-muted-foreground ${className}`}>
      <Eye className="w-4 h-4" />
      <span className="text-sm">{formatViews(views)}</span>
    </div>
  );
}