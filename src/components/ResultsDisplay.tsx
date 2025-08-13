
import { useState } from "react";
import { Download, Eye, Copy, CheckCircle, XCircle, FileText, Clock, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ConversionResult, ConversionMode } from "@/pages/Index";

interface ResultsDisplayProps {
  result: ConversionResult | null;
  isLoading: boolean;
  selectedMode: ConversionMode;
}

export const ResultsDisplay = ({
  result,
  isLoading,
  selectedMode
}: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (!result) return;
    
    const markdown = result.markdown || result.combined_markdown || "";
    navigator.clipboard.writeText(markdown);
    
    toast({
      title: "복사 완료",
      description: "마크다운이 클립보드에 복사되었습니다."
    });
  };

  const handleDownload = () => {
    if (!result) return;
    
    const markdown = result.markdown || result.combined_markdown || "";
    const filename = result.saved_file?.split('/').pop() || 'converted.md';
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "다운로드 시작",
      description: `${filename} 파일이 다운로드됩니다.`
    });
  };

  const formatContentLength = (length: number): string => {
    if (length < 1000) return `${length} 문자`;
    if (length < 1000000) return `${(length / 1000).toFixed(1)}K 문자`;
    return `${(length / 1000000).toFixed(1)}M 문자`;
  };

  const getLoadingMessage = (): string => {
    switch (selectedMode) {
      case "webpage":
        return "웹페이지를 분석하고 마크다운으로 변환하고 있습니다...";
      case "multipage":
        return "LLM이 페이지를 분석하고 관련 문서를 탐색하고 있습니다...";
      case "file":
        return "파일을 처리하고 마크다운으로 변환하고 있습니다...";
      default:
        return "처리 중입니다...";
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-soft sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>처리 중</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <p className="text-muted-foreground mb-4">
              {getLoadingMessage()}
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="gradient-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="shadow-soft sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <span>결과</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              변환이 완료되면 결과가 여기에 표시됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const markdown = result.markdown || result.combined_markdown || "";
  const isSuccess = result.success;

  return (
    <Card className="shadow-soft sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSuccess ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span>{isSuccess ? "변환 완료" : "변환 실패"}</span>
          </div>
          {isSuccess && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isSuccess ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">오류 발생</h4>
                <p className="text-sm text-red-700 mt-1">{result.error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 통계 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <FileText className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">
                  {formatContentLength(markdown.length)}
                </p>
                <p className="text-xs text-muted-foreground">변환된 내용</p>
              </div>
              
              {selectedMode === "multipage" && result.summary && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Badge variant="secondary" className="mb-1">
                    {result.summary.successful_pages}페이지
                  </Badge>
                  <p className="text-xs text-muted-foreground">크롤링 성공</p>
                </div>
              )}
              
              {selectedMode !== "multipage" && result.metadata && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">
                    {new Date().toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-muted-foreground">완료 시간</p>
                </div>
              )}
            </div>

            {/* 파일 정보 */}
            {result.saved_file && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-800">
                    파일 저장 완료
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1 font-mono">
                  {result.saved_file.split('/').pop()}
                </p>
              </div>
            )}

            {/* 마크다운 미리보기 */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">미리보기</TabsTrigger>
                <TabsTrigger value="source">소스</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-4">
                <ScrollArea className="h-96 border rounded-lg p-4">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: markdown
                        .replace(/^# /gm, '<h1>')
                        .replace(/^## /gm, '<h2>')
                        .replace(/^### /gm, '<h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n/g, '<br>')
                    }}
                  />
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="source" className="mt-4">
                <ScrollArea className="h-96 border rounded-lg">
                  <pre className="p-4 text-sm bg-muted/30">
                    <code>{markdown}</code>
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {/* 다중 페이지 상세 정보 */}
            {selectedMode === "multipage" && result.pages && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">크롤링된 페이지</h4>
                <ScrollArea className="h-32 border rounded-lg">
                  <div className="p-3 space-y-2">
                    {result.pages.map((page: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex-1 truncate">
                          <span className="font-medium">{page.title || "제목 없음"}</span>
                          <p className="text-xs text-muted-foreground truncate">
                            {page.url}
                          </p>
                        </div>
                        <Badge 
                          variant={page.success ? "default" : "destructive"}
                          className="ml-2 text-xs"
                        >
                          {page.page_type || "unknown"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
