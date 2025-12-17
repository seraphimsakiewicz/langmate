import { BookingModal } from "@/components/calendar/BookingModal";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { CalendarInitializer } from "@/components/calendar/CalendarInitializer";
import { createClient } from "@/lib/supabase/server";
import { getProfileAndSessions } from "@/lib/sessions";

export default async function CalendarPage() {
  const supabase = await createClient();

  const { sessions, profile } = await getProfileAndSessions(supabase);
  if (!profile) return null;

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
