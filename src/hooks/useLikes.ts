import { useState, useCallback } from 'react';
import { apiCall } from './useApi';

export function useLikes() {
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  const toggleLike = useCallback(async (postId: string, currentLiked: boolean) => {
    if (likingPosts.has(postId)) return;

    setLikingPosts(prev => new Set([...prev, postId]));
    
    try {
      if (currentLiked) {
        await apiCall(`/posts/${postId}/unlike`, { method: 'DELETE' });
      } else {
        await apiCall(`/posts/${postId}/like`, { method: 'POST' });
      }
      
      return !currentLiked;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return currentLiked;
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  }, [likingPosts]);

  return {
    toggleLike,
    isLiking: (postId: string) => likingPosts.has(postId)
  };
}