import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import BlockEditor from '@/components/BlockEditor/BlockEditor';

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  
  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published' | 'private',
    type: 'text' as 'text' | 'photo' | 'quote' | 'link' | 'video' | 'audio',
    selectedTags: [] as string[]
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchCategoriesAndTags();
    
    if (id) {
      fetchPost();
    }
  }, [id, user, navigate]);

  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesResult, tagsResult] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('tags').select('*').order('name')
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (tagsResult.error) throw tagsResult.error;

      setCategories(categoriesResult.data || []);
      setTags(tagsResult.data || []);
    } catch (error) {
      console.error('Error fetching categories and tags:', error);
      toast.error('Failed to load categories and tags');
    }
  };

  const fetchPost = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_tags (
            tags (id, name)
          )
        `)
        .eq('id', id)
        .eq('author_id', user?.id)
        .single();

      if (error) throw error;

      setPost({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        category_id: data.category_id,
        status: data.status as 'draft' | 'published' | 'private',
        type: data.type as 'text' | 'photo' | 'quote' | 'link' | 'video' | 'audio',
        selectedTags: data.post_tags?.map((pt: any) => pt.tags.id) || []
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/');
    }
  };

  const handleSave = async () => {
    if (!user || !post.title.trim() || !post.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || post.content.substring(0, 200) + '...',
        category_id: post.category_id,
        status: post.status,
        type: post.type,
        author_id: user.id
      };

      let postId = id;

      if (id) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        postId = data.id;
      }

      // Update tags
      if (postId) {
        // Remove existing tags
        await supabase
          .from('post_tags')
          .delete()
          .eq('post_id', postId);

        // Add selected tags
        if (post.selectedTags.length > 0) {
          const tagInserts = post.selectedTags.map(tagId => ({
            post_id: postId,
            tag_id: tagId
          }));

          await supabase
            .from('post_tags')
            .insert(tagInserts);
        }
      }

      toast.success(id ? 'Post updated!' : 'Post created!');
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate('/')} variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
          
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Post'}
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{id ? 'Edit Post' : 'Create New Post'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  placeholder="Enter post title..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={post.type} onValueChange={(value: any) => setPost({ ...post, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="photo">Photo</SelectItem>
                      <SelectItem value="quote">Quote</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={post.category_id} onValueChange={(value) => setPost({ ...post, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={post.status} onValueChange={(value: any) => setPost({ ...post, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt (optional)</Label>
                <Input
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  placeholder="Optional excerpt..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <BlockEditor
                documentId={id || `new-post-${Date.now()}`}
                initialContent={post.content}
                onChange={(content) => setPost({ ...post, content })}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}