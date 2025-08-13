
import { Globe, Network, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ConversionMode } from "@/pages/Index";

interface ConversionModeSelectorProps {
  selectedMode: ConversionMode;
  onModeChange: (mode: ConversionMode) => void;
}

const modes = [
  {
    id: "webpage" as const,
    title: "웹페이지 변환",
    description: "단일 웹페이지를 마크다운으로 변환",
    icon: Globe,
    features: ["JavaScript 렌더링", "동적 콘텐츠 지원", "메타데이터 추출"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "multipage" as const,
    title: "다중 페이지 크롤링",
    description: "API 문서 사이트를 지능형 크롤링",
    icon: Network,
    features: ["LLM 기반 네비게이션", "우선순위 탐색", "번역 지원"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "file" as const,
    title: "파일 업로드",
    description: "PDF, Office 문서를 마크다운으로",
    icon: Upload,
    features: ["PDF 텍스트 추출", "Office 문서 지원", "안전한 처리"],
    color: "from-green-500 to-emerald-500"
  }
];

export const ConversionModeSelector = ({
  selectedMode,
  onModeChange
}: ConversionModeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;
        
        return (
          <Card
            key={mode.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-medium",
              isSelected
                ? "ring-2 ring-primary shadow-medium"
                : "hover:border-primary/50"
            )}
            onClick={() => onModeChange(mode.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  mode.color
                )}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{mode.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mode.description}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-1">
                {mode.features.map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
