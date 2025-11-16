"use client";

import type { Session, Profile } from "@/types/calendar";
import { useEffect, type ReactNode } from "react";
import { useCalendarStore } from "@/stores/calendar-store";

interface CalendarInitializerProps {
  profile: Profile | null;
  sessions: Session[];
  children: ReactNode;
}

export const CalendarInitializer = ({ profile, sessions, children }: CalendarInitializerProps) => {
  if (!profile) return;
  useEffect(() => {
    const { profile: currentProfile, setProfile } = useCalendarStore.getState();
    if (profile.id === currentProfile.id) return;
    setProfile(profile);
  }, [profile?.id]);

  useEffect(() => {
    // hydrate sessions into the store
    useCalendarStore.setState({ sessions: sessions ?? [] });
  }, [sessions]);

  return <>{children}</>;
};
