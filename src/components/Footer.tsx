
import { Globe, Github, BookOpen, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">MarkdownConverter</span>
            </div>
            <p className="text-sm text-muted-foreground">
              웹페이지, API 문서, 파일을 고품질 마크다운으로 변환하는 지능형 서비스
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">서비스</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>웹페이지 변환</li>
              <li>다중 페이지 크롤링</li>
              <li>파일 업로드 변환</li>
              <li>번역 서비스</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">기술 스택</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>FastAPI + Python</li>
              <li>GPT-4o-mini</li>
              <li>Playwright</li>
              <li>Microsoft MarkItDown</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">링크</h3>
            <div className="space-y-2">
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>API 문서</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Web to Markdown Converter. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
              <span>by developers, for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
