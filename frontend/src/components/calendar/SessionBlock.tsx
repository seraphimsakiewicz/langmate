import { Session } from "@/types/calendar";
import { X } from "lucide-react";
import Link from "next/link";

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
    return true;
  };

  const renderBookedSession = () => (
    <div
      className="absolute rounded p-[6px] border-2 border-session-booked font-medium text-session-booked transition-all"
      style={{
        left: "2px",
        right: "2px",
        top: "2px",
        bottom: "2px",
        minHeight: "72px",
        zIndex: 10,
      }}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Top row: Avatar + Time/Name on left, Close button on right */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-1 flex-1 min-w-0">
            <div className="w-[30px] h-[30px] bg-session-booked rounded-full hidden-below-medium flex-shrink-0"></div>
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
        </div>

        <div className="flex flex-row justify-between align-end">
          {/* Bottom row: Join Button on left */}
          {isSessionStartingSoon() && (
            <div className="flex justify-start mt-1">
              <Link
                href="#"
                className="bg-calendar-primary hover:bg-calendar-primary/90 text-white text-[12px] px-2 py-1 rounded-[5px] font-medium transition-colors cursor-pointer"
              >
                Join
              </Link>
            </div>
          )}

          {/* Close button - hidden 951px-1059px and on mobile (<950px) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) {
                onDelete(session.id);
              }
            }}
            className="text-session-booked w-[24px] h-[24px] p-[4px] ml-auto rounded-sm bg-calendar-primary/12 hover:text-session-booked/80 transition-colors cursor-pointer hover:bg-calendar-primary/20 hide-on-mobile hidden xl:flex items-center justify-center flex-shrink-0"
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );

  return renderBookedSession();
};
