import { useState, useMemo } from 'react';
import BlogPost from '@/components/BlogPost';
import BlogHeader from '@/components/BlogHeader';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ThemeCustomizer } from '@/components/ThemeCustomizer/ThemeCustomizer';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useBlog } from '@/hooks/useBlog';
import { usePostActions } from '@/hooks/usePostActions';
import { useAuth } from '@/hooks/useAuth';
import { BlogPost as BlogPostType } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn, User, LogOut } from 'lucide-react';

function BlogFeed() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  
  const { user, signOut, loading: authLoading } = useAuth();
  const { posts, categories, tags, loading, error } = useBlog(selectedCategory, selectedTag, searchTerm);
  const { toggleLike, isLiking, incrementViews } = usePostActions();

  const filteredPosts = useMemo(() => {
    return posts;
  }, [posts]);

  const { isFetching, setSentinel } = useInfiniteScroll(
    async () => {
      // Future implementation for pagination
    },
    false // No more items for now
  );

  const handleLikeToggle = async (postId: string, currentLiked: boolean) => {
    try {
      const result = await toggleLike(postId);
      return result ? (result as any).liked : !currentLiked;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return currentLiked;
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <BlogHeader />
        
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            {!authLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user.email}
                    </span>
                    <Link to="/editor">
                      <Button variant="outline" size="sm">
                        New Post
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-1" />
                      Login
                    </Button>
                  </Link>
                )}
              </>
            )}
            <ThemeCustomizer 
              isOpen={isThemeCustomizerOpen}
              onClose={() => setIsThemeCustomizerOpen(false)}
            />
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="w-80 shrink-0">
            <Sidebar
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              onCategorySelect={setSelectedCategory}
              onTagSelect={setSelectedTag}
              categories={categories.map(c => c.name)}
              tags={tags.map(t => t.name)}
            />
          </aside>

          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading posts...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Error loading posts: {error}
              </div>
            ) : filteredPosts.length > 0 ? (
              <>
                {filteredPosts.map((post) => (
                  <BlogPost
                    key={post.id}
                    post={post}
                  />
                ))}
                
                {isFetching && (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading more posts...
                  </div>
                )}
                <div ref={setSentinel} />
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? `No posts found matching "${searchTerm}"` : 'No posts available'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogFeed;