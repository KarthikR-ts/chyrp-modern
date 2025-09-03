import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BlogPost } from '@/components/BlogPost';
import { CommentsSection } from '@/components/Comments/CommentsSection';
import { WebmentionsDisplay } from '@/components/Webmentions/WebmentionsDisplay';
import { RightsDisplay } from '@/components/Rights/RightsDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/types/blog';
import { useBlog } from '@/hooks/useBlog';
import { usePostActions } from '@/hooks/usePostActions';
import { supabase } from '@/integrations/supabase/client';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [nextPost, setNextPost] = useState<BlogPostType | null>(null);
  const [prevPost, setPrevPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const { posts } = useBlog();
  const { toggleLike, isLiking, incrementViews, addComment } = usePostActions();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch the specific post with all related data
        const { data: postData, error } = await supabase
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
          .eq('id', id)
          .eq('status', 'published')
          .single();

        if (error) throw error;

        if (postData) {
          // Transform the post data
          const transformedPost: BlogPostType = {
            id: postData.id,
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt || postData.content.substring(0, 200) + '...',
            type: postData.type as 'text' | 'photo' | 'quote' | 'link' | 'video' | 'audio',
            author: {
              id: postData.profiles?.user_id || '',
              name: postData.profiles?.display_name || 'Unknown Author',
              email: '',
              avatar: postData.profiles?.avatar_url,
              role: (postData.profiles?.role as 'admin' | 'editor' | 'author') || 'author',
              bio: postData.profiles?.bio
            },
            publishedAt: postData.published_at || postData.created_at,
            updatedAt: postData.updated_at,
            tags: postData.post_tags?.map((pt: any) => ({
              id: pt.tags.id,
              name: pt.tags.name,
              slug: pt.tags.slug,
              count: 0
            })) || [],
            category: postData.categories ? {
              id: postData.categories.id,
              name: postData.categories.name,
              slug: postData.categories.slug,
              description: postData.categories.description,
              count: 0
            } : {
              id: '',
              name: 'Uncategorized',
              slug: 'uncategorized',
              count: 0
            },
            status: postData.status as 'draft' | 'published' | 'private',
            views: postData.views || 0,
            likes: postData.likes || 0,
            comments: postData.comments?.filter((c: any) => c.is_approved).map((comment: any) => ({
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
            metadata: postData.metadata || {},
            webmentions: postData.webmentions?.map((wm: any) => ({
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
          };

          setPost(transformedPost);

          // Increment view count
          incrementViews(id);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, incrementViews]);

  // Set next/prev posts when posts are loaded
  useEffect(() => {
    if (posts.length > 0 && id) {
      const currentIndex = posts.findIndex(p => p.id === id);
      const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
      const nextPostItem = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
      
      setPrevPost(previousPost);
      setNextPost(nextPostItem);
    }
  }, [posts, id]);

  const handleLikeToggle = async (postId: string, currentLiked: boolean) => {
    try {
      const result = await toggleLike(postId);
      return result?.liked ?? !currentLiked;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return currentLiked;
    }
  };

  const handleAddComment = async (commentData: {
    content: string;
    author: { name: string; email: string; website?: string };
    parentId?: string;
  }) => {
    if (!post) return;

    try {
      await addComment(post.id, {
        author_name: commentData.author.name,
        author_email: commentData.author.email,
        author_website: commentData.author.website,
        content: commentData.content,
        parent_id: commentData.parentId
      });

      // Refresh the post to get updated comments
      window.location.reload();
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate('/')} variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => prevPost && navigate(`/post/${prevPost.id}`)}
              disabled={!prevPost}
              className={!prevPost ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => nextPost && navigate(`/post/${nextPost.id}`)}
              disabled={!nextPost}
              className={!nextPost ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <BlogPost
            post={post}
            onLikeToggle={handleLikeToggle}
            isLiking={isLiking(post.id)}
          />

          {post.rights && (
            <RightsDisplay rights={post.rights} />
          )}

          {post.webmentions && post.webmentions.length > 0 && (
            <WebmentionsDisplay webmentions={post.webmentions} />
          )}

          <CommentsSection
            postId={post.id}
            comments={post.comments}
            onAddComment={handleAddComment}
          />
        </div>
      </div>
    </div>
  );
}