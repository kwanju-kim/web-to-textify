
import { useState } from "react";
import { Network, Globe, Languages, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ConversionResult } from "@/pages/Index";

interface MultiPageCrawlerProps {
  onConversionStart: () => void;
  onConversionComplete: (result: ConversionResult) => void;
  isLoading: boolean;
}

const API_BASE_URL = "http://localhost:8000";

const languages = [
  { value: "", label: "번역 안함" },
  { value: "Korean", label: "한국어" },
  { value: "English", label: "영어" },
  { value: "Japanese", label: "일본어" },
  { value: "Chinese", label: "중국어" },
  { value: "Spanish", label: "스페인어" },
  { value: "French", label: "프랑스어" },
  { value: "German", label: "독일어" }
];

export const MultiPageCrawler = ({
  onConversionStart,
  onConversionComplete,
  isLoading
}: MultiPageCrawlerProps) => {
  const [url, setUrl] = useState("");
  const [maxPages, setMaxPages] = useState("20");
  const [maxDepth, setMaxDepth] = useState("3");
  const [translateTo, setTranslateTo] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const handleCrawl = async () => {
    if (!url.trim()) {
      toast({
        title: "URL을 입력해주세요",
        description: "크롤링할 API 문서 사이트의 URL을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    onConversionStart();

    try {
      const requestBody: any = {
        url: url.trim(),
        max_pages: parseInt(maxPages) || 20,
        max_depth: parseInt(maxDepth) || 3
      };

      if (translateTo) {
        requestBody.translate_to = translateTo;
      }

      const response = await fetch(`${API_BASE_URL}/crawl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.detail || "크롤링 중 오류가 발생했습니다.");
      }

      onConversionComplete(result);
      
      toast({
        title: "크롤링 완료!",
        description: `${result.summary?.successful_pages || 0}개 페이지가 성공적으로 변환되었습니다.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      onConversionComplete({
        success: false,
        error: errorMessage
      });
      
      toast({
        title: "크롤링 실패",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-primary" />
          <span>다중 페이지 크롤링</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="crawl-url">API 문서 사이트 URL</Label>
          <Input
            id="crawl-url"
            type="url"
            placeholder="https://docs.stripe.com/api"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            API 문서의 메인 페이지 URL을 입력하세요. LLM이 자동으로 관련 페이지를 탐색합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max-pages">최대 페이지 수</Label>
            <Input
              id="max-pages"
              type="number"
              min="1"
              max="100"
              value={maxPages}
              onChange={(e) => setMaxPages(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-depth">최대 탐색 깊이</Label>
            <Input
              id="max-depth"
              type="number"
              min="1"
              max="10"
              value={maxDepth}
              onChange={(e) => setMaxDepth(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-0">
              <Settings className="w-4 h-4" />
              <span>고급 설정</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="translate">번역 언어</Label>
              <Select value={translateTo} onValueChange={setTranslateTo} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="번역할 언어 선택" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center space-x-2">
                        {lang.value && <Languages className="w-4 h-4" />}
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                선택 시 크롤링과 동시에 해당 언어로 번역됩니다. (추가 비용 발생)
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">지능형 크롤링 기능</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• GPT-4o-mini 기반 페이지 분류 및 우선순위 결정</li>
            <li>• API Reference, Guide, Authentication 자동 인식</li>
            <li>• Stoplight, Redoc, Swagger UI 특화 지원</li>
            <li>• 실시간 비용 추적 및 토큰 사용량 모니터링</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="font-medium text-sm text-yellow-800">비용 안내</h4>
              <p className="text-sm text-yellow-700 mt-1">
                다중 페이지 크롤링은 LLM API를 사용하여 페이지당 약 $0.001-0.005의 비용이 발생합니다.
                실시간 사용량이 추적되며 결과에 총 비용이 표시됩니다.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCrawl}
          disabled={isLoading || !url.trim()}
          className="w-full gradient-primary text-white hover:opacity-90"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              크롤링 중...
            </>
          ) : (
            <>
              <Network className="w-4 h-4 mr-2" />
              지능형 크롤링 시작
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
