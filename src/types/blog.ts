export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  type: 'text' | 'photo' | 'quote' | 'link' | 'video' | 'audio';
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  tags: Tag[];
  category: Category;
  status: 'draft' | 'published' | 'private';
  views: number;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  rights?: Rights;
  metadata?: PostMetadata;
  webmentions?: Webmention[];
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author';
  bio?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
    website?: string;
  };
  createdAt: string;
  isApproved: boolean;
  parentId?: string;
  replies?: Comment[];
}

export interface Rights {
  license: 'cc-by' | 'cc-by-sa' | 'cc-by-nc' | 'cc-by-nd' | 'all-rights-reserved' | 'public-domain';
  attribution: string;
  copyright: string;
}

export interface PostMetadata {
  imageUrl?: string;
  imageAlt?: string;
  linkUrl?: string;
  quoteAuthor?: string;
  videoUrl?: string;
  audioUrl?: string;
  embedCode?: string;
  codeLanguage?: string;
  hasMath?: boolean;
}

export interface Webmention {
  id: string;
  source: string;
  target: string;
  type: 'mention' | 'reply' | 'repost' | 'like';
  author: {
    name: string;
    url: string;
    photo?: string;
  };
  content?: string;
  publishedAt: string;
}

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  ttl: number;
}

export interface MathCaptcha {
  question: string;
  answer: number;
  sessionId: string;
}