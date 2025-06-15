
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
  Upload,
  Award,
  PlusCircle,
  Search,
  Library,
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
        title: "My Courses",
        url: "/dashboard?tab=courses",
        icon: BookOpen,
      },
      {
        title: "Create Course",
        url: "/dashboard?section=create-course",
        icon: PlusCircle,
      },
      {
        title: "Course Management",
        url: "/dashboard?section=course-management",
        icon: Library,
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
        title: "Create Assignment",
        url: "/dashboard?section=create-assignment",
        icon: Upload,
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
      {
        title: "Analytics",
        url: "/dashboard?section=analytics",
        icon: BarChart,
      },
    ];
  }

  if (role === "student") {
    return [
      ...commonItems,
      {
        title: "Browse Courses",
        url: "/dashboard?section=courses",
        icon: Search,
      },
      {
        title: "My Courses",
        url: "/dashboard?section=my-courses",
        icon: BookOpen,
      },
      {
        title: "Assignments",
        url: "/dashboard?section=assignments",
        icon: FileText,
      },
      {
        title: "Submit Assignment",
        url: "/dashboard?section=submit-assignment",
        icon: Upload,
      },
      {
        title: "Grades",
        url: "/dashboard?section=grades",
        icon: GraduationCap,
      },
      {
        title: "Certificates",
        url: "/dashboard?section=certificates",
        icon: Award,
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
        title: "Teacher Approval",
        url: "/dashboard?section=teacher-approval",
        icon: ClipboardList,
      },
      {
        title: "Analytics",
        url: "/dashboard?section=analytics",
        icon: BarChart,
      },
      {
        title: "System Settings",
        url: "/dashboard?section=settings",
        icon: Settings,
      },
      {
        title: "Reports",
        url: "/dashboard?section=reports",
        icon: FileText,
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
    title: "Account Settings",
    url: "/dashboard?section=account",
    icon: Settings,
  },
];
