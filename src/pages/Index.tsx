
import { useState } from "react";
import { Header } from "@/components/Header";
import { ConversionModeSelector } from "@/components/ConversionModeSelector";
import { WebPageConverter } from "@/components/WebPageConverter";
import { MultiPageCrawler } from "@/components/MultiPageCrawler";
import { FileUploadConverter } from "@/components/FileUploadConverter";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Footer } from "@/components/Footer";

export type ConversionMode = "webpage" | "multipage" | "file";

export interface ConversionResult {
  success: boolean;
  markdown?: string;
  combined_markdown?: string;
  error?: string;
  metadata?: any;
  pages?: any[];
  summary?: any;
  saved_file?: string;
  original_url?: string;
}

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<ConversionMode>("webpage");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConversionComplete = (result: ConversionResult) => {
    setResult(result);
    setIsLoading(false);
  };

  const handleConversionStart = () => {
    setIsLoading(true);
    setResult(null);
  };

  const renderConverter = () => {
    switch (selectedMode) {
      case "webpage":
        return (
          <WebPageConverter
            onConversionStart={handleConversionStart}
            onConversionComplete={handleConversionComplete}
            isLoading={isLoading}
          />
        );
      case "multipage":
        return (
          <MultiPageCrawler
            onConversionStart={handleConversionStart}
            onConversionComplete={handleConversionComplete}
            isLoading={isLoading}
          />
        );
      case "file":
        return (
          <FileUploadConverter
            onConversionStart={handleConversionStart}
            onConversionComplete={handleConversionComplete}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Web to Markdown Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            웹페이지, API 문서, 파일을 고품질 마크다운으로 변환하는 지능형 서비스입니다.
            LLM 기반 다중 페이지 크롤링과 Microsoft MarkItDown 엔진을 활용합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ConversionModeSelector
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
            />
            
            <div className="animate-slide-up">
              {renderConverter()}
            </div>
          </div>

          <div className="lg:col-span-1">
            <ResultsDisplay
              result={result}
              isLoading={isLoading}
              selectedMode={selectedMode}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
