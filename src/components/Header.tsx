
import { Globe, Github, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MarkdownConverter</h1>
            <p className="text-xs text-muted-foreground">Web to Markdown Service</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">API 문서</span>
            </a>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
