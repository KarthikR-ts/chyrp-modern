import BlogPost from "./BlogPost";
import { mockPosts } from "@/data/mockPosts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Tag } from "lucide-react";

const BlogFeed = () => {
  const categories = Array.from(new Set(mockPosts.map(post => post.category).filter(Boolean)));
  const popularTags = ["blogging", "technology", "photography", "react", "design"];

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

            {/* Posts */}
            {mockPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
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
                  <a
                    key={category}
                    href="#"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors hover-lift"
                  >
                    {category}
                  </a>
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
                    variant="secondary" 
                    className="hover:bg-accent cursor-pointer hover-lift"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Blog Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Posts</span>
                  <span className="text-sm font-medium">{mockPosts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <span className="text-sm font-medium">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tags</span>
                  <span className="text-sm font-medium">{popularTags.length}</span>
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