
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, BookOpen, FileText, Settings } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline";
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export default function QuickActions({ actions, title = "Quick Actions" }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              className="h-auto min-h-[100px] p-4 flex flex-col items-center justify-center gap-3 text-center overflow-hidden"
              onClick={action.onClick}
            >
              <div className="flex-shrink-0">
                {action.icon}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="font-medium text-sm leading-tight break-words">{action.title}</span>
                <span className="text-xs text-muted-foreground leading-tight break-words">{action.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
