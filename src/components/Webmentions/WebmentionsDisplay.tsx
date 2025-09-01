import { Webmention } from '@/types/blog';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WebmentionsDisplayProps {
  webmentions: Webmention[];
  className?: string;
}

export function WebmentionsDisplay({ webmentions, className = '' }: WebmentionsDisplayProps) {
  if (!webmentions || webmentions.length === 0) {
    return null;
  }

  const getTypeIcon = (type: Webmention['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3 h-3" />;
      case 'reply':
        return <MessageCircle className="w-3 h-3" />;
      case 'repost':
        return <Repeat2 className="w-3 h-3" />;
      case 'mention':
      default:
        return <Share className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: Webmention['type']) => {
    switch (type) {
      case 'like':
        return 'bg-red-100 text-red-700';
      case 'reply':
        return 'bg-blue-100 text-blue-700';
      case 'repost':
        return 'bg-green-100 text-green-700';
      case 'mention':
      default:
        return 'bg-purple-100 text-purple-700';
    }
  };

  // Group webmentions by type
  const groupedMentions = webmentions.reduce((acc, mention) => {
    if (!acc[mention.type]) {
      acc[mention.type] = [];
    }
    acc[mention.type].push(mention);
    return acc;
  }, {} as Record<string, Webmention[]>);

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Share className="w-4 h-4 text-primary" />
        <h4 className="font-medium text-sm">Webmentions ({webmentions.length})</h4>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedMentions).map(([type, mentions]) => (
          <div key={type}>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className={`${getTypeColor(type as Webmention['type'])} border-0`}>
                {getTypeIcon(type as Webmention['type'])}
                <span className="ml-1 capitalize">{type}s ({mentions.length})</span>
              </Badge>
            </div>

            <div className="space-y-2">
              {mentions.slice(0, 5).map((mention) => (
                <div key={mention.id} className="flex items-start space-x-2 text-sm">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={mention.author.photo} />
                    <AvatarFallback className="text-xs">
                      {mention.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <a
                        href={mention.author.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {mention.author.name}
                      </a>
                      <span className="text-muted-foreground">
                        {type === 'like' ? 'liked this' : 
                         type === 'repost' ? 'reposted this' : 
                         type === 'reply' ? 'replied' : 'mentioned this'}
                      </span>
                    </div>
                    
                    {mention.content && type !== 'like' && type !== 'repost' && (
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                        {mention.content}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(mention.publishedAt), { addSuffix: true })}
                      </span>
                      <a
                        href={mention.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              
              {mentions.length > 5 && (
                <button className="text-xs text-primary hover:underline">
                  Show {mentions.length - 5} more {type}s
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}