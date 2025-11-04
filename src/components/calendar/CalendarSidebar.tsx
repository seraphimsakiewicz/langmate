"use client";

import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/stores/calendar-store";

export const CalendarSidebar = () => {
  const { setOpenModal, isSidebarCollapsed } = useCalendarStore();

  // Don't render sidebar at all when collapsed
  if (isSidebarCollapsed) {
    return null;
  }

  return (
    <div className="w-64 bg-calendar-sidebar border-r border-calendar-border h-full flex flex-col">
      {/* Book a session button */}
      <div className="p-4">
        <Button
          onClick={() => setOpenModal(true)}
          className="w-full bg-session-booked hover:bg-session-booked/90 text-white rounded-lg font-medium"
        >
          + Book a session
        </Button>
      </div>
    </div>
  );
};
