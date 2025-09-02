import BlogPost from "./BlogPost";
import { enhancedMockPosts } from "@/data/enhancedMockPosts";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { ThemeCustomizer } from "@/components/ThemeCustomizer/ThemeCustomizer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useCache } from "@/hooks/useCache";

const BlogFeed = () => {
  const [displayedPosts, setDisplayedPosts] = useState(enhancedMockPosts.slice(0, 3));
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);
  
  const cache = useCache();
  
  const categories = Array.from(new Set(enhancedMockPosts.map(post => post.category.name)));
  const allTags = Array.from(new Set(enhancedMockPosts.flatMap(post => post.tags.map(tag => tag.name))));
  const popularTags = allTags.slice(0, 8);

  const fetchMorePosts = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentLength = displayedPosts.length;
    const nextPosts = enhancedMockPosts.slice(currentLength, currentLength + 2);
    
    if (nextPosts.length === 0) {
      setHasMore(false);
      return;
    }
    
    setDisplayedPosts(prev => [...prev, ...nextPosts]);
  };

  const { isFetching, setSentinel } = useInfiniteScroll(fetchMorePosts, hasMore);

  const getFilteredPosts = () => {
    let filtered = displayedPosts;
    
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category.name === selectedCategory);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(post => 
        post.tags.some(tag => tag.name === selectedTag)
      );
    }
    
    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 min-h-screen bg-background border-r border-border p-6 fixed left-0 top-0 overflow-y-auto">
          <Sidebar
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            onCategorySelect={setSelectedCategory}
            onTagSelect={setSelectedTag}
            categories={categories}
            tags={popularTags}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <Button
                  variant="outline"
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  Next post
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setThemeCustomizerOpen(true)}
                className="hover-lift"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-w-4xl">
            {/* Posts */}
            {filteredPosts.map((post) => (
              <div key={post.id} className="mb-8">
                <BlogPost post={post} />
              </div>
            ))}

            {/* Loading Indicator */}
            {isFetching && (
              <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex space-x-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Infinite Scroll Sentinel */}
            {hasMore && !isFetching && (
              <div ref={setSentinel} className="h-10" />
            )}

            {!hasMore && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  You've reached the end! 🎉
                </p>
              </Card>
            )}

            {/* Navigation Footer */}
            <div className="mt-12 pt-8 border-t text-center">
              <Button variant="outline" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                Previous post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Customizer */}
      <ThemeCustomizer
        isOpen={themeCustomizerOpen}
        onClose={() => setThemeCustomizerOpen(false)}
      />
    </div>
  );
};

export default BlogFeed;