import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function usePostActions() {
  const { user } = useAuth();
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  const incrementViews = useCallback(async (postId: string) => {
    try {
      const { data } = await supabase.rpc('increment_post_views', {
        post_uuid: postId
      });
      return data;
    } catch (error) {
      console.error('Failed to increment views:', error);
      return null;
    }
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    if (!user) {
      throw new Error('Must be logged in to like posts');
    }

    if (loadingActions[postId]) return null;

    setLoadingActions(prev => ({ ...prev, [postId]: true }));
    
    try {
      const { data } = await supabase.rpc('toggle_post_like', {
        post_uuid: postId,
        user_uuid: user.id
      });
      
      return data;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    } finally {
      setLoadingActions(prev => ({ ...prev, [postId]: false }));
    }
  }, [user, loadingActions]);

  const addComment = useCallback(async (postId: string, comment: {
    author_name: string;
    author_email: string;
    author_website?: string;
    content: string;
    parent_id?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          ...comment
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }, []);

  const isLiking = useCallback((postId: string) => {
    return loadingActions[postId] || false;
  }, [loadingActions]);

  return {
    incrementViews,
    toggleLike,
    addComment,
    isLiking
  };
}