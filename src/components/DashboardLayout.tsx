import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardNavbar from "./DashboardNavbar";
import { AppSidebar } from "./AppSidebar";
interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}
export default function DashboardLayout({
  title,
  subtitle,
  children
}: DashboardLayoutProps) {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <DashboardNavbar title={title} subtitle={subtitle} />
          
        </SidebarInset>
      </div>
    </SidebarProvider>;
}