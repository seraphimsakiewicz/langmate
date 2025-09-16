"use client";

import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { TimeGrid } from "@/components/calendar/TimeGrid";

export default function CalendarPage() {
  return (
    <div className="flex h-full">
      <CalendarSidebar setOpenModal={setOpenModal} isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <CalendarHeader
          calendarMode={calendarMode}
          calendarDate={calendarDate}
          onCalendarModeChange={handleViewModeChange}
          {...restOfPropsForHeader}
        />
        <TimeGrid
          daysToShow={daysToShow}
          sessions={sessions}
          onSessionBook={handleSessionBook}
          onSessionUpdate={handleSessionUpdate}
          onSessionDelete={handleSessionDelete}
          calendarMode={calendarMode}
        />
      </div>
    </div>
  );
}
