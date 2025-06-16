
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trophy, Target, Calendar, Award } from "lucide-react";

export default function StudentQuickActions() {
  const quickActions = [
    {
      title: "Courses",
      description: "Resume your courses",
      icon: <BookOpen className="h-6 w-6" />,
      onClick: () => window.location.href = "/dashboard?section=courses",
      className: "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    },
    {
      title: "Assignment",
      description: "Complete pending work",
      icon: <Clock className="h-6 w-6" />,
      onClick: () => window.location.href = "/dashboard?section=assignments",
      className: "bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700",
    },
    {
      title: "Study Goals",
      description: "Set learning targets",
      icon: <Target className="h-6 w-6" />,
      onClick: () => window.location.href = "/dashboard?section=progress",
      className: "bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700",
    },
    {
      title: "Achievements",
      description: "View certificates",
      icon: <Trophy className="h-6 w-6" />,
      onClick: () => window.location.href = "/dashboard?section=certificates",
      className: "bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700",
    },
    {
      title: "Study Calendar",
      description: "Plan your schedule",
      icon: <Calendar className="h-6 w-6" />,
      onClick: () => window.location.href = "/dashboard?section=calendar",
      className: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700",
    },
    {
      title: "Progress Report",
      description: "Track your growth",
      icon: <Award className="h-6 w-6" />,
      onClick: () => window.location.href = "/dashboard?section=progress",
      className: "bg-gradient-to-br from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`h-auto p-4 justify-start text-left ${action.className}`}
              variant="default"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90 truncate">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
