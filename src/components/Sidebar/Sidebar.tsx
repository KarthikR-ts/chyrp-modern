import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Mail, 
  Rss, 
  Shield, 
  Settings, 
  LogOut, 
  Calendar,
  Archive,
  FileText,
  Users,
  Home
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  selectedCategory?: string;
  selectedTag?: string;
  onCategorySelect: (category: string | null) => void;
  onTagSelect: (tag: string | null) => void;
  categories: string[];
  tags: string[];
}

export function Sidebar({ 
  selectedCategory, 
  selectedTag, 
  onCategorySelect, 
  onTagSelect, 
  categories, 
  tags 
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Blog", icon: FileText, active: true },
    { label: "Email", icon: Mail },
    { label: "Feed", icon: Rss },
    { label: "Admin", icon: Shield },
    { label: "Controls", icon: Settings },
  ];

  const pages = [
    "Colophon",
    "My Awesome Homepage"
  ];

  const relatedPosts = [
    "Chyrp Lite ♥ PHP",
    "Virgula is a theme for...",
    "Umbra is a theme for...",
    "Topaz is a theme for...",
    "Sparrow is a theme for..."
  ];

  const archiveMonths = [
    "March 2025",
    "February 2025", 
    "January 2025",
    "November 2024",
    "July 2024",
    "June 2024",
    "May 2024",
    "April 2024",
    "March 2024",
    "February 2024",
    "December 2023",
    "November 2023"
  ];

  return (
    <div className="w-full space-y-6">
      {/* Site Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold gradient-text mb-2">My Awesome Site</h1>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Navigation */}
      <Card className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                if (item.label === "Blog") navigate("/");
              }}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </Card>

      {/* Categories */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-lg">Categories</h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              className="w-full justify-start text-sm"
              onClick={() => onCategorySelect(selectedCategory === category ? null : category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </Card>

      {/* Pages */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-lg">Pages</h3>
        <div className="space-y-1">
          {pages.map((page) => (
            <Button
              key={page}
              variant="ghost"
              className="w-full justify-start text-sm"
            >
              <Home className="w-4 h-4 mr-2" />
              {page}
            </Button>
          ))}
        </div>
      </Card>

      {/* Related Posts */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-lg">Related Posts</h3>
        <div className="space-y-1">
          {relatedPosts.map((post, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-sm h-auto py-2 px-2"
            >
              <div className="text-left">
                <div className="text-xs text-muted-foreground truncate">{post}</div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Archive */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-lg">Archive</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {archiveMonths.map((month) => (
            <Button
              key={month}
              variant="ghost"
              className="w-full justify-start text-sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {month}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}