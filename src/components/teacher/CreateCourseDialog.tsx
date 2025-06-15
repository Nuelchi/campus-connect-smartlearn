import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Upload, FileVideo, FileText, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface CreateCourseDialogProps {
  onCourseCreated: () => void;
}

export default function CreateCourseDialog({ onCourseCreated }: CreateCourseDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    department: "",
    syllabus: "",
    contentType: "document", // 'video' or 'document'
    instructorFirstName: "",
    instructorLastName: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [customCategory, setCustomCategory] = useState("");

  const predefinedCategories = [
    "Computer Science",
    "Mathematics", 
    "Engineering",
    "Business",
    "Science",
    "Arts & Humanities",
    "Language Learning",
    "Health & Medicine",
    "Social Sciences"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types based on content type
    const invalidFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (formData.contentType === 'video') {
        return !['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(extension || '');
      } else {
        return !['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx'].includes(extension || '');
      }
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: `Please upload only ${formData.contentType === 'video' ? 'video' : 'document'} files.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setFormData(prev => ({ ...prev, category: customCategory }));
    } else {
      setFormData(prev => ({ ...prev, category: value }));
      setCustomCategory("");
    }
  };

  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value);
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleContentTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, contentType: value }));
    setSelectedFiles([]); // Clear files when changing content type
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Course title is required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First update the user's profile with instructor name if provided
      if (formData.instructorFirstName || formData.instructorLastName) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            first_name: formData.instructorFirstName || null,
            last_name: formData.instructorLastName || null,
          });

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }

      const { error } = await supabase
        .from("courses")
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category || null,
          department: formData.department || null,
          syllabus: formData.syllabus || null,
          instructor_id: user.id,
        });

      if (error) throw error;

      // TODO: Handle file uploads to Supabase Storage
      // This would be implemented when storage is properly configured
      if (selectedFiles.length > 0) {
        toast({
          title: "Note",
          description: `Course created successfully! File upload functionality will be implemented when storage is configured. ${selectedFiles.length} files were selected.`,
        });
      } else {
        toast({
          title: "Success",
          description: "Course created successfully!",
        });
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        department: "",
        syllabus: "",
        contentType: "document",
        instructorFirstName: "",
        instructorLastName: "",
      });
      setSelectedFiles([]);
      setCustomCategory("");
      setIsOpen(false);
      onCourseCreated();
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter course title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Course description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instructorFirstName">Instructor First Name</Label>
              <Input
                id="instructorFirstName"
                value={formData.instructorFirstName}
                onChange={(e) => setFormData(prev => ({ ...prev, instructorFirstName: e.target.value }))}
                placeholder="Your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructorLastName">Instructor Last Name</Label>
              <Input
                id="instructorLastName"
                value={formData.instructorLastName}
                onChange={(e) => setFormData(prev => ({ ...prev, instructorLastName: e.target.value }))}
                placeholder="Your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category && predefinedCategories.includes(formData.category) ? formData.category : "custom"} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select or enter category" />
              </SelectTrigger>
              <SelectContent>
                {predefinedCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Category</SelectItem>
              </SelectContent>
            </Select>
            {(formData.category === customCategory || !predefinedCategories.includes(formData.category)) && (
              <Input
                placeholder="Enter custom category"
                value={customCategory || formData.category}
                onChange={(e) => handleCustomCategoryChange(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              placeholder="Department (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="syllabus">Syllabus (Optional)</Label>
            <Textarea
              id="syllabus"
              value={formData.syllabus}
              onChange={(e) => setFormData(prev => ({ ...prev, syllabus: e.target.value }))}
              placeholder="Course syllabus (optional)"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={formData.contentType} onValueChange={handleContentTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Document Course (PDF, DOC, PPT)
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center">
                    <FileVideo className="mr-2 h-4 w-4" />
                    Video Course (MP4, AVI, MOV)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Upload Course Content</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                accept={formData.contentType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt,.ppt,.pptx'}
                className="hidden"
              />
              <Label htmlFor="files" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload {formData.contentType === 'video' ? 'videos' : 'documents'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formData.contentType === 'video' 
                      ? 'MP4, AVI, MOV, WMV, WebM' 
                      : 'PDF, DOC, DOCX, TXT, PPT, PPTX'
                    }
                  </span>
                </div>
              </Label>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label>Selected Files:</Label>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      {formData.contentType === 'video' ? (
                        <FileVideo className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
