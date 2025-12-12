import { BookingModal } from "@/components/calendar/BookingModal";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { CalendarInitializer } from "@/components/calendar/CalendarInitializer";
import { createClient } from "@/lib/supabase/server";
import { DateTime } from "luxon";
import { Profile } from "@/types/calendar";

export default async function CalendarPage() {
  const supabase = await createClient();

  let sessions = [];
  let profile: Profile | null = null;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sessionsCleaner = (session: any, timezone: string) => {
    const newSession = { ...session };
    newSession.createdAt = session.created_at;
    delete newSession.created_at;
    delete newSession.updated_at;
    const start = DateTime.fromISO(session.start_time, { zone: "utc" }).setZone(timezone);
    delete newSession.start_time;
    newSession.startTime = start.toFormat("HH:mm");
    newSession.date = start.toISODate();
    return newSession;
  };

  if (user) {
    const { data: fetchedProfile, error } = await supabase
      .from("profiles")
      .select("timezone, id, native_language_id")
      .eq("id", user.id)
      .single();
    if (!fetchedProfile || error) return;

    const filter = [
      `user_one_id.eq.${fetchedProfile.id}`, // sessions user created
      `user_two_id.eq.${fetchedProfile.id}`, // sessions user joined
      `and(user_one_id.not.is.null,user_two_id.is.null,language_two_id.eq.${fetchedProfile.native_language_id})`, // open sessions waiting for someone
    ].join(",");

    // need to figure out why join is only poplating user's own name, and not name of different
    // user's id.
    const { data: fetchedSessions, error: sessionsError } = await supabase
      .from("sessions")
      .select(
        `*, 
        user_one_name:public_profiles!sessions_user_one_id_fkey(first_name), 
        user_two_name:public_profiles!sessions_user_two_id_fkey(first_name)`
      )
      .or(filter);
    if (sessionsError || !fetchedProfile) return;
    console.log("fetchedSessions", fetchedSessions);
    sessions = fetchedSessions?.map((session) => sessionsCleaner(session, fetchedProfile.timezone));
    profile = fetchedProfile;
  }

  return (
    <CalendarInitializer profile={profile} sessions={sessions}>
      <div className="flex h-full">
        <CalendarSidebar />
        <div className="flex-1 flex flex-col">
          <CalendarHeader />
          <TimeGrid />
          <BookingModal />
        </div>
      </div>
    </CalendarInitializer>
  );
}
