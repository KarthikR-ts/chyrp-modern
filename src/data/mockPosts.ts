import { BlogPost } from "@/types";

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Modern Blogging",
    content: "In today's digital landscape, blogging has evolved far beyond simple text posts. Modern blogging platforms need to support rich media, multiple content types, and seamless user experiences. This evolution represents a significant shift in how we think about content creation and consumption.",
    type: "text",
    author: "Sarah Chen",
    publishedAt: "2024-01-15T10:30:00Z",
    tags: ["blogging", "technology", "content"],
    category: "Technology"
  },
  {
    id: "2", 
    title: "Sunset Over the Mountains",
    content: "Captured this breathtaking view during my hiking trip to the Rocky Mountains. The golden hour light created the most incredible atmosphere.",
    type: "photo",
    author: "Michael Rodriguez",
    publishedAt: "2024-01-14T18:45:00Z",
    tags: ["photography", "nature", "mountains"],
    category: "Photography",
    metadata: {
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
    }
  },
  {
    id: "3",
    title: "On Creativity",
    content: "Creativity is not a talent. It is a way of operating.",
    type: "quote",
    author: "Emma Watson",
    publishedAt: "2024-01-14T14:20:00Z",
    tags: ["inspiration", "creativity", "quotes"],
    category: "Philosophy",
    metadata: {
      quoteAuthor: "John Cleese"
    }
  },
  {
    id: "4",
    title: "Amazing React Performance Tips",
    content: "Just discovered this fantastic article about optimizing React applications. The techniques mentioned here can significantly improve your app's performance and user experience.",
    type: "link",
    author: "David Kim",
    publishedAt: "2024-01-13T09:15:00Z",
    tags: ["react", "performance", "webdev"],
    category: "Development",
    metadata: {
      linkUrl: "https://react.dev/learn/render-and-commit"
    }
  },
  {
    id: "5",
    title: "Building Extensible Systems",
    content: "When designing software systems, extensibility should be a core consideration from the beginning. This post explores patterns and principles for creating systems that can grow and adapt over time without becoming unwieldy or difficult to maintain.",
    type: "text",
    author: "Alex Thompson",
    publishedAt: "2024-01-12T16:30:00Z",
    tags: ["architecture", "design", "software"],
    category: "Engineering"
  },
  {
    id: "6",
    title: "Morning Coffee Ritual",
    content: "There's something magical about that first cup of coffee in the morning. This shot captures the perfect moment of steam rising from freshly brewed coffee.",
    type: "photo",
    author: "Lisa Park",
    publishedAt: "2024-01-11T08:00:00Z",
    tags: ["coffee", "morning", "lifestyle"],
    category: "Lifestyle",
    metadata: {
      imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=400&fit=crop"
    }
  }
];