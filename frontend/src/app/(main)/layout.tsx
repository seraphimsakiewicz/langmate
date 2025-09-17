"use client";

import { useEffect } from "react";
import { Session, DayColumn } from "@/types/calendar";
import { dummySessions } from "@/data/sessionsData";
import { MiniCalendarProps, useMiniCalendar } from "@/hooks/useMiniCalendar";
import { Header } from "@/components/layout/header";
import { SecondNav } from "@/components/layout/second-nav";
import { BookingModal } from "@/components/calendar/BookingModal";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { useCalendarStore } from "@/stores/calendar-store";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    setCalendarMode,
    calendarMode,
    setUserSetViewMode,
    setIsSidebarCollapsed,
    userSetViewMode,
    userSetSidebarCollapsed,
  } = useCalendarStore();
  // Auto-switch view mode and sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      // Handle view mode switching
      if (screenWidth < 951 && calendarMode === "week") {
        setCalendarMode("day");
        setUserSetViewMode(false); // Reset user preference on mobile
      } else if (screenWidth >= 951 && calendarMode === "day" && !userSetViewMode) {
        // Only auto-switch to week if user hasn't explicitly chosen day mode
        setCalendarMode("week");
      }

      // Handle sidebar collapse/expand
      if (screenWidth <= 950) {
        // Always collapse sidebar on small screens
        setIsSidebarCollapsed(true);
      } else if (screenWidth >= 951 && !userSetSidebarCollapsed) {
        // Auto-expand sidebar on larger screens unless user manually collapsed it
        setIsSidebarCollapsed(false);
      }
    };

    // Set initial view mode based on screen size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calendarMode, userSetViewMode, userSetSidebarCollapsed]);

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-hidden">
          <div className="flex flex-col h-screen bg-background">
            <SecondNav />

            <div className="flex-1 overflow-hidden">{children}</div>
            <BookingModal />
          </div>
        </main>
      </div>
    </div>
  );
}
