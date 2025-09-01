import { BlogPost as BlogPostType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { FileText, Camera, Quote, ExternalLink, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPostProps {
  post: BlogPostType;
}

const BlogPost = ({ post }: BlogPostProps) => {
  const getPostIcon = (type: BlogPostType['type']) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'photo':
        return <Camera className="w-4 h-4" />;
      case 'quote':
        return <Quote className="w-4 h-4" />;
      case 'link':
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = (type: BlogPostType['type']) => {
    return `post-type-${type}`;
  };

  return (
    <Card className="blog-card overflow-hidden">
      {/* Post type indicator */}
      <div className="flex">
        <div className={`post-type-indicator ${getPostTypeColor(post.type)}`} />
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-${post.type}-post/10 text-${post.type}-post`}>
                {getPostIcon(post.type)}
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <span>by {post.author}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content based on post type */}
          {post.type === 'photo' && post.metadata?.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={post.metadata.imageUrl} 
                alt={post.title}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {post.type === 'quote' && (
            <blockquote className="border-l-4 border-quote-post pl-4 my-4 italic text-lg">
              "{post.content}"
              {post.metadata?.quoteAuthor && (
                <footer className="text-sm text-muted-foreground mt-2">
                  — {post.metadata.quoteAuthor}
                </footer>
              )}
            </blockquote>
          )}

          {post.type === 'link' && (
            <div className="mb-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-link-post/20">
                <p className="mb-2">{post.content}</p>
                {post.metadata?.linkUrl && (
                  <a 
                    href={post.metadata.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-link-post hover:underline font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit Link</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {(post.type === 'text' || (post.type !== 'quote' && post.type !== 'link')) && (
            <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="hover:bg-accent hover-lift">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover-lift">
                <Heart className="w-4 h-4 mr-1" />
                24
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover-lift">
                <MessageCircle className="w-4 h-4 mr-1" />
                12
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover-lift">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BlogPost;