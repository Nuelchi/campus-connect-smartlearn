
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { getMainNavItems, supportNavItems } from "./sidebar/navigationConfig";

export function AppSidebar() {
  const { role } = useAuth();

  const mainNavItems = getMainNavItems(role);

  return (
    <Sidebar>
      <SidebarHeader role={role} />

      <SidebarContent>
        <SidebarNavigation items={mainNavItems} groupLabel="Navigation" />
        <SidebarNavigation items={supportNavItems} groupLabel="Support" />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
