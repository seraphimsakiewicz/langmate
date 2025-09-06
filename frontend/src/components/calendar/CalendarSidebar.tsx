import { Button } from "@/components/ui/button";
import { Session } from "@/types/calendar";

interface CalendarSidebarProps {
  setOpenModal: (state: boolean) => void;
  ongoingSession?: Session;
  isCollapsed: boolean;
}

export const CalendarSidebar = ({
  setOpenModal,
  ongoingSession,
  isCollapsed,
}: CalendarSidebarProps) => {
  const timeRemaining = ongoingSession ? "25m" : null;

  // Don't render sidebar at all when collapsed
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-64 bg-calendar-sidebar border-r border-calendar-border h-full flex flex-col">
      {/* Book a session button */}
      <div className="p-4">
        <Button
          onClick={() => setOpenModal(true)}
          className="w-full bg-session-booked hover:bg-session-booked/90 text-white rounded-lg font-medium"
        >
          + Book a session
        </Button>
      </div>

      {/* Upcoming sessions section */}
      <div className="px-4 mb-6">
        <div className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          UPCOMING
        </div>
        <div className="text-sm text-muted-foreground">
          No upcoming sessions
        </div>
      </div>

      {/* Ongoing session */}
      {ongoingSession && (
        <div className="px-4 mb-6">
          <div className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            ONGOING
          </div>
          <div className="bg-white border border-calendar-border rounded-lg p-3">
            <div className="text-sm font-medium mb-1">
              {ongoingSession.startTime}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-session-booked rounded-full flex items-center justify-center text-white text-xs font-medium">
                J
              </div>
              <span className="text-sm text-foreground">
                {ongoingSession.participant}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {timeRemaining}
            </div>
            <Button
              size="sm"
              className="w-full bg-session-booked hover:bg-session-booked/90 text-white text-xs"
            >
              Join
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
