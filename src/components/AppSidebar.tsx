
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  BookOpen,
  Users,
  FileText,
  BarChart,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  GraduationCap,
  Award,
  ClipboardList,
  MessageSquare,
  Bell,
} from "lucide-react";

export function AppSidebar() {
  const { user, profile, signOut, role } = useAuth();

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || "User";
  };

  // Main navigation items based on role
  const getMainNavItems = () => {
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
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Students",
          url: "#",
          icon: Users,
        },
        {
          title: "Assignments",
          url: "#",
          icon: FileText,
        },
        {
          title: "Gradebook",
          url: "#",
          icon: ClipboardList,
        },
        {
          title: "Analytics",
          url: "#",
          icon: BarChart,
        },
        {
          title: "Calendar",
          url: "#",
          icon: Calendar,
        },
      ];
    }

    if (role === "student") {
      return [
        ...commonItems,
        {
          title: "My Courses",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Assignments",
          url: "#",
          icon: FileText,
        },
        {
          title: "Grades",
          url: "#",
          icon: Award,
        },
        {
          title: "Calendar",
          url: "#",
          icon: Calendar,
        },
      ];
    }

    if (role === "admin") {
      return [
        ...commonItems,
        {
          title: "User Management",
          url: "#",
          icon: Users,
        },
        {
          title: "Course Management",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Analytics",
          url: "#",
          icon: BarChart,
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings,
        },
      ];
    }

    return commonItems;
  };

  // Quick actions for teachers
  const getQuickActions = () => {
    if (role === "teacher") {
      return [
        {
          title: "Create Course",
          icon: Plus,
          onClick: () => console.log("Create course"),
        },
        {
          title: "New Assignment",
          icon: FileText,
          onClick: () => console.log("New assignment"),
        },
        {
          title: "Grade Papers",
          icon: GraduationCap,
          onClick: () => console.log("Grade papers"),
        },
        {
          title: "Send Message",
          icon: MessageSquare,
          onClick: () => console.log("Send message"),
        },
      ];
    }
    return [];
  };

  const mainNavItems = getMainNavItems();
  const quickActions = getQuickActions();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">EduPlatform</span>
            <span className="text-xs text-sidebar-foreground/60 capitalize">{role} Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {quickActions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((action) => (
                  <SidebarMenuItem key={action.title}>
                    <SidebarMenuButton onClick={action.onClick}>
                      <action.icon className="h-4 w-4" />
                      <span>{action.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={profile?.avatar_url || ""} alt={getDisplayName()} />
                    <AvatarFallback className="rounded-lg text-xs">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{getDisplayName()}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
