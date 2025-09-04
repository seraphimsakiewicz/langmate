import React, { useState, useCallback, memo } from "react";
import { Session } from "@/types/calendar";
import { X } from "lucide-react";
import Link from "next/link";
import { formatTime, isSessionStartingSoon } from "@/utils/timeUtils";

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
    className={`h-full w-full rounded p-[6px] font-medium ${className}`}
  >
    {children}
  </div>
);

const SessionBlockComponent = ({
  mode,
  session,
  onDelete,
  onBook,
  onRemovePending,
}: SessionBlockProps) => {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  // Memoize callback functions to prevent unnecessary re-renders
  const handleBookClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onBook?.();
    },
    [onBook]
  );

  const handleRemovePendingClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemovePending?.();
    },
    [onRemovePending]
  );

  const handleCancelClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingCancel(true);
  }, []);

  const handleCancelConfirmNo = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingCancel(false);
  }, []);

  const handleCancelConfirmYes = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete && session) {
        onDelete(session.id);
      }
    },
    [onDelete, session]
  );

  // Memoize expensive calculations
  const sessionStartingSoon = session ? isSessionStartingSoon(session) : false;

  const renderEmpty = () => null;

  const renderHover = () => (
    <SessionContainer className="border border-calendar-hover text-primary">
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-center justify-center">
          <span className="text-xs font-medium">Select</span>
        </div>
      </div>
    </SessionContainer>
  );

  const renderPending = () => (
    <SessionContainer className="bg-white border-1 border-calendar-primary text-xs">
      <div className="flex flex-col justify-between h-full">
        <div className="flex gap-1 mb-1 h-full">
          <button
            onClick={handleBookClick}
            className="bg-calendar-primary text-white text-[12px] px-2 py-1 rounded font-medium hover:bg-calendar-primary/90 transition-colors flex-1 cursor-pointer"
          >
            Book
          </button>
        </div>
        <button
          onClick={handleRemovePendingClick}
          className="h-8/10 border border-calendar-primary text-calendar-primary text-[12px] px-2 py-1 rounded font-medium hover:bg-calendar-primary/5 transition-colors cursor-pointer"
        >
          Remove
        </button>
      </div>
    </SessionContainer>
  );

  const renderCancelConfirmation = () => (
    <div className="h-full w-full bg-[#de3535] text-white rounded-[5px] shadow-[0_5px_10px_rgba(222,53,53,0.2)] grid grid-rows-2 grid-cols-2">
      <div className="text-center text-[10px] font-medium tracking-[0.5px] col-span-2 flex items-center justify-center">
        Cancel?
      </div>
      <button
        onClick={handleCancelConfirmNo}
        className="flex items-center justify-center h-full bg-transparent text-white text-[11px] font-semibold rounded-bl-[5px] cursor-pointer"
      >
        No
      </button>
      <button
        onClick={handleCancelConfirmYes}
        className="bg-white text-[#de3535] text-[11px] font-semibold rounded-br-[5px] cursor-pointer border-0 p-0 w-full h-full"
      >
        Yes
      </button>
    </div>
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
              <div className="leading-tight min-w-0">
                <div className="text-session-time single-line-el">
                  <span className="show-long-time">
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
                <div className="text-[12px] single-line-el">
                  {session.participant}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-end">
            {/* Bottom row: Join Button on left */}
            {sessionStartingSoon && (
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
              onClick={handleCancelClick}
              className="text-session-booked w-[24px] h-[24px] p-[4px] ml-auto rounded-sm bg-calendar-primary/12 hover:text-session-booked/80 transition-colors cursor-pointer hover:bg-calendar-primary/20 flex items-center justify-center flex-shrink-0"
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

// Memoize the component to prevent unnecessary re-renders
export const SessionBlock = memo(
  SessionBlockComponent,
  (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return (
      prevProps.mode === nextProps.mode &&
      prevProps.session?.id === nextProps.session?.id &&
      prevProps.session?.startTime === nextProps.session?.startTime &&
      prevProps.session?.endTime === nextProps.session?.endTime &&
      prevProps.session?.participant === nextProps.session?.participant &&
      prevProps.slotTime === nextProps.slotTime &&
      prevProps.viewMode === nextProps.viewMode
    );
  }
);

SessionBlock.displayName = "SessionBlock";
