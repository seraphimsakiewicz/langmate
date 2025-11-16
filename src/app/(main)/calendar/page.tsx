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
    delete newSession.created_at;
    delete newSession.updated_at;
    const start = DateTime.fromISO(session.start_time, { zone: "utc" }).setZone(timezone);
    const end = start.plus({ minutes: 30 });
    delete newSession.start_time;
    newSession.startTime = start.toFormat("HH:mm");
    newSession.endTime = end.toFormat("HH:mm");
    newSession.date = start.toISODate();
    return newSession;
  };

  if (user) {
    const { data: fetchedProfile, error } = await supabase
      .from("profiles")
      .select("timezone, id")
      .eq("id", user.id)
      .single();
    if (!fetchedProfile || error) return;

    const filter = [
      `user_one_id.eq.${fetchedProfile.id}`, // sessions user created
      `user_two_id.eq.${fetchedProfile.id}`, // sessions user joined
      `and(user_one_id.not.is.null,user_two_id.is.null)`, // open sessions waiting for someone
    ].join(",");

    const { data: fetchedSessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("*")
      .or(filter);
    if (sessionsError || !fetchedProfile) return;
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
