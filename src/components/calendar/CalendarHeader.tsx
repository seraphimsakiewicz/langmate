"use client";

import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniCalendar } from "@/components/ui/mini-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCalendarStore } from "@/stores/calendar-store";
import { useMiniCalendar } from "@/hooks/useMiniCalendar";
import { DateTime } from "luxon";

export const CalendarHeader = () => {
  const { calendarDate, setCalendarDate, calendarMode, setCalendarMode, profile } =
    useCalendarStore();
  const safeTimezone = profile.timezone ?? "UTC";

  const {
    displayMonth,
    handleDateSelect,
    handleDisplayMonth,
    handlePopper,
    startMonth,
    endMonth,
    openPopper,
  } = useMiniCalendar({
    initialDate: calendarDate,
    onDateChange: setCalendarDate,
    timezone: safeTimezone,
  });

  const calendarDateTime = DateTime.fromJSDate(calendarDate)
    .setZone(safeTimezone, { keepLocalTime: true })
    .startOf("day");
  const currentZonedDate = DateTime.now().setZone(safeTimezone).startOf("day");

  const monthYear = calendarDateTime.toFormat("LLLL yyyy");

  const handleTodayClick = () => {
    handleDateSelect(currentZonedDate.toJSDate());
  };

  const handlePrevPeriod = () => {
    const offset = calendarMode === "day" ? { days: 1 } : { days: 7 };
    const newDate = calendarDateTime.minus(offset).toJSDate();
    handleDateSelect(newDate);
  };

  const handleNextPeriod = () => {
    const offset = calendarMode === "day" ? { days: 1 } : { days: 7 };
    const newDate = calendarDateTime.plus(offset).toJSDate();
    handleDateSelect(newDate);
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
            <Button variant="outline" size="sm" onClick={handlePrevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover open={openPopper} onOpenChange={handlePopper}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-xl font-semibold hover:bg-accent">
                  {monthYear}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <MiniCalendar
                  mode="single"
                  selected={calendarDate}
                  disabled={{ before: currentZonedDate.toJSDate() }}
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
            <Button variant="outline" size="sm" onClick={handleNextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={calendarMode === "day" ? "default" : "ghost"}
            onClick={() => setCalendarMode("day")}
            className={`${calendarMode === "day" && "pointer-events-none"}`}
          >
            Day
          </Button>
          <Button
            size="sm"
            variant={calendarMode === "week" ? "default" : "ghost"}
            onClick={() => setCalendarMode("week")}
            className={`${calendarMode === "week" && "pointer-events-none"} hidden md:inline-flex`}
          >
            Week
          </Button>
        </div>
      </div>
    </div>
  );
};
