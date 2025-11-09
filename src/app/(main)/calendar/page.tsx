import { BookingModal } from "@/components/calendar/BookingModal";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { CalendarInitializer } from "@/components/calendar/CalendarInitializer";
import { createClient } from "@/lib/supabase/server";
import { DateTime } from "luxon";

export default async function CalendarPage() {
  const supabase = await createClient();

  let timezone = "UTC";
  let sessions = [];
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sessionsCleaner = (session: any, timeZone: string) => {
    const newSession = { ...session };
    delete newSession.created_at;
    delete newSession.updated_at;
    const start = DateTime.fromISO(session.start_time, { zone: "utc" }).setZone(timeZone);
    const end = start.plus({ minutes: 30 });
    delete newSession.start_time;
    newSession.startTime = start.toFormat("HH:mm");
    newSession.endTime = end.toFormat("HH:mm");
    newSession.date = start.toISODate();
    newSession.participant = session.user_two_id ? "Partner" : "Pending partner";
    return newSession;
  };

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("timezone")
      .eq("id", user.id)
      .single();

    if (profile?.timezone) {
      timezone = profile.timezone;

      const { data: fetchedSessions, error } = await supabase
        .from("sessions")
        .select("*")
        .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`);
      if (!error) {
        sessions = fetchedSessions?.map((session) => sessionsCleaner(session, profile.timezone));
        console.log(`Sessions for user.id ${user.id}`, sessions);
      }
    }
  }

  return (
    <CalendarInitializer timezone={timezone} sessions={sessions}>
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
