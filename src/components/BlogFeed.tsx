import BlogPost from "./BlogPost";
import { enhancedMockPosts } from "@/data/enhancedMockPosts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calendar, Tag, Filter } from "lucide-react";
import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useCache } from "@/hooks/useCache";

const BlogFeed = () => {
  const [displayedPosts, setDisplayedPosts] = useState(enhancedMockPosts.slice(0, 3));
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
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
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Welcome to Modern Chyrp
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A lightweight, extensible blogging platform that adapts to your content. 
                Share your thoughts, photos, quotes, and discoveries in style.
              </p>
            </div>

            {/* Filter Bar */}
            {(selectedCategory || selectedTag) && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Filtered by:</span>
                    {selectedCategory && (
                      <Badge variant="secondary">
                        Category: {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="ml-1 text-xs hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedTag && (
                      <Badge variant="secondary">
                        Tag: {selectedTag}
                        <button
                          onClick={() => setSelectedTag(null)}
                          className="ml-1 text-xs hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedTag(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}

            {/* Posts */}
            {filteredPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Categories</h3>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category ? null : category
                    )}
                    className={`block w-full text-left text-sm transition-colors hover-lift p-2 rounded ${
                      selectedCategory === category 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Card>

            {/* Popular Tags */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Popular Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-accent hover-lift"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Cache Stats */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cache Hits</span>
                  <span className="text-sm font-medium">{cache.stats.hits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cache Size</span>
                  <span className="text-sm font-medium">{cache.stats.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Posts</span>
                  <span className="text-sm font-medium">{enhancedMockPosts.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogFeed;