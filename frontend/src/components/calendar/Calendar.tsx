import { useState, useEffect } from "react";
import { CalendarSidebar } from "./CalendarSidebar";
import { CalendarHeader } from "./CalendarHeader";
import { TimeGrid } from "./TimeGrid";
import { BookingModal } from "./BookingModal";
import { TopNav } from "../layout/TopNav";
import { Session, DayColumn } from "@/types/calendar";
import { dummySessions } from "@/data/sessionsData";
import { useMiniCalendar } from "@/hooks/useMiniCalendar";

export const Calendar = () => {
  // const [calendarDate, setCalendarDate] = useState(new Date());
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Session[]>(dummySessions);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [currentView, setCurrentView] = useState<
    "calendar" | "sessions" | "people"
  >("calendar");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userSetViewMode, setUserSetViewMode] = useState(false);
  const [userSetSidebarCollapsed, setUserSetSidebarCollapsed] = useState(false);
  const {
    selectedDate: calendarDate,
    handleDateSelect: setCalendarDate,
    ...restOfPropsForHeader
    /*   displayMonth,
    handleDisplayMonth,
    handleDateSelect,
    currentDate,
    startMonth,
    endMonth,
    shortUS,
    openPopper,
    handlePopper, */
  } = useMiniCalendar();

  // Auto-switch view mode and sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      // Handle view mode switching
      if (screenWidth < 951 && viewMode === "week") {
        setViewMode("day");
        setUserSetViewMode(false); // Reset user preference on mobile
      } else if (screenWidth >= 951 && viewMode === "day" && !userSetViewMode) {
        // Only auto-switch to week if user hasn't explicitly chosen day mode
        setViewMode("week");
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
  }, [viewMode, userSetViewMode, userSetSidebarCollapsed]);

  // Custom view mode handler that tracks user intent
  const handleViewModeChange = (newMode: "day" | "week") => {
    setViewMode(newMode);
    setUserSetViewMode(true); // Mark that user explicitly chose this mode
  };

  // Generate days based on current date and view mode
  const getDaysToShow = (date: Date, mode: "day" | "week"): DayColumn[] => {
    if (mode === "day") {
      // Show only the current day
      return [
        {
          date: date.toISOString().split("T")[0],
          dayName: date
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase(),
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
          dayName: currentDay
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase(),
          dayNumber: currentDay.getDate(),
          isToday: currentDay.toDateString() === new Date().toDateString(),
        });
      }
      return weekDays;
    }
  };

  const daysToShow = getDaysToShow(calendarDate, viewMode);

  const handleSessionBook = (newSession: Omit<Session, "id">) => {
    const slotOccupied = [...sessions].some(
      (session) =>
        newSession.date === session.date &&
        newSession.startTime === session.startTime
    );

    if (slotOccupied) return;

    const session: Session = {
      ...newSession,
      id: `session-${Date.now()}`,
    };
    setSessions((prev) => [...prev, session]);
  };

  const handleSessionUpdate = (
    sessionId: string,
    updates: Partial<Session>
  ) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session
      )
    );
  };

  const handleSessionDelete = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const renderMainContent = () => {
    switch (currentView) {
      case "calendar":
        return (
          <div className="flex h-full">
            <CalendarSidebar
              setOpenModal={setOpenModal}
              isCollapsed={isSidebarCollapsed}
            />

            <div className="flex-1 flex flex-col">
              <CalendarHeader
                calendarDate={calendarDate}
                setCalendarDate={setCalendarDate}
                daysToShow={daysToShow}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                {...restOfPropsForHeader}
              />

              <TimeGrid
                daysToShow={daysToShow}
                sessions={sessions}
                onSessionBook={handleSessionBook}
                onSessionUpdate={handleSessionUpdate}
                onSessionDelete={handleSessionDelete}
                viewMode={viewMode}
              />
            </div>
          </div>
        );
      case "sessions":
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-muted-foreground">
                Sessions
              </h2>
              <p className="text-muted-foreground mt-2">
                Session management coming soon
              </p>
            </div>
          </div>
        );
      case "people":
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-muted-foreground">
                People
              </h2>
              <p className="text-muted-foreground mt-2">
                People management coming soon
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav
        currentView={currentView}
        onViewChange={setCurrentView}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => {
          setIsSidebarCollapsed(!isSidebarCollapsed);
          setUserSetSidebarCollapsed(true); // Mark that user explicitly toggled sidebar
        }}
      />

      <div className="flex-1 overflow-hidden">{renderMainContent()}</div>

      <BookingModal
        onBook={handleSessionBook}
        weekDays={daysToShow}
        modalState={{ openModal, setOpenModal }}
      />
    </div>
  );
};
