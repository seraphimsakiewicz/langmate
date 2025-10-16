"use client";

import {
  Calendar as CalendarIcon,
  Users as UsersIcon,
  User as UserIcon,
  Menu as MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCalendarStore } from "@/stores/calendar-store";
import { MiniCalendarProps, useMiniCalendar } from "@/hooks/useMiniCalendar";
import { useEffect } from "react";

interface NavItemProps {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
  href: string;
}
export const SecondNav = () => {
  const pathName = usePathname();
  const {
    setCalendarMode,
    calendarMode,
    setUserSetViewMode,
    setUserSetSidebarCollapsed,
    setIsSidebarCollapsed,
    isSidebarCollapsed,
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    setUserSetSidebarCollapsed(true);
  };

  const getCurrentView = () => {
    if (pathName.includes("/calendar")) return "calendar";
    if (pathName.includes("/sessions")) return "sessions";
    if (pathName.includes("/people")) return "people";
  };

  const currentView = getCurrentView();
  return (
    <div className="border-b border-calendar-border bg-white">
      <div className="py-3">
        <div className="flex items-center space-x-1">
          {/* {currentView === "calendar" && ( */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={`p-2 mr-2 ${currentView === "calendar" ? "flex" : "invisible"}`}
          >
            <MenuIcon className="size-[1.5rem]" />
          </Button>
          {/* )} */}

          <NavItem href="/calendar" isActive={currentView === "calendar"}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </NavItem>
          <NavItem href="/sessions" isActive={currentView === "sessions"}>
            <UsersIcon className="mr-2 h-4 w-4" />
            Sessions
          </NavItem>
          <NavItem href="/people" isActive={currentView === "people"}>
            <UserIcon className="mr-2 h-4 w-4" />
            People
          </NavItem>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ isActive, children, href, className = "" }: NavItemProps) => (
  <Link
    href={href}
    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all px-4 py-2 ${className} ${
      isActive
        ? "bg-primary/10 text-black pointer-events-none font-medium border-b-2 border-primary"
        : "text-muted-foreground hover:text-foreground hover:underline"
    }`}
  >
    {children}
  </Link>
);
