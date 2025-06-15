
import { Badge } from "@/components/ui/badge";

interface UnreadIndicatorProps {
  count: number;
  className?: string;
}

export default function UnreadIndicator({ count, className = "" }: UnreadIndicatorProps) {
  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={`h-5 w-5 flex items-center justify-center p-0 text-xs ${className}`}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
