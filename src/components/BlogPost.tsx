import { BlogPost as BlogPostType } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { FileText, Camera, Quote, ExternalLink, Heart, MessageCircle, Share2, Eye, Image, Code } from "lucide-react";
import { useState } from "react";
import { useLikes } from "@/hooks/useLikes";
import { ReadMore } from "@/components/ReadMore/ReadMore";
import { RightsDisplay } from "@/components/Rights/RightsDisplay";
import { PostViews } from "@/components/PostViews/PostViews";
import { WebmentionsDisplay } from "@/components/Webmentions/WebmentionsDisplay";
import { CommentsSection } from "@/components/Comments/CommentsSection";
import { Lightbox } from "@/components/Lightbox/Lightbox";
import { CodeHighlighter } from "@/components/CodeHighlighter/CodeHighlighter";
import { MathRenderer } from "@/components/MathRenderer/MathRenderer";
import { EasyEmbed } from "@/components/EasyEmbed/EasyEmbed";

interface BlogPostProps {
  post: BlogPostType;
}

const BlogPost = ({ post }: BlogPostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  
  const { toggleLike, isLiking } = useLikes();

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
      case 'video':
        return <Camera className="w-4 h-4" />;
      case 'audio':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = (type: BlogPostType['type']) => {
    return `post-type-${type === 'video' || type === 'audio' ? 'text' : type}`;
  };

  const handleLike = async () => {
    if (isLiking(post.id)) return;
    
    const newLiked = await toggleLike(post.id, isLiked);
    setIsLiked(newLiked);
    setLocalLikes(prev => newLiked ? prev + 1 : prev - 1);
  };

  const handleAddComment = async (commentData: any) => {
    // In a real app, this would call the API
    console.log('Adding comment:', commentData);
    // Mock success response
    return Promise.resolve();
  };

  // Process content for math and code
  const processContent = (content: string) => {
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$|\$[^$]*?\$)/);
    
    return parts.map((part, index) => {
      // Code blocks
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="my-4">
            <CodeHighlighter code={code} language={language} />
          </div>
        );
      }
      
      // Display math
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return (
          <div key={index} className="my-4">
            <MathRenderer displayMode={true}>
              {part.slice(2, -2)}
            </MathRenderer>
          </div>
        );
      }
      
      // Inline math
      if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <MathRenderer key={index} displayMode={false}>
            {part.slice(1, -1)}
          </MathRenderer>
        );
      }
      
      // Regular text
      return <span key={index}>{part}</span>;
    });
  };

  const images = post.metadata?.imageUrl ? [{
    src: post.metadata.imageUrl,
    alt: post.metadata.imageAlt || post.title,
    title: post.title
  }] : [];

  return (
    <Card className="blog-card overflow-hidden">
      {/* Post type indicator */}
      <div className="flex">
        <div className={`post-type-indicator ${getPostTypeColor(post.type)}`} />
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>
                  {post.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg leading-tight hover:text-primary cursor-pointer transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <span>by {post.author.name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <PostViews postId={post.id} initialViews={post.views} />
                </div>
              </div>
            </div>
            <div className={`p-2 rounded-lg bg-${post.type === 'video' || post.type === 'audio' ? 'text' : post.type}-post/10 text-${post.type === 'video' || post.type === 'audio' ? 'text' : post.type}-post`}>
              {getPostIcon(post.type)}
            </div>
          </div>

          {/* Content based on post type */}
          {post.type === 'photo' && post.metadata?.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <img 
                src={post.metadata.imageUrl} 
                alt={post.metadata.imageAlt || post.title}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                <Button variant="ghost" size="sm" className="text-white">
                  <Image className="w-4 h-4 mr-2" />
                  View Full Size
                </Button>
              </div>
            </div>
          )}

          {post.type === 'quote' && (
            <blockquote className="border-l-4 border-quote-post pl-6 my-6 italic text-xl leading-relaxed">
              "{post.content}"
              {post.metadata?.quoteAuthor && (
                <footer className="text-base text-muted-foreground mt-3 not-italic">
                  — {post.metadata.quoteAuthor}
                </footer>
              )}
            </blockquote>
          )}

          {post.type === 'link' && (
            <div className="mb-4">
              <ReadMore content={post.content} className="mb-4" />
              {post.metadata?.linkUrl && (
                <EasyEmbed url={post.metadata.linkUrl} />
              )}
            </div>
          )}

          {(post.type === 'text' || post.type === 'video' || post.type === 'audio') && (
            <div className="mb-4">
              <ReadMore 
                content={post.metadata?.hasMath || post.content.includes('```') 
                  ? post.content 
                  : post.content
                } 
                maxLength={400}
                className="prose prose-sm max-w-none"
              />
              {(post.metadata?.hasMath || post.content.includes('```')) && (
                <div className="mt-4">
                  {processContent(post.content)}
                </div>
              )}
            </div>
          )}

          {/* Category */}
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="outline" className="hover:bg-accent cursor-pointer hover-lift">
              {post.category.name}
            </Badge>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="hover:bg-accent hover-lift cursor-pointer">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Rights */}
          {post.rights && (
            <RightsDisplay rights={post.rights} />
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t mt-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                disabled={isLiking(post.id)}
                className={`transition-colors hover-lift ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {localLikes}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowComments(!showComments)}
                className="text-muted-foreground hover:text-foreground hover-lift"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {post.comments.length}
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground hover-lift"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Webmentions */}
      {post.webmentions && post.webmentions.length > 0 && (
        <div className="px-6 pb-4">
          <WebmentionsDisplay webmentions={post.webmentions} />
        </div>
      )}

      {/* Comments */}
      {showComments && (
        <div className="px-6 pb-6">
          <CommentsSection
            postId={post.id}
            comments={post.comments}
            onAddComment={handleAddComment}
          />
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={images}
        initialIndex={0}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        protectionEnabled={post.rights?.license === 'all-rights-reserved'}
      />
    </Card>
  );
};

export default BlogPost;