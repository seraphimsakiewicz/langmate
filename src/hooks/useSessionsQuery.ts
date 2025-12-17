"use client";

import { useQuery } from "@tanstack/react-query";
import type { Profile, Session } from "@/types/calendar";

type SessionsResponse = {
  sessions: Session[];
  profile: Profile;
};

const fetchSessions = async (): Promise<SessionsResponse> => {
  const res = await fetch("/api/sessions");
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.error || "Failed to load sessions");
  }

  return body;
};

export const useSessionsQuery = () =>
  useQuery<SessionsResponse>({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    staleTime: 5_000,
  });
