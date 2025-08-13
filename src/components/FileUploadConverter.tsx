
import { useState, useCallback } from "react";
import { Upload, File, X, Loader2, FileText, FileSpreadsheet, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ConversionResult } from "@/pages/Index";

interface FileUploadConverterProps {
  onConversionStart: () => void;
  onConversionComplete: (result: ConversionResult) => void;
  isLoading: boolean;
}

const API_BASE_URL = "http://localhost:8000";

const supportedFormats = [
  { ext: ".pdf", label: "PDF 문서", icon: FileText, color: "text-red-500" },
  { ext: ".doc,.docx", label: "Microsoft Word", icon: FileText, color: "text-blue-500" },
  { ext: ".xls,.xlsx", label: "Microsoft Excel", icon: FileSpreadsheet, color: "text-green-500" },
  { ext: ".ppt,.pptx", label: "PowerPoint", icon: Presentation, color: "text-orange-500" },
  { ext: ".txt", label: "텍스트 파일", icon: File, color: "text-gray-500" }
];

export const FileUploadConverter = ({
  onConversionStart,
  onConversionComplete,
  isLoading
}: FileUploadConverterProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];

    if (file.size > maxSize) {
      toast({
        title: "파일 크기 초과",
        description: "파일 크기는 50MB를 초과할 수 없습니다.",
        variant: "destructive"
      });
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "지원하지 않는 파일 형식",
        description: "PDF, Word, Excel, PowerPoint, 텍스트 파일만 지원됩니다.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast({
        title: "파일을 선택해주세요",
        description: "변환할 파일을 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    onConversionStart();

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_BASE_URL}/convert-file`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.detail || "파일 변환 중 오류가 발생했습니다.");
      }

      onConversionComplete(result);
      
      toast({
        title: "변환 완료!",
        description: `${selectedFile.name}이 성공적으로 마크다운으로 변환되었습니다.`
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase();
    if (ext.includes('.pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (ext.includes('.doc')) return <FileText className="w-8 h-8 text-blue-500" />;
    if (ext.includes('.xls')) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    if (ext.includes('.ppt')) return <Presentation className="w-8 h-8 text-orange-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-primary" />
          <span>파일 업로드 변환</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedFile ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">파일을 드래그하거나 클릭하여 업로드</h3>
            <p className="text-muted-foreground mb-4">
              PDF, Word, Excel, PowerPoint, 텍스트 파일 지원 (최대 50MB)
            </p>
            
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            <Button asChild variant="outline" disabled={isLoading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                파일 선택
              </label>
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedFile.name)}
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">지원 파일 형식</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {supportedFormats.map((format, index) => {
              const Icon = format.icon;
              return (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Icon className={cn("w-4 h-4", format.color)} />
                  <span>{format.label}</span>
                  <span className="text-muted-foreground">({format.ext})</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="font-medium text-sm text-blue-800">처리 정보</h4>
              <p className="text-sm text-blue-700 mt-1">
                Microsoft MarkItDown 엔진을 사용하여 고품질 변환을 제공합니다.
                이미지가 포함된 PDF의 경우 텍스트만 추출됩니다.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConvert}
          disabled={isLoading || !selectedFile}
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
              <Upload className="w-4 h-4 mr-2" />
              마크다운으로 변환
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
