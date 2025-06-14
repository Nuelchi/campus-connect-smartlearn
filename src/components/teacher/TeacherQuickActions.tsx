
import { Plus, Users, FileText, BarChart } from "lucide-react";
import QuickActions from "@/components/dashboard/QuickActions";

export default function TeacherQuickActions() {
  const quickActions = [
    {
      title: "Create Course",
      description: "Add a new course",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", "courses");
        url.searchParams.set("action", "create");
        window.history.pushState({}, "", url);
        window.location.reload();
      },
      variant: "default" as const,
    },
    {
      title: "View Students",
      description: "Manage enrolled students",
      icon: <Users className="h-5 w-5" />,
      onClick: () => {
        const url = new URL(window.location.href);
        url.searchParams.set("section", "students");
        window.history.pushState({}, "", url);
        window.location.reload();
      },
    },
    {
      title: "Grade Assignments",
      description: "Review and grade work",
      icon: <FileText className="h-5 w-5" />,
      onClick: () => {
        const url = new URL(window.location.href);
        url.searchParams.set("section", "gradebook");
        window.history.pushState({}, "", url);
        window.location.reload();
      },
    },
    {
      title: "View Analytics",
      description: "Check course performance",
      icon: <BarChart className="h-5 w-5" />,
      onClick: () => {
        const url = new URL(window.location.href);
        url.searchParams.set("section", "analytics");
        window.history.pushState({}, "", url);
        window.location.reload();
      },
    },
  ];

  return <QuickActions actions={quickActions} />;
}
