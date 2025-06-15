
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, BookOpen, FileText, TrendingUp } from "lucide-react";
import { useTeacherAnalytics } from "@/hooks/useTeacherAnalytics";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function TeacherAnalyticsDashboard() {
  const { analytics, loading, refetch } = useTeacherAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-semibold animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teacher Analytics</h2>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">Created assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">Student submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="enrollments" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Enrollments"
                />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Submissions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Enrollments Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.courseEnrollments.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.courseEnrollments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="course" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="enrollments" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No course enrollment data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignment Submissions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.assignmentSubmissions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.assignmentSubmissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="assignment" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No assignment submission data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Students per Course</span>
              <span className="text-lg font-bold">
                {analytics.totalCourses > 0 ? Math.round(analytics.totalStudents / analytics.totalCourses) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Assignments per Course</span>
              <span className="text-lg font-bold">
                {analytics.totalCourses > 0 ? Math.round(analytics.totalAssignments / analytics.totalCourses) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Submission Rate</span>
              <span className="text-lg font-bold">
                {analytics.totalAssignments > 0 ? Math.round((analytics.totalSubmissions / analytics.totalAssignments) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Courses</span>
              <span className="text-lg font-bold">{analytics.totalCourses}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
