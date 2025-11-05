import { BookingModal } from "@/components/calendar/BookingModal";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { TimeGrid } from "@/components/calendar/TimeGrid";

export default function CalendarPage() {
  return (
    <div className="flex h-full">
      <CalendarSidebar />
      <div className="flex-1 flex flex-col">
        <CalendarHeader />
        <TimeGrid />
        <BookingModal />
      </div>
    </div>
  );
}
