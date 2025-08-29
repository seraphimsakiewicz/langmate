import { Session } from "@/types/calendar";
import { X } from "lucide-react";

interface SessionBlockProps {
  session: Session;
  onUpdate: (updates: Partial<Session>) => void;
  onDelete?: (sessionId: string) => void;
  viewMode?: "day" | "week";
}

export const SessionBlock = ({
  session,
  onDelete,
  viewMode = "week",
}: SessionBlockProps) => {
  const getStatusColor = () => {
    switch (session.status) {
      case "ongoing":
      case "upcoming":
        return "border-2 border-session-booked text-session-booked font-medium";
      case "booked":
        return "border-2 border-session-booked text-session-booked font-medium";
      case "pending":
        return "border-2 border-calendar-primary text-calendar-primary font-medium";
      default:
        return "border-2 border-session-booked text-session-booked font-medium";
    }
  };

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
      className={`absolute rounded p-[6px] ${getStatusColor()} transition-all`}
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
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="w-[30px] h-[30px] bg-session-booked rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {getInitials(session.participant)}
          </div>
          {/* Top row: Time and Close button */}
          <div className="flex justify-between items-start mb-2">
            {/* Time display - responsive */}
            <div className="leading-tight">
              {/* Full time range for screens ≥1515px */}
              <div className="text-session-time show-large-only">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </div>
              {/* Start time only for screens 1263-1514px */}
              {/*  <span className="text-session-time show-medium-only">
                {formatTime(session.startTime)}
              </span> */}
              {/* Start time for screens <≥1515px */}
              {/*    <span className="text-session-time show-below-medium">
                {formatTime(session.startTime)}
              </span> */}
              <div className="text-session-name font-medium truncate">
                {session.participant}
              </div>
            </div>
          </div>

          {/* Close button - hidden on mobile (<950px) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) {
                onDelete(session.id);
              }
            }}
            className="text-session-booked w-[24px] h-[24px] rounded-sm bg-calendar-primary/12 hover:text-session-booked/80 transition-colors ml-auto -mt-1 cursor-pointer hover:bg-calendar-primary/20 hide-on-mobile flex items-center justify-center"
          >
            <X className="w-4/5 h-4/5" />
          </button>
        </div>

        {/* Join Button - show when session is starting soon */}
        {isSessionStartingSoon() && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Joining session:", session.id);
            }}
            className="bg-session-booked hover:bg-session-booked/90 text-white text-sm px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex-shrink-0"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );

  // const renderOtherSession = () => (
  //   <div
  //     className={`absolute rounded p-[6px] ${getStatusColor()} transition-all`}
  //     style={{
  //       left: "2px",
  //       right: "2px",
  //       top: "2px",
  //       bottom: "2px",
  //       minHeight: "56px",
  //       zIndex: 10,
  //     }}
  //   >
  //     {/* Top row: Time and Close button */}
  //     <div className="flex justify-between items-start mb-2">
  //       {/* Time display - responsive */}
  //       <div className="flex-1 min-w-0">
  //         {/* Full time range for screens ≥1515px */}
  //         <span className="text-session-time font-medium leading-tight show-large-only">
  //           {formatTime(session.startTime)} - {formatTime(session.endTime)}
  //         </span>
  //         {/* Start time only for screens 1263-1514px */}
  //         <span className="text-session-time font-medium leading-tight show-medium-only">
  //           {formatTime(session.startTime)}
  //         </span>
  //         {/* Start time for screens <1263px */}
  //         <span className="text-session-time font-medium leading-tight show-below-medium">
  //           {formatTime(session.startTime)}
  //         </span>
  //       </div>

  //       {/* Close button - hidden on mobile (<950px) */}
  //       <button
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           if (onDelete) {
  //             onDelete(session.id);
  //           }
  //         }}
  //         className="text-session-booked hover:text-session-booked/70 transition-colors cursor-pointer hover:bg-gray-100 rounded flex-shrink-0 hide-on-mobile w-[26px] h-[26px] flex items-center justify-center"
  //       >
  //         <X className="w-4 h-4" />
  //       </button>
  //     </div>

  //     {/* Bottom row: Avatar and Name */}
  //     <div className="flex items-center gap-2">
  //       <div
  //         className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
  //           session.status === "booked"
  //             ? "bg-session-booked text-white"
  //             : "bg-white/20 text-current"
  //         }`}
  //       >
  //         {getInitials(session.participant)}
  //       </div>
  //       <span className="text-session-name font-medium truncate">
  //         {session.participant}
  //       </span>
  //     </div>
  //   </div>
  // );

  return renderBookedSession();
};
