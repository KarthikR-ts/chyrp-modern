import { Button } from "@/components/ui/button";
import { PenTool, Search, User, Settings } from "lucide-react";

const BlogHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <PenTool className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Chyrp</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Categories
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Tags
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hover-lift">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover-lift">
            <User className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover-lift">
            <Settings className="w-4 h-4" />
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 hover-lift">
            New Post
          </Button>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;