
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Plus, AlertCircle } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import CreateAssignmentDialog from "./CreateAssignmentDialog";
import { useAssignments } from "@/hooks/useAssignments";

export default function AssignmentCreationInterface() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const { courses, loading: coursesLoading } = useCourses();
  const { refetchAssignments } = useAssignments();

  const handleAssignmentCreated = () => {
    refetchAssignments();
    setSelectedCourse("");
  };

  if (coursesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-lg font-semibold animate-pulse">Loading courses...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to create a course before you can create assignments. 
              <Button variant="link" className="p-0 h-auto font-semibold ml-1">
                Create your first course
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Course</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a course for this assignment" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {course.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourse && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Assignment Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure your assignment settings below. Students will be able to submit files and receive feedback.
              </p>
              <CreateAssignmentDialog 
                courseId={selectedCourse} 
                onAssignmentCreated={handleAssignmentCreated}
              />
            </div>
          )}

          {!selectedCourse && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Select a course to start creating an assignment</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCourse === course.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedCourse(course.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <h4 className="font-medium truncate">{course.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  {course.department || 'No department'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
