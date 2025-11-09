"use client";

import type { Session } from "@/types/calendar";
import { useEffect, type ReactNode } from "react";
import { useCalendarStore } from "@/stores/calendar-store";

interface CalendarInitializerProps {
  timezone: string;
  sessions: Session[];
  children: ReactNode;
}

export const CalendarInitializer = ({ timezone, sessions, children }: CalendarInitializerProps) => {
  useEffect(() => {
    if (!timezone) return;
    const { timezone: currentTimezone, setTimezone } = useCalendarStore.getState();
    if (timezone === currentTimezone) return;
    setTimezone(timezone);
  }, [timezone]);

  useEffect(() => {
    // hydrate sessions into the store
    useCalendarStore.setState({ sessions: sessions ?? [] });
  }, [sessions]);

  return <>{children}</>;
};
