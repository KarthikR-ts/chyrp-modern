import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play, Music } from 'lucide-react';

interface EasyEmbedProps {
  url: string;
  className?: string;
}

interface EmbedData {
  type: 'video' | 'audio' | 'social' | 'link';
  title?: string;
  description?: string;
  thumbnail?: string;
  embedHtml?: string;
  author?: string;
  site?: string;
}

export function EasyEmbed({ url, className = '' }: EasyEmbedProps) {
  const [embedData, setEmbedData] = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await extractEmbedData(url);
        setEmbedData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load embed');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      processUrl();
    }
  }, [url]);

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="bg-muted h-32 rounded mb-4" />
          <div className="bg-muted h-4 rounded w-3/4 mb-2" />
          <div className="bg-muted h-4 rounded w-1/2" />
        </div>
      </Card>
    );
  }

  if (error || !embedData) {
    return (
      <Card className={`p-4 border-destructive/50 ${className}`}>
        <div className="flex items-center space-x-2">
          <ExternalLink className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">
            {error || 'Could not load embed'}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm mt-2 inline-block"
        >
          Open Link
        </a>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {embedData.type === 'video' && embedData.embedHtml ? (
        <div 
          className="aspect-video"
          dangerouslySetInnerHTML={{ __html: embedData.embedHtml }}
        />
      ) : (
        <div className="p-4">
          {embedData.thumbnail && (
            <div className="relative mb-3">
              <img
                src={embedData.thumbnail}
                alt={embedData.title || 'Embed thumbnail'}
                className="w-full h-32 object-cover rounded"
              />
              {embedData.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                  <Play className="w-8 h-8 text-white" />
                </div>
              )}
              {embedData.type === 'audio' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                  <Music className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            {embedData.title && (
              <h3 className="font-medium text-sm line-clamp-2">
                {embedData.title}
              </h3>
            )}
            
            {embedData.description && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {embedData.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {embedData.author && <span>{embedData.author}</span>}
                {embedData.site && (
                  <span className="ml-2">• {embedData.site}</span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-auto p-1 hover-lift"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// Mock embed data extraction (in production, you'd use oEmbed or similar service)
async function extractEmbedData(url: string): Promise<EmbedData> {
  // YouTube
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    const videoId = extractYouTubeId(url);
    return {
      type: 'video',
      title: 'YouTube Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      embedHtml: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`,
      site: 'YouTube'
    };
  }
  
  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('/').pop();
    return {
      type: 'video',
      title: 'Vimeo Video',
      embedHtml: `<iframe src="https://player.vimeo.com/video/${videoId}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`,
      site: 'Vimeo'
    };
  }
  
  // Twitter/X
  if (url.includes('twitter.com/') || url.includes('x.com/')) {
    return {
      type: 'social',
      title: 'Twitter Post',
      site: 'Twitter'
    };
  }
  
  // Generic link
  return {
    type: 'link',
    title: 'External Link',
    description: url
  };
}

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
}