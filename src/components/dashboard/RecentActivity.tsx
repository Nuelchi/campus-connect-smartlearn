
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, BookOpen, FileText } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'course' | 'assignment' | 'student' | 'submission';
  title: string;
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'in-progress';
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title?: string;
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'course':
      return <BookOpen className="h-4 w-4" />;
    case 'assignment':
      return <FileText className="h-4 w-4" />;
    case 'student':
      return <User className="h-4 w-4" />;
    case 'submission':
      return <FileText className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status?: ActivityItem['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function RecentActivity({ activities, title = "Recent Activity" }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{activity.title}</h4>
                    {activity.status && (
                      <Badge variant="secondary" className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
