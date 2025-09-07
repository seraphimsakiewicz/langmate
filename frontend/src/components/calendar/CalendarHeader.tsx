import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniCalendar } from "@/components/ui/mini-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CalendarHeaderProps {
  viewMode: "day" | "week";
  onViewModeChange: (mode: "day" | "week") => void;
  calendarDate: Date;
  displayMonth: Date;
  openPopper: boolean;
  handleDateSelect: (selectedDate: Date | undefined) => void;
  handleDisplayMonth: (displayMonth: Date) => void;
  handlePopper: (open: boolean) => void;
  currentDate: Date;
  startMonth: Date;
  endMonth: Date;
}

export const CalendarHeader = ({
  viewMode,
  onViewModeChange,
  calendarDate,
  displayMonth,
  handleDateSelect,
  handleDisplayMonth,
  handlePopper,
  currentDate,
  startMonth,
  endMonth,
  openPopper,
}: CalendarHeaderProps) => {
  const monthYear = calendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleTodayClick = () => {
    handleDateSelect(currentDate);
  };

  const handlePrevPeriod = () => {
    const newDate = new Date(calendarDate);
    if (viewMode === "day") {
      newDate.setDate(calendarDate.getDate() - 1);
    } else {
      newDate.setDate(calendarDate.getDate() - 7);
    }
    handleDateSelect(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(calendarDate);
    if (viewMode === "day") {
      newDate.setDate(calendarDate.getDate() + 1);
    } else {
      newDate.setDate(calendarDate.getDate() + 7);
    }
    handleDateSelect(newDate);
  };

  return (
    <div className="border-b border-calendar-border">
      {/* Top header with month/year and controls */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hover:cursor-pointer"
            onClick={handleTodayClick}
          >
            Today
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              size="sm"
              onClick={handlePrevPeriod}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover open={openPopper} onOpenChange={handlePopper}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-xl font-semibold hover:bg-accent hover:cursor-pointer"
                >
                  {monthYear}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <MiniCalendar
                  mode="single"
                  selected={calendarDate}
                  disabled={{ before: currentDate }}
                  startMonth={startMonth}
                  endMonth={endMonth}
                  onMonthChange={handleDisplayMonth}
                  month={displayMonth}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="sm"
              className="hover:cursor-pointer"
              onClick={handleNextPeriod}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="hover:cursor-pointer"
            variant={viewMode === "day" ? "default" : "ghost"}
            onClick={() => onViewModeChange("day")}
          >
            Day
          </Button>
          <Button
            size="sm"
            variant={viewMode === "week" ? "default" : "ghost"}
            onClick={() => onViewModeChange("week")}
            className="hidden md:inline-flex hover:cursor-pointer"
          >
            Week
          </Button>
        </div>
      </div>
    </div>
  );
};
