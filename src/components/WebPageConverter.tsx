
import { useState } from "react";
import { Globe, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { ConversionResult } from "@/pages/Index";

interface WebPageConverterProps {
  onConversionStart: () => void;
  onConversionComplete: (result: ConversionResult) => void;
  isLoading: boolean;
}

const API_BASE_URL = "http://localhost:8000";

export const WebPageConverter = ({
  onConversionStart,
  onConversionComplete,
  isLoading
}: WebPageConverterProps) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!url.trim()) {
      toast({
        title: "URL을 입력해주세요",
        description: "변환할 웹페이지의 URL을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    onConversionStart();

    try {
      const response = await fetch(`${API_BASE_URL}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.detail || "변환 중 오류가 발생했습니다.");
      }

      onConversionComplete(result);
      
      toast({
        title: "변환 완료!",
        description: `웹페이지가 성공적으로 마크다운으로 변환되었습니다.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      onConversionComplete({
        success: false,
        error: errorMessage
      });
      
      toast({
        title: "변환 실패",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-primary" />
          <span>웹페이지 변환</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url">웹페이지 URL</Label>
          <div className="flex space-x-2">
            <Input
              id="url"
              type="url"
              placeholder="https://docs.example.com/api"
              value={url}
              onChange={handleUrlChange}
              disabled={isLoading}
              className="flex-1"
            />
            {url && isValidUrl(url) && (
              <Button
                variant="outline"
                size="icon"
                asChild
                disabled={isLoading}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="새 탭에서 열기"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            변환할 웹페이지의 전체 URL을 입력하세요. JavaScript로 렌더링되는 페이지도 지원합니다.
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">지원 기능</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• JavaScript 동적 콘텐츠 완전 렌더링</li>
            <li>• 이미지, 링크, 표 등 모든 요소 보존</li>
            <li>• 페이지 메타데이터 자동 추출</li>
            <li>• 팝업, 광고 등 자동 제거</li>
          </ul>
        </div>

        <Button
          onClick={handleConvert}
          disabled={isLoading || !url.trim() || !isValidUrl(url)}
          className="w-full gradient-primary text-white hover:opacity-90"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              변환 중...
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 mr-2" />
              마크다운으로 변환
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
