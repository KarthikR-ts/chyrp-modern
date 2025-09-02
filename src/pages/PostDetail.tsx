import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { enhancedMockPosts } from "@/data/enhancedMockPosts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  ArrowRight,
  Edit, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  Calendar,
  User,
  Tag as TagIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLikes } from "@/hooks/useLikes";
import { PostViews } from "@/components/PostViews/PostViews";
import { CommentsSection } from "@/components/Comments/CommentsSection";
import { RightsDisplay } from "@/components/Rights/RightsDisplay";
import { WebmentionsDisplay } from "@/components/Webmentions/WebmentionsDisplay";
import { Lightbox } from "@/components/Lightbox/Lightbox";
import { CodeHighlighter } from "@/components/CodeHighlighter/CodeHighlighter";
import { MathRenderer } from "@/components/MathRenderer/MathRenderer";
import { EasyEmbed } from "@/components/EasyEmbed/EasyEmbed";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = enhancedMockPosts.find(p => p.id === id);
  
  const [localLikes, setLocalLikes] = useState(post?.likes || 0);
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const { toggleLike, isLiking } = useLikes();

  // Find current post index and navigation posts
  const currentIndex = useMemo(() => 
    enhancedMockPosts.findIndex(p => p.id === id), [id]
  );
  
  const previousPost = currentIndex > 0 ? enhancedMockPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < enhancedMockPosts.length - 1 ? enhancedMockPosts[currentIndex + 1] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")} className="bg-gradient-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleLike = async () => {
    if (isLiking(post.id)) return;
    
    const newLiked = await toggleLike(post.id, isLiked);
    setIsLiked(newLiked);
    setLocalLikes(prev => newLiked ? prev + 1 : prev - 1);
  };

  const handleAddComment = async (commentData: any) => {
    console.log('Adding comment:', commentData);
    return Promise.resolve();
  };

  const navigateToPrevious = () => {
    if (previousPost) {
      navigate(`/post/${previousPost.id}`);
    }
  };

  const navigateToNext = () => {
    if (nextPost) {
      navigate(`/post/${nextPost.id}`);
    }
  };

  // Process content for math, code, hashtags, and markdown
  const processContent = (content: string) => {
    let processedContent = content.replace(/#(\w+)/g, '<span class="hashtag text-primary font-medium cursor-pointer hover:underline">#$1</span>');
    
    const parts = processedContent.split(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$|\$[^$]*?\$|<span class="hashtag[^>]*>.*?<\/span>)/);
    
    return parts.map((part, index) => {
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
      
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return (
          <div key={index} className="my-4">
            <MathRenderer displayMode={true}>
              {part.slice(2, -2)}
            </MathRenderer>
          </div>
        );
      }
      
      if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <MathRenderer key={index} displayMode={false}>
            {part.slice(1, -1)}
          </MathRenderer>
        );
      }
      
      if (part.includes('hashtag')) {
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      }
      
      const withBold = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const withItalic = withBold.replace(/\*(.*?)\*/g, '<em>$1</em>');
      const withLinks = withItalic.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      if (withLinks !== part) {
        return <span key={index} dangerouslySetInnerHTML={{ __html: withLinks }} />;
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  const images = post.metadata?.imageUrl ? [{
    src: post.metadata.imageUrl,
    alt: post.metadata.imageAlt || post.title,
    title: post.title
  }] : [];

  const isCurrentUser = post.author.name === "John Doe"; // Mock user check

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={navigateToPrevious}
              disabled={!previousPost}
              className={`hover-lift ${!previousPost ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-primary text-primary-foreground hover:opacity-90'}`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={navigateToNext}
              disabled={!nextPost}
              className={`hover-lift ${!nextPost ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-primary text-primary-foreground hover:opacity-90'}`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Post */}
        <Card className="blog-card overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
              
              <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>by {post.author.name}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                </div>
                <span>•</span>
                <PostViews postId={post.id} initialViews={post.views} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{post.category.name}</Badge>
                  <Badge variant="secondary" className={`bg-${post.type === 'video' || post.type === 'audio' ? 'text' : post.type}-post/10 text-${post.type === 'video' || post.type === 'audio' ? 'text' : post.type}-post`}>
                    {post.type}
                  </Badge>
                </div>
                
                {isCurrentUser && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-6">
              {/* Photo Posts */}
              {post.type === 'photo' && post.metadata?.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden cursor-pointer" onClick={() => setLightboxOpen(true)}>
                  <img 
                    src={post.metadata.imageUrl} 
                    alt={post.metadata.imageAlt || post.title}
                    className="w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Quote Posts */}
              {post.type === 'quote' && (
                <blockquote className="border-l-4 border-quote-post pl-6 my-6 italic text-2xl leading-relaxed">
                  "{post.content}"
                  {post.metadata?.quoteAuthor && (
                    <footer className="text-lg text-muted-foreground mt-3 not-italic">
                      — {post.metadata.quoteAuthor}
                    </footer>
                  )}
                </blockquote>
              )}

              {/* Link Posts */}
              {post.type === 'link' && (
                <div className="mb-6">
                  <div className="mb-4">{processContent(post.content)}</div>
                  {post.metadata?.linkUrl && (
                    <EasyEmbed url={post.metadata.linkUrl} />
                  )}
                </div>
              )}

              {/* Text/Video/Audio Posts */}
              {(post.type === 'text' || post.type === 'video' || post.type === 'audio') && (
                <div className="mb-6">
                  {processContent(post.content)}
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <TagIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="hover:bg-accent cursor-pointer">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Rights */}
            {post.rights && (
              <div className="mb-6">
                <RightsDisplay rights={post.rights} />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
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

          {/* Webmentions */}
          {post.webmentions && post.webmentions.length > 0 && (
            <div className="px-8 pb-6">
              <WebmentionsDisplay webmentions={post.webmentions} />
            </div>
          )}

          {/* Comments */}
          <div className="px-8 pb-8">
            <CommentsSection
              postId={post.id}
              comments={post.comments}
              onAddComment={handleAddComment}
            />
          </div>
        </Card>

        {/* Post Navigation Footer */}
        <div className="flex items-center justify-between mt-8">
          {previousPost ? (
            <div className="flex-1 mr-4">
              <Button
                variant="outline"
                onClick={navigateToPrevious}
                className="w-full justify-start p-4 h-auto bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <div className="text-left">
                  <div className="flex items-center text-sm opacity-80 mb-1">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous Post
                  </div>
                  <div className="font-medium truncate">{previousPost.title}</div>
                </div>
              </Button>
            </div>
          ) : (
            <div className="flex-1 mr-4"></div>
          )}
          
          {nextPost ? (
            <div className="flex-1 ml-4">
              <Button
                variant="outline"
                onClick={navigateToNext}
                className="w-full justify-end p-4 h-auto bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <div className="text-right">
                  <div className="flex items-center justify-end text-sm opacity-80 mb-1">
                    Next Post
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                  <div className="font-medium truncate">{nextPost.title}</div>
                </div>
              </Button>
            </div>
          ) : (
            <div className="flex-1 ml-4"></div>
          )}
        </div>

        {/* Lightbox */}
        <Lightbox
          images={images}
          initialIndex={0}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          protectionEnabled={post.rights?.license === 'all-rights-reserved'}
        />
      </div>
    </div>
  );
}