"use client";

import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { MiniCalendarProps, useMiniCalendar } from "@/hooks/useMiniCalendar";
import { useCalendarStore } from "@/stores/calendar-store";
import { DayColumn } from "@/types/calendar";

export default function CalendarPage() {
  const {
    setOpenModal,
    isSidebarCollapsed,
    calendarMode,
    setCalendarMode,
    sessions,
    addSession,
    updateSession,
    deleteSession,
  } = useCalendarStore();

  const { selectedDate: calendarDate, ...restOfPropsForHeader }: MiniCalendarProps =
    useMiniCalendar();

  // Generate days based on current date and view mode
  const getDaysToShow = (date: Date, mode: "day" | "week"): DayColumn[] => {
    if (mode === "day") {
      // Show only the current day
      return [
        {
          date: date.toISOString().split("T")[0],
          dayName: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
          dayNumber: date.getDate(),
          isToday: date.toDateString() === new Date().toDateString(),
        },
      ];
    } else {
      // Show the full week
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
      startOfWeek.setDate(diff);

      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);

        weekDays.push({
          date: currentDay.toISOString().split("T")[0],
          dayName: currentDay.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
          dayNumber: currentDay.getDate(),
          isToday: currentDay.toDateString() === new Date().toDateString(),
        });
      }
      return weekDays;
    }
  };

  const daysToShow = getDaysToShow(calendarDate, calendarMode);

  return (
    <div className="flex h-full">
      <CalendarSidebar setOpenModal={setOpenModal} isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <CalendarHeader
          calendarMode={calendarMode}
          calendarDate={calendarDate}
          onCalendarModeChange={setCalendarMode}
          {...restOfPropsForHeader}
        />
        <TimeGrid
          daysToShow={daysToShow}
          sessions={sessions}
          onSessionBook={addSession}
          onSessionUpdate={updateSession}
          onSessionDelete={deleteSession}
          calendarMode={calendarMode}
        />
      </div>
    </div>
  );
}
