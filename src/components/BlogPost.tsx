import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Eye, User, ChevronDown, ChevronUp, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogPost as BlogPostType } from '@/types/blog';
import { ReadMore } from '@/components/ReadMore/ReadMore';
import { PostViews } from '@/components/PostViews/PostViews';
import ReadingTime from '@/components/ReadingTime/ReadingTime';
import ReadingProgress from '@/components/ReadingProgress/ReadingProgress';

interface BlogPostProps {
  post: BlogPostType;
}

function BlogPost({ post }: BlogPostProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleLikeToggle = async () => {
    try {
      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setLiked(liked);
      setLikes(post.likes);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const renderPostType = () => {
    switch (post.type) {
      case 'photo':
        return (
          <div className="mb-4">
            <img 
              src={post.metadata?.image || '/placeholder.svg'} 
              alt={post.title}
              className="w-full rounded-lg object-cover max-h-96"
            />
          </div>
        );
      
      case 'quote':
        return (
          <blockquote className="border-l-4 border-primary pl-4 italic text-lg mb-4">
            "{post.content}"
            {post.metadata?.quoteAuthor && (
              <footer className="text-sm text-muted-foreground mt-2">
                — {post.metadata.quoteAuthor}
              </footer>
            )}
          </blockquote>
        );
      
      case 'link':
        return (
          <div className="mb-4">
            <a 
              href={post.metadata?.url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-sm text-muted-foreground">{post.metadata?.domain}</div>
              <div className="font-medium">{post.metadata?.linkTitle || post.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{post.metadata?.description}</div>
            </a>
          </div>
        );
      
      case 'video':
        return (
          <div className="mb-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video 
                className="w-full"
                controls
                poster={post.metadata?.thumbnail as string}
              >
                <source src={post.metadata?.videoUrl as string} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="mb-4">
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <div className="flex-1">
                <div className="text-sm font-medium">{post.title}</div>
                <div className="text-xs text-muted-foreground">Audio Post</div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
            <audio 
              className="w-full mt-2"
              controls
              muted={isMuted}
            >
              <source src={post.metadata?.audioUrl as string} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <ReadingProgress />
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ReadingTime content={post.content} />
              <Badge variant="secondary" className="text-xs">
                {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Link to={`/post/${post.id}`}>
            <h2 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">
              {post.title}
            </h2>
          </Link>

          {renderPostType()}

          <div className="prose prose-sm max-w-none">
            <ReadMore 
              content={post.content} 
              maxLength={300}
            />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeToggle}
                className={`hover-lift ${liked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                {likes}
              </Button>
              
              <Link to={`/post/${post.id}#comments`}>
                <Button variant="ghost" size="sm" className="hover-lift">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments?.length || 0}
                </Button>
              </Link>
              
              <PostViews postId={post.id} />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="hover-lift"
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
        </CardContent>
      </Card>
    </>
  );
}

export { BlogPost };
export default BlogPost;