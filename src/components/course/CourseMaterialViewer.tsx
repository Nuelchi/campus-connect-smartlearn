
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maximize, X } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type CourseMaterial = Tables<"course_materials">;

interface CourseMaterialViewerProps {
  material: CourseMaterial;
  isFullscreen: boolean;
  onClose: () => void;
  onFullscreen: () => void;
}

export default function CourseMaterialViewer({ 
  material, 
  isFullscreen, 
  onClose, 
  onFullscreen 
}: CourseMaterialViewerProps) {
  const renderMaterialViewer = (material: CourseMaterial) => {
    const embedStyle = "w-full h-full border-0 rounded-lg";
    
    if (material.file_url && (material.file_url.endsWith('.pdf') || material.content_type === 'PDF')) {
      return (
        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onFullscreen}
              className="bg-black/70 text-white hover:bg-black/80"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onClose}
              className="bg-black/70 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <iframe 
            src={material.file_url}
            className={embedStyle}
            style={{ height: '600px' }}
            title="PDF Viewer"
          />
        </div>
      );
    }
    
    if (material.file_url?.match(/\.(mp4|mov|mkv|webm)$/)) {
      return (
        <div className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden">
          <Button
            size="sm"
            variant="secondary"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </Button>
          <video 
            controls 
            className={`${embedStyle} h-[600px] object-contain`}
            src={material.file_url}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    if (material.external_url?.includes('youtube.com') || material.external_url?.includes('youtu.be')) {
      const videoId = material.external_url.match(/(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/)|youtu\.be\/)([^"&?\/\s]+)/)?.[1];
      if (videoId) {
        return (
          <div className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden">
            <Button
              size="sm"
              variant="secondary"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </Button>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className={`${embedStyle} h-[600px]`}
              allowFullScreen
            />
          </div>
        );
      }
    }
    
    if (material.file_url?.endsWith('.docx')) {
      return (
        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          <Button
            size="sm"
            variant="secondary"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </Button>
          <iframe
            src={`https://docs.google.com/gview?url=${material.file_url}&embedded=true`}
            className={`${embedStyle} h-[600px]`}
          />
        </div>
      );
    }
    
    // Default case - try to display the file
    return (
      <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
        <Button
          size="sm"
          variant="secondary"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/80"
        >
          <X className="h-4 w-4" />
        </Button>
        <iframe
          src={material.file_url || material.external_url || ''}
          className={`${embedStyle} h-[600px]`}
        />
      </div>
    );
  };

  return (
    <>
      {/* Fullscreen PDF Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={onFullscreen}
              variant="secondary"
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <X className="h-4 w-4" />
              Exit Fullscreen
            </Button>
          </div>
          <iframe 
            src={material.file_url || ''}
            className="w-full h-full"
            title="PDF Viewer"
          />
        </div>
      )}

      {/* Content Viewer */}
      <div className="lg:col-span-3 mb-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Viewing: {material.title}</span>
              <Badge variant="outline">{material.content_type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderMaterialViewer(material)}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
