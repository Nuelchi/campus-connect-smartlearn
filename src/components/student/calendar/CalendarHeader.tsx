
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface CalendarHeaderProps {
  currentMonthEventsCount: number;
}

export default function CalendarHeader({ currentMonthEventsCount }: CalendarHeaderProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Academic Calendar
            </h1>
            <p className="text-blue-100">
              Stay on top of important dates, holidays, and academic events! ✨
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentMonthEventsCount}</div>
            <div className="text-sm text-blue-100">Events This Month</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
