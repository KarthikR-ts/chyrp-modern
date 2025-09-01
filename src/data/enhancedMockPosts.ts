import { BlogPost } from "@/types/blog";

export const enhancedMockPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Modern Blogging: A Complete Guide",
    content: `# Introduction to Modern Blogging

In today's digital landscape, blogging has evolved far beyond simple text posts. Modern blogging platforms need to support rich media, multiple content types, and seamless user experiences. This evolution represents a significant shift in how we think about content creation and consumption.

## The Rise of Multi-Format Content

Traditional blogs were limited to text and basic images. Today's platforms support:

- **Rich Text** with advanced formatting
- **Interactive Media** including videos and audio
- **Code Snippets** with syntax highlighting
- **Mathematical Notation** using LaTeX
- **Social Embeds** from various platforms

## Building for the Future

When designing modern blogging platforms, we must consider:

1. **Performance** - Fast loading times are crucial
2. **Accessibility** - Content must be available to all users
3. **SEO** - Search engine optimization is essential
4. **Mobile First** - Most users access content via mobile devices

\`\`\`javascript
// Example: Modern blog post structure
const blogPost = {
  title: "My Modern Blog Post",
  content: "Rich formatted content...",
  type: "text",
  metadata: {
    tags: ["modern", "blogging", "web"],
    category: "Technology"
  }
};
\`\`\`

This comprehensive approach ensures that content creators have the tools they need while providing readers with an exceptional experience.`,
    excerpt: "In today's digital landscape, blogging has evolved far beyond simple text posts. Modern blogging platforms need to support rich media, multiple content types, and seamless user experiences.",
    type: "text",
    author: {
      id: "1",
      name: "Sarah Chen",
      email: "sarah@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face",
      role: "admin"
    },
    publishedAt: "2024-01-15T10:30:00Z",
    tags: [
      { id: "1", name: "blogging", slug: "blogging", count: 15 },
      { id: "2", name: "technology", slug: "technology", count: 28 },
      { id: "3", name: "web development", slug: "web-development", count: 22 }
    ],
    category: { id: "1", name: "Technology", slug: "technology", count: 45 },
    status: "published",
    views: 1234,
    likes: 67,
    isLiked: false,
    comments: [
      {
        id: "1",
        content: "Great article! Really helpful insights on modern blogging trends.",
        author: {
          name: "John Doe",
          email: "john@example.com",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        createdAt: "2024-01-15T14:30:00Z",
        isApproved: true
      }
    ],
    rights: {
      license: "cc-by",
      attribution: "Sarah Chen",
      copyright: "© 2024 Sarah Chen"
    },
    metadata: {
      hasMath: false,
      codeLanguage: "javascript"
    },
    webmentions: [
      {
        id: "1",
        source: "https://example.com/mention",
        target: "https://myblog.com/posts/1",
        type: "mention",
        author: {
          name: "Tech Blogger",
          url: "https://techblog.com",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        content: "Excellent article about modern blogging!",
        publishedAt: "2024-01-15T16:00:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "Mathematical Beauty in Nature",
    content: `The golden ratio appears throughout nature in fascinating ways. 

The mathematical constant φ (phi) ≈ 1.618033988749... can be expressed as:

$$\\phi = \\frac{1 + \\sqrt{5}}{2}$$

This ratio appears in:
- Fibonacci sequences: $F_n = \\frac{\\phi^n - \\psi^n}{\\sqrt{5}}$
- Spiral galaxies and nautilus shells
- Flower petal arrangements
- Tree branch patterns

The beauty of mathematics lies not just in its precision, but in how it describes the patterns we see in the natural world around us.`,
    excerpt: "Exploring the mathematical patterns found in nature, from the golden ratio to Fibonacci sequences.",
    type: "text",
    author: {
      id: "2",
      name: "Dr. Emily Foster",
      email: "emily@university.edu",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      role: "author"
    },
    publishedAt: "2024-01-14T09:15:00Z",
    tags: [
      { id: "4", name: "mathematics", slug: "mathematics", count: 8 },
      { id: "5", name: "nature", slug: "nature", count: 12 },
      { id: "6", name: "science", slug: "science", count: 18 }
    ],
    category: { id: "2", name: "Science", slug: "science", count: 23 },
    status: "published",
    views: 567,
    likes: 43,
    isLiked: true,
    comments: [],
    rights: {
      license: "cc-by-sa",
      attribution: "Dr. Emily Foster",
      copyright: "© 2024 University Research"
    },
    metadata: {
      hasMath: true
    },
    webmentions: []
  },
  {
    id: "3",
    title: "Sunset Over the Mountains",
    content: "Captured this breathtaking view during my hiking trip to the Rocky Mountains. The golden hour light created the most incredible atmosphere, painting the sky in brilliant oranges and purples.",
    excerpt: "A stunning photograph captured during golden hour in the Rocky Mountains.",
    type: "photo",
    author: {
      id: "3",
      name: "Michael Rodriguez",
      email: "michael@photo.com",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      role: "author"
    },
    publishedAt: "2024-01-14T18:45:00Z",
    tags: [
      { id: "7", name: "photography", slug: "photography", count: 34 },
      { id: "8", name: "nature", slug: "nature", count: 12 },
      { id: "9", name: "mountains", slug: "mountains", count: 7 }
    ],
    category: { id: "3", name: "Photography", slug: "photography", count: 56 },
    status: "published",
    views: 890,
    likes: 128,
    isLiked: false,
    comments: [
      {
        id: "2",
        content: "Absolutely stunning! What camera settings did you use?",
        author: {
          name: "Photo Enthusiast",
          email: "enthusiast@photo.com"
        },
        createdAt: "2024-01-14T20:00:00Z",
        isApproved: true
      }
    ],
    rights: {
      license: "all-rights-reserved",
      attribution: "Michael Rodriguez Photography",
      copyright: "© 2024 All Rights Reserved"
    },
    metadata: {
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
      imageAlt: "Golden sunset over mountain peaks with dramatic sky"
    },
    webmentions: [
      {
        id: "2",
        source: "https://photography.com/feature",
        target: "https://myblog.com/posts/3",
        type: "like",
        author: {
          name: "Photography Magazine",
          url: "https://photography.com",
          photo: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=150&h=150&fit=crop&crop=face"
        },
        publishedAt: "2024-01-14T19:30:00Z"
      }
    ]
  },
  {
    id: "4",
    title: "Wisdom on Creativity",
    content: "Creativity is not a talent. It is a way of operating.",
    excerpt: "A profound quote about the nature of creativity and its role in our daily lives.",
    type: "quote",
    author: {
      id: "4",
      name: "Emma Watson",
      email: "emma@inspiration.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      role: "editor"
    },
    publishedAt: "2024-01-14T14:20:00Z",
    tags: [
      { id: "10", name: "inspiration", slug: "inspiration", count: 19 },
      { id: "11", name: "creativity", slug: "creativity", count: 14 },
      { id: "12", name: "quotes", slug: "quotes", count: 25 }
    ],
    category: { id: "4", name: "Philosophy", slug: "philosophy", count: 18 },
    status: "published",
    views: 345,
    likes: 78,
    isLiked: true,
    comments: [],
    rights: {
      license: "public-domain",
      attribution: "John Cleese",
      copyright: "Public Domain"
    },
    metadata: {
      quoteAuthor: "John Cleese"
    },
    webmentions: []
  },
  {
    id: "5",
    title: "React Performance Deep Dive",
    content: `Just discovered this fantastic resource about optimizing React applications. The techniques mentioned here can significantly improve your app's performance and user experience.

Key points covered:
- Component memoization strategies
- Virtual DOM optimization techniques  
- Bundle splitting and code optimization
- Performance monitoring tools

This is essential reading for any React developer looking to build fast, efficient applications.`,
    excerpt: "A comprehensive guide to React performance optimization techniques and best practices.",
    type: "link",
    author: {
      id: "5", 
      name: "David Kim",
      email: "david@dev.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      role: "author"
    },
    publishedAt: "2024-01-13T09:15:00Z",
    tags: [
      { id: "13", name: "react", slug: "react", count: 31 },
      { id: "14", name: "performance", slug: "performance", count: 16 },
      { id: "15", name: "webdev", slug: "webdev", count: 41 }
    ],
    category: { id: "5", name: "Development", slug: "development", count: 67 },
    status: "published",
    views: 723,
    likes: 94,
    isLiked: false,
    comments: [
      {
        id: "3",
        content: "Thanks for sharing! The memoization section was particularly helpful.",
        author: {
          name: "React Developer",
          email: "dev@react.com"
        },
        createdAt: "2024-01-13T11:00:00Z",
        isApproved: true
      }
    ],
    rights: {
      license: "cc-by",
      attribution: "David Kim",
      copyright: "© 2024 David Kim"
    },
    metadata: {
      linkUrl: "https://react.dev/learn/render-and-commit"
    },
    webmentions: []
  }
];