import { DateTime } from "luxon";
import type { Profile, Session } from "@/types/calendar";

type SessionsResult = {
  sessions: Session[];
  profile: Profile | null;
  error?: string;
  status?: number;
};

export const cleanSession = (session: any, timezone: string): Session => {
  const start = DateTime.fromISO(session.start_time, { zone: "utc" }).setZone(timezone);
  const end = start.plus({ minutes: 30 });

  return {
    id: session.id,
    startTime: start.toFormat("HH:mm"),
    endTime: end.toFormat("HH:mm"),
    // toISODate can return null for invalid dates; fall back to formatted string for type safety.
    date: start?.toISODate() ?? start.toFormat("yyyy-LL-dd"),
    createdAt: session.created_at,
    user_one_id: session.user_one_id,
    user_two_id: session.user_two_id,
    language_one_id: session.language_one_id,
    language_two_id: session.language_two_id,
    user_one_name: session.user_one_name,
    user_two_name: session.user_two_name,
  };
};

export const getProfileAndSessions = async (supabase: any): Promise<SessionsResult> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { sessions: [], profile: null, error: userError.message, status: 500 };
  }

  if (!user) {
    return { sessions: [], profile: null, error: "Unauthorized", status: 401 };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("timezone, id, native_language_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { sessions: [], profile: null, error: "Failed to fetch profile", status: 500 };
  }

  const filter = [
    `user_one_id.eq.${profile.id}`,
    `user_two_id.eq.${profile.id}`,
    `and(user_one_id.not.is.null,user_two_id.is.null,language_two_id.eq.${profile.native_language_id})`,
  ].join(",");

  const { data: fetchedSessions, error: sessionsError } = await supabase
    .from("sessions")
    .select(
      `*, 
        user_one_name:public_profiles!sessions_user_one_id_fkey(first_name,last_name), 
        user_two_name:public_profiles!sessions_user_two_id_fkey(first_name,last_name)`
    )
    .or(filter)
    .order("start_time", { ascending: true });

  if (sessionsError) {
    return { sessions: [], profile, error: sessionsError.message, status: 500 };
  }

  const sessions = (fetchedSessions ?? []).map((session: any) =>
    cleanSession(session, profile.timezone)
  );

  return { sessions, profile, status: 200 };
};
