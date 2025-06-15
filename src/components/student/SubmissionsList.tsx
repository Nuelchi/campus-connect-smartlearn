
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Calendar, 
  Clock, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { useAssignmentSubmissions } from "@/hooks/useAssignmentSubmissions";

export default function SubmissionsList() {
  const { submissions, loading } = useAssignmentSubmissions();

  const getGradeColor = (grade: number | null) => {
    if (!grade) return "bg-gray-500";
    if (grade >= 90) return "bg-green-500";
    if (grade >= 80) return "bg-blue-500";
    if (grade >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getGradeLetter = (grade: number | null) => {
    if (!grade) return "N/A";
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  const getStatusBadge = (submission: any) => {
    if (submission.grade !== null) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Graded
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
            <p className="text-muted-foreground">
              You haven't submitted any assignments yet. Check your courses for available assignments!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group submissions by course
  const submissionsByCourse = submissions.reduce((acc, submission) => {
    const courseTitle = submission.assignment.course.title;
    if (!acc[courseTitle]) {
      acc[courseTitle] = [];
    }
    acc[courseTitle].push(submission);
    return acc;
  }, {} as Record<string, typeof submissions>);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Graded</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.grade !== null).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.grade === null).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Grade</p>
                <p className="text-2xl font-bold">
                  {submissions.filter(s => s.grade !== null).length > 0
                    ? Math.round(
                        submissions
                          .filter(s => s.grade !== null)
                          .reduce((sum, s) => sum + (s.grade || 0), 0) /
                        submissions.filter(s => s.grade !== null).length
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions by Course */}
      {Object.entries(submissionsByCourse).map(([courseTitle, courseSubmissions]) => (
        <Card key={courseTitle} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-semibold">{courseTitle}</span>
              <Badge variant="outline" className="ml-2">
                {courseSubmissions.length} submission{courseSubmissions.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">Assignment</TableHead>
                  <TableHead className="font-semibold">Submitted</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Grade</TableHead>
                  <TableHead className="font-semibold">File</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseSubmissions.map((submission) => (
                  <TableRow key={submission.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div>
                        <p className="font-medium">{submission.assignment.title}</p>
                        {submission.assignment.deadline && (
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Due: {format(new Date(submission.assignment.deadline), "MMM dd, yyyy 'at' HH:mm")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {format(new Date(submission.submitted_at), "MMM dd, yyyy")}
                        <br />
                        <span className="text-xs text-muted-foreground ml-6">
                          {format(new Date(submission.submitted_at), "HH:mm")}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(submission)}
                    </TableCell>
                    
                    <TableCell>
                      {submission.grade !== null ? (
                        <div className="flex items-center space-x-2">
                          <Badge 
                            className={`${getGradeColor(submission.grade)} text-white font-bold`}
                          >
                            {getGradeLetter(submission.grade)}
                          </Badge>
                          <span className="text-sm font-medium">{submission.grade}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not graded</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {submission.file_name ? (
                        <div className="flex items-center text-sm">
                          <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="truncate max-w-32" title={submission.file_name}>
                            {submission.file_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No file</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        {submission.file_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(submission.file_url, '_blank')}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        )}
                        {submission.feedback && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title={submission.feedback}
                          >
                            View Feedback
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
