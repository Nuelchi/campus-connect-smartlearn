
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "ghost"}
            className="w-full h-12 justify-start gap-3 px-3 py-2 text-left hover:bg-gray-50 border border-gray-100 rounded-lg"
            onClick={action.onClick}
          >
            <div className="flex-shrink-0 text-gray-600">
              {action.icon}
            </div>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="font-medium text-sm text-gray-900 truncate w-full">{action.title}</span>
              <span className="text-xs text-gray-500 truncate w-full">{action.description}</span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
