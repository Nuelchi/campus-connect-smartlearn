
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileVideo, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CourseContentUploadProps {
  courseId: string;
  onContentUploaded: () => void;
}

export default function CourseContentUpload({ courseId, onContentUploaded }: CourseContentUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    contentType: "",
    externalUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-detect content type based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(extension || '')) {
        setFormData(prev => ({ ...prev, contentType: 'video' }));
      } else if (['pdf'].includes(extension || '')) {
        setFormData(prev => ({ ...prev, contentType: 'PDF' }));
      } else if (['doc', 'docx'].includes(extension || '')) {
        setFormData(prev => ({ ...prev, contentType: 'document' }));
      }
    }
  };

  const uploadFileToStorage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    // Create a unique file path: userId/courseId/filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${courseId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('course-materials')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('course-materials')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = formData.externalUrl;
      let fileSize = null;

      // Upload file to Supabase Storage if selected
      if (selectedFile) {
        fileUrl = await uploadFileToStorage(selectedFile);
        fileSize = selectedFile.size;
        
        if (!fileUrl) {
          throw new Error('Failed to upload file');
        }
      }

      if (!fileUrl && !formData.externalUrl) {
        throw new Error('Please either upload a file or provide an external URL');
      }

      const { error } = await supabase
        .from("course_materials")
        .insert({
          course_id: courseId,
          title: formData.title,
          content_type: formData.contentType,
          file_url: fileUrl,
          external_url: formData.externalUrl || null,
          file_size: fileSize,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content uploaded successfully!",
      });

      setFormData({ title: "", contentType: "", externalUrl: "" });
      setSelectedFile(null);
      setIsOpen(false);
      onContentUploaded();
    } catch (error) {
      console.error("Error uploading content:", error);
      toast({
        title: "Error",
        description: "Failed to upload content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Course Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Content Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter content title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={formData.contentType} onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">
                  <div className="flex items-center">
                    <FileVideo className="mr-2 h-4 w-4" />
                    Video
                  </div>
                </SelectItem>
                <SelectItem value="PDF">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF Document
                  </div>
                </SelectItem>
                <SelectItem value="document">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Document
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept={formData.contentType === 'video' ? 'video/*' : formData.contentType === 'PDF' ? '.pdf' : '.pdf,.doc,.docx'}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalUrl">Or External URL</Label>
            <Input
              id="externalUrl"
              value={formData.externalUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
              placeholder="https://example.com/video.mp4"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (!selectedFile && !formData.externalUrl)}>
              {loading ? "Uploading..." : "Upload Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
