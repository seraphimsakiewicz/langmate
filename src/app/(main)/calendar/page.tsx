import { BookingModal } from "@/components/calendar/BookingModal";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { CalendarInitializer } from "@/components/calendar/CalendarInitializer";
import { createClient } from "@/lib/supabase/server";

export default async function CalendarPage() {
  const supabase = await createClient();

  let timezone = "UTC";
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("timezone")
      .eq("id", user.id)
      .single();

    if (profile?.timezone) {
      timezone = profile.timezone;
    }
  }

  return (
    <CalendarInitializer timezone={timezone}>
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
