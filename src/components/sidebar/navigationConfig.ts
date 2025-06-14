
import {
  Home,
  BookOpen,
  Users,
  FileText,
  BarChart,
  Calendar,
  Settings,
  HelpCircle,
  ClipboardList,
  MessageSquare,
  Bell,
  GraduationCap,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: typeof Home;
}

export const getMainNavItems = (role: string | null): NavigationItem[] => {
  const commonItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
  ];

  if (role === "teacher") {
    return [
      ...commonItems,
      {
        title: "Course Management",
        url: "/dashboard?tab=courses",
        icon: BookOpen,
      },
      {
        title: "Students",
        url: "/dashboard?section=students",
        icon: Users,
      },
      {
        title: "Assignments",
        url: "/dashboard?section=assignments",
        icon: FileText,
      },
      {
        title: "Gradebook",
        url: "/dashboard?section=gradebook",
        icon: ClipboardList,
      },
      {
        title: "Messages",
        url: "/dashboard?section=messaging",
        icon: MessageSquare,
      },
    ];
  }

  if (role === "student") {
    return [
      ...commonItems,
      {
        title: "My Courses",
        url: "/dashboard?section=courses",
        icon: BookOpen,
      },
      {
        title: "Assignments",
        url: "/dashboard?section=assignments",
        icon: FileText,
      },
      {
        title: "Grades",
        url: "/dashboard?section=grades",
        icon: GraduationCap,
      },
      {
        title: "Calendar",
        url: "/dashboard?section=calendar",
        icon: Calendar,
      },
    ];
  }

  if (role === "admin") {
    return [
      ...commonItems,
      {
        title: "User Management",
        url: "/dashboard?section=users",
        icon: Users,
      },
      {
        title: "Course Management",
        url: "/dashboard?section=courses",
        icon: BookOpen,
      },
      {
        title: "Analytics",
        url: "/dashboard?section=analytics",
        icon: BarChart,
      },
      {
        title: "Settings",
        url: "/dashboard?section=settings",
        icon: Settings,
      },
    ];
  }

  return commonItems;
};

export const supportNavItems: NavigationItem[] = [
  {
    title: "Notifications",
    url: "/dashboard?section=notifications",
    icon: Bell,
  },
  {
    title: "Help & Support",
    url: "/dashboard?section=help",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    url: "/dashboard?section=settings",
    icon: Settings,
  },
];
