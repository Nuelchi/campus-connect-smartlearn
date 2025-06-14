
import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavigationItem } from "./navigationConfig";

interface SidebarNavigationProps {
  items: NavigationItem[];
  groupLabel: string;
}

export function SidebarNavigation({ items, groupLabel }: SidebarNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

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
    <SidebarGroup>
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
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
  );
}
