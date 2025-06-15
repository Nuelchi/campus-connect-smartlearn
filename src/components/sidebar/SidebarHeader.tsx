
import { SidebarHeader as BaseSidebarHeader } from "@/components/ui/sidebar";
import { Book } from "lucide-react";

interface SidebarHeaderProps {
  role: string | null;
}

export function SidebarHeader({ role }: SidebarHeaderProps) {
  return (
    <BaseSidebarHeader className="border-b border-sidebar-border">
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Book className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">SmartLearn</span>
          <span className="text-xs text-sidebar-foreground/60 capitalize">{role} Portal</span>
        </div>
      </div>
    </BaseSidebarHeader>
  );
}
