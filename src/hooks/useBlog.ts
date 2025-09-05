import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, Category, Tag } from '@/types/blog';

interface BlogData {
  posts: BlogPost[];
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

export function useBlog(categoryFilter?: string, tagFilter?: string, searchQuery?: string) {
  const [data, setData] = useState<BlogData>({
    posts: [],
    categories: [],
    tags: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchBlogData();
  }, [categoryFilter, tagFilter, searchQuery]);

  const fetchBlogData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch categories and tags in parallel
      const [categoriesResult, tagsResult] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('tags').select('*').order('name')
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (tagsResult.error) throw tagsResult.error;

      // Build posts query
      let postsQuery = supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            user_id,
            display_name,
            avatar_url,
            bio,
            role
          ),
          categories (
            id,
            name,
            slug,
            description
          ),
          post_tags (
            tags (
              id,
              name,
              slug
            )
          ),
          comments (
            id,
            content,
            author_name,
            author_email,
            author_website,
            created_at,
            is_approved,
            parent_id
          ),
          webmentions (
            id,
            source_url,
            target_url,
            type,
            author_name,
            author_url,
            author_photo,
            content,
            published_at
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      // Apply category filter
      if (categoryFilter) {
        postsQuery = postsQuery.eq('categories.slug', categoryFilter);
      }

      // Apply search filter
      if (searchQuery) {
        postsQuery = postsQuery.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      const postsResult = await postsQuery;
      if (postsResult.error) throw postsResult.error;

      // Transform and filter posts
      let transformedPosts: BlogPost[] = postsResult.data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || post.content.substring(0, 200) + '...',
        type: post.type as 'text' | 'photo' | 'quote' | 'link' | 'video' | 'audio',
        author: {
          id: post.profiles?.user_id || '',
          name: post.profiles?.display_name || 'Unknown Author',
          email: '',
          avatar: post.profiles?.avatar_url,
          role: (post.profiles?.role || 'author') as 'admin' | 'editor' | 'author',
          bio: post.profiles?.bio
        },
        publishedAt: post.published_at || post.created_at,
        updatedAt: post.updated_at,
        tags: post.post_tags?.map((pt: any) => ({
          id: pt.tags.id,
          name: pt.tags.name,
          slug: pt.tags.slug,
          count: 0
        })) || [],
        category: post.categories ? {
          id: post.categories.id,
          name: post.categories.name,
          slug: post.categories.slug,
          description: post.categories.description,
          count: 0
        } : {
          id: '',
          name: 'Uncategorized',
          slug: 'uncategorized',
          count: 0
        },
        status: post.status as 'draft' | 'published' | 'private',
        views: post.views || 0,
        likes: post.likes || 0,
        comments: post.comments?.filter((c: any) => c.is_approved).map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          author: {
            name: comment.author_name,
            email: comment.author_email,
            website: comment.author_website
          },
          createdAt: comment.created_at,
          isApproved: comment.is_approved,
          parentId: comment.parent_id
        })) || [],
        metadata: (post.metadata && typeof post.metadata === 'object' ? post.metadata : {}) as any,
        webmentions: post.webmentions?.map((wm: any) => ({
          id: wm.id,
          source: wm.source_url,
          target: wm.target_url,
          type: wm.type,
          author: {
            name: wm.author_name || '',
            url: wm.author_url || '',
            photo: wm.author_photo
          },
          content: wm.content,
          publishedAt: wm.published_at
        })) || []
      }));

      // Apply tag filter (client-side since it's a many-to-many relationship)
      if (tagFilter) {
        transformedPosts = transformedPosts.filter(post => 
          post.tags.some(tag => tag.slug === tagFilter)
        );
      }

      // Transform categories and tags with counts
      const transformedCategories: Category[] = categoriesResult.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        count: transformedPosts.filter(post => post.category.slug === cat.slug).length
      }));

      const transformedTags: Tag[] = tagsResult.data.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        count: transformedPosts.filter(post => 
          post.tags.some(postTag => postTag.slug === tag.slug)
        ).length
      }));

      setData({
        posts: transformedPosts,
        categories: transformedCategories,
        tags: transformedTags,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching blog data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };

  const refetch = () => {
    fetchBlogData();
  };

  return {
    ...data,
    refetch
  };
}