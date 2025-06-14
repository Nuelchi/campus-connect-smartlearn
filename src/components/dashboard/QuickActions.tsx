
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
              className="h-auto p-4 flex flex-col items-center gap-2 text-center"
              onClick={action.onClick}
            >
              {action.icon}
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
