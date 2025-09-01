import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReadMoreProps {
  content: string;
  maxLength?: number;
  showLines?: number;
  className?: string;
}

export function ReadMore({ 
  content, 
  maxLength = 300, 
  showLines = 3, 
  className = '' 
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate if content needs truncation
  const needsTruncation = content.length > maxLength;
  
  // Get truncated content
  const getTruncatedContent = () => {
    if (!needsTruncation) return content;
    
    const lines = content.split('\n');
    if (lines.length > showLines) {
      return lines.slice(0, showLines).join('\n');
    }
    
    return content.substring(0, maxLength) + '...';
  };

  const displayContent = isExpanded ? content : getTruncatedContent();

  if (!needsTruncation) {
    return (
      <div className={`prose prose-sm max-w-none ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={`prose prose-sm max-w-none ${!isExpanded ? 'line-clamp-3' : ''}`}>
        {displayContent}
      </div>
      
      {needsTruncation && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-primary hover:text-primary/80 p-0 h-auto font-medium hover-lift"
        >
          {isExpanded ? (
            <>
              Show Less
              <ChevronUp className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              Read More
              <ChevronDown className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}