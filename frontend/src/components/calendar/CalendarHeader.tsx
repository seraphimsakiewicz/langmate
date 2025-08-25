import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DayColumn } from "@/types/calendar";
import { useState } from "react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onDateSelect: (date: Date) => void;
  daysToShow: DayColumn[];
  viewMode: "day" | "week";
  onViewModeChange: (mode: "day" | "week") => void;
}

export const CalendarHeader = ({
  currentDate,
  onPrevPeriod,
  onNextPeriod,
  onDateSelect,
  viewMode,
  onViewModeChange,
}: CalendarHeaderProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Check if current period contains today
  const today = new Date();

  const handleTodayClick = () => {
    onDateSelect(today);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
      setIsDatePickerOpen(false);
    }
  };

  return (
    <div className="border-b border-calendar-border">
      {/* Top header with month/year and controls */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleTodayClick}>
            Today
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onPrevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-xl font-semibold hover:bg-accent"
                >
                  {monthYear}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="sm" onClick={onNextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === "day" ? "default" : "ghost"}
            onClick={() => onViewModeChange("day")}
          >
            Day
          </Button>
          <Button
            size="sm"
            variant={viewMode === "week" ? "default" : "ghost"}
            onClick={() => onViewModeChange("week")}
          >
            Week
          </Button>
        </div>
      </div>
    </div>
  );
};
