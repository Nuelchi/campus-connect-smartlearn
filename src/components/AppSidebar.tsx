
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
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
  ClipboardList,
  MessageSquare,
  Bell,
  GraduationCap,
} from "lucide-react";

export function AppSidebar() {
  const { user, profile, signOut, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Navigation handler with proper URL construction
  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
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

  const mainNavItems = getMainNavItems();

  // Improved path matching logic
  const isActive = (url: string) => {
    const currentPath = location.pathname + location.search;
    console.log("Checking if active:", url, "vs current:", currentPath);
    
    // Handle exact dashboard match (no query params)
    if (url === "/dashboard") {
      return currentPath === "/dashboard" || currentPath === "/dashboard?";
    }
    
    // Handle URLs with query parameters
    if (url.includes("?")) {
      return currentPath === url;
    }
    
    return false;
  };

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
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.url)}
                    isActive={isActive(item.url)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleNavigation("/dashboard?section=notifications")}>
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleNavigation("/dashboard?section=help")}>
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleNavigation("/dashboard?section=settings")}>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
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
                <DropdownMenuItem onClick={() => handleNavigation("/dashboard?section=account")}>
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
