import React, { useState } from "react";
import { Session } from "@/types/calendar";
import { X } from "lucide-react";
import Link from "next/link";

type SessionMode =
  | "empty"
  | "hover"
  | "pending"
  | "booked"
  | "cancel-confirmation";

interface SessionBlockProps {
  mode: SessionMode;
  session?: Session;
  slotTime?: string;
  onUpdate?: (updates: Partial<Session>) => void;
  onDelete?: (sessionId: string) => void;
  onBook?: () => void;
  onRemovePending?: () => void;
  viewMode?: "day" | "week";
}

// Shared container component that naturally fills the grid cell
const SessionContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`h-full w-full rounded p-[6px] font-medium transition-all ${className}`}
  >
    {children}
  </div>
);

export const SessionBlock = ({
  mode,
  session,
  slotTime,
  onDelete,
  onBook,
  onRemovePending,
}: SessionBlockProps) => {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
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
    if (!session) return false;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Only check sessions for today
    if (session.date !== today) return false;

    const [startHour, startMinute] = session.startTime.split(":").map(Number);
    const sessionStart = new Date();
    sessionStart.setHours(startHour, startMinute, 0, 0);

    // Session starts within 60 minutes and hasn't started yet
    return true;
  };

  const renderEmpty = () => null;

  const renderHover = () => (
    <SessionContainer className="border border-calendar-hover text-primary">
      <div className="flex items-center justify-center h-full">
        <span className="text-md font-medium">{slotTime}</span>
      </div>
    </SessionContainer>
  );

  const renderPending = () => (
    <SessionContainer className="bg-white border-1 border-calendar-primary text-xs">
      <div className="flex flex-col justify-between h-full">
        <div className="flex gap-1 mb-1 h-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook?.();
            }}
            className="bg-calendar-primary text-white text-[12px] px-2 py-1 rounded font-medium hover:bg-calendar-primary/90 transition-colors flex-1 cursor-pointer"
          >
            Book
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemovePending?.();
          }}
          className="h-8/10 border border-calendar-primary text-calendar-primary text-[12px] px-2 py-1 rounded font-medium hover:bg-calendar-primary/5 transition-colors cursor-pointer"
        >
          Remove
        </button>
      </div>
    </SessionContainer>
  );

  const renderCancelConfirmation = () => (
    <SessionContainer className="bg-red-600 p-0 overflow-hidden">
      {/* Confirmation text */}
      <div className="text-white text-center">Cancel?</div>

      {/* Buttons row */}
      <div>
        <button
          className="text-white"
          onClick={(e) => {
            e.stopPropagation();
            setIsConfirmingCancel(false);
          }}
        >
          No
        </button>
      </div>
      <div>
        <button
          className="text-red-300"
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete && session) {
              onDelete(session.id);
            }
          }}
        >
          Yes
        </button>
      </div>
    </SessionContainer>
  );

  const renderBooked = () => {
    if (!session) return null;

    return (
      <SessionContainer className="border-2 border-session-booked text-session-booked">
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

          <div className="flex flex-row justify-between items-end">
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
                setIsConfirmingCancel(true);
              }}
              className="text-session-booked w-[24px] h-[24px] p-[4px] ml-auto rounded-sm bg-calendar-primary/12 hover:text-session-booked/80 transition-colors cursor-pointer hover:bg-calendar-primary/20 hide-on-mobile hidden xl:flex items-center justify-center flex-shrink-0"
            >
              <X />
            </button>
          </div>
        </div>
      </SessionContainer>
    );
  };

  // Handle internal state transitions for booked sessions
  if (mode === "booked" && isConfirmingCancel) {
    return renderCancelConfirmation();
  }

  // Render based on mode
  switch (mode) {
    case "empty":
      return renderEmpty();
    case "hover":
      return renderHover();
    case "pending":
      return renderPending();
    case "booked":
      return renderBooked();
    case "cancel-confirmation":
      return renderCancelConfirmation();
    default:
      return null;
  }
};
