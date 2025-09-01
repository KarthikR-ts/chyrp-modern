export interface BlogPost {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'photo' | 'quote' | 'link';
  author: string;
  publishedAt: string;
  tags: string[];
  category?: string;
  metadata?: {
    imageUrl?: string;
    linkUrl?: string;
    quoteAuthor?: string;
    videoUrl?: string;
    audioUrl?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author';
}