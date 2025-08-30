import { Session } from "@/types/calendar";
import { X } from "lucide-react";

interface SessionBlockProps {
  session: Session;
  onUpdate: (updates: Partial<Session>) => void;
  onDelete?: (sessionId: string) => void;
  viewMode?: "day" | "week";
}

export const SessionBlock = ({ session, onDelete }: SessionBlockProps) => {
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isSessionStartingSoon = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Only check sessions for today
    if (session.date !== today) return false;

    const [startHour, startMinute] = session.startTime.split(":").map(Number);
    const sessionStart = new Date();
    sessionStart.setHours(startHour, startMinute, 0, 0);

    const timeDiff = sessionStart.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Session starts within 60 minutes and hasn't started yet
    return minutesDiff >= 0 && minutesDiff <= 60;
  };

  const renderBookedSession = () => (
    <div
      className="absolute rounded p-[6px] border-2 border-session-booked text-session-booked font-medium transition-all"
      style={{
        left: "2px",
        right: "2px",
        top: "2px",
        bottom: "2px",
        minHeight: "56px",
        zIndex: 10,
      }}
    >
      {/* Bottom row: Avatar + Name OR Join Button */}
      <div className="flex flex-col items-stretch justify-between gap-2">
        {/* Avatar and Name */}
        <div className="flex items-start flex-1 min-w-0">
          <div className="w-[30px] h-[30px]  bg-session-booked rounded-full hidden-below-medium"></div>
          {/* Top row: Time and Close button */}
          <div className="flex ml-1 justify-between items-start mb-2">
            {/* Time display - responsive */}
            <div className="leading-tight">
              <div className="text-session-time">
                <span className="show-large-only">
                  {formatTime(session.startTime)} -{" "}
                  {formatTime(session.endTime)}
                </span>
                <span className="show-medium-only">
                  {formatTime(session.startTime)}
                </span>
                <span className="show-below-medium">
                  {formatTime(session.startTime)}
                </span>
              </div>
              <div className="text-session-name font-medium truncate">
                {session.participant}
              </div>
            </div>
          </div>

          {/* Close button - hidden 951px-1059px and on mobile (<950px) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) {
                onDelete(session.id);
              }
            }}
            className="text-session-booked w-[18px] h-[18px] p-[4px] rounded-sm bg-calendar-primary/12 hover:text-session-booked/80 transition-colors ml-auto -mt-1 cursor-pointer hover:bg-calendar-primary/20 hide-on-mobile hidden xl:flex items-center justify-center"
          >
            <X  />
          </button>
        </div>

        {/* Join Button - show when session is starting soon */}
        {isSessionStartingSoon() && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Joining session:", session.id);
            }}
            className="bg-session-booked hover:bg-session-booked/90 text-white text-[12px] px-2 py-1 rounded font-medium transition-colors cursor-pointer flex-shrink-0"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );

  return renderBookedSession();
};
