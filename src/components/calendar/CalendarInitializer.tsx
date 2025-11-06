"use client";

import { useEffect, type ReactNode } from "react";
import { useCalendarStore } from "@/stores/calendar-store";

interface CalendarInitializerProps {
  timezone: string;
  children: ReactNode;
}

export const CalendarInitializer = ({ timezone, children }: CalendarInitializerProps) => {
  useEffect(() => {
    if (!timezone) return;
    const { timezone: currentTimezone, setTimezone } = useCalendarStore.getState();
    if (timezone === currentTimezone) return;
    setTimezone(timezone);
  }, [timezone]);

  return <>{children}</>;
};
