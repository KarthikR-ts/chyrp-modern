import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ReadingTimeProps {
  content: string;
  className?: string;
}

function calculateReadingTime(content: string): number {
  // Average reading speed is 200-250 words per minute
  const wordsPerMinute = 225;
  
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Count words (split by whitespace and filter empty strings)
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  
  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

export default function ReadingTime({ content, className }: ReadingTimeProps) {
  const readingTime = calculateReadingTime(content);

  return (
    <Badge variant="secondary" className={className}>
      <Clock className="w-3 h-3 mr-1" />
      {readingTime} min read
    </Badge>
  );
}