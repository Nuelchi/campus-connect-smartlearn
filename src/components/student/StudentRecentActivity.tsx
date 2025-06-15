
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudentAnalytics } from "@/hooks/useStudentAnalytics";

export default function StudentRecentActivity() {
  const { analytics, loading, refetch } = useStudentAnalytics();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
              <p>Loading your activity...</p>
            </div>
          ) : (
            <>
              {/* Recent Submissions */}
              {analytics.recentSubmissions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recent Submissions
                  </h4>
                  {analytics.recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="mt-1">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm truncate">{submission.assignment_title}</h5>
                          {submission.grade && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {submission.grade}/100
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{submission.course_title}</p>
                        <p className="text-xs text-muted-foreground">Submitted {submission.submitted_at}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upcoming Deadlines */}
              {analytics.upcomingDeadlines.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-orange-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Upcoming Deadlines
                  </h4>
                  {analytics.upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div className="mt-1">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{deadline.title}</h5>
                        <p className="text-sm text-muted-foreground mb-1">{deadline.course_title}</p>
                        <p className="text-xs text-muted-foreground">Due {deadline.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {analytics.recentSubmissions.length === 0 && analytics.upcomingDeadlines.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start submitting assignments to see your progress!</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
