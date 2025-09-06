import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Session, DayColumn } from "@/types/calendar";
import { SessionBlock } from "./SessionBlock";
import { generateTimeSlots, getHourLabel } from "@/utils/timeUtils";

interface TimeGridProps {
  daysToShow: DayColumn[];
  sessions: Session[];
  onSessionBook: (session: Omit<Session, "id">) => void;
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
  onSessionDelete?: (sessionId: string) => void;
  viewMode: "day" | "week";
}

export const TimeGrid = ({
  daysToShow,
  sessions,
  onSessionBook,
  onSessionUpdate,
  onSessionDelete,
  viewMode,
}: TimeGridProps) => {
  const [hoveredSlot, setHoveredSlot] = useState<{
    day: string;
    hour: number;
    minute: number;
  } | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    day: string;
    hour: number;
    minute: number;
  } | null>(null);
  const [clickCooldown, setClickCooldown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Memoize expensive time slot generation
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Auto-scroll to current time on mount
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const slotIndex = timeSlots.findIndex((slot) => slot.hour === currentHour);
    if (slotIndex !== -1 && scrollRef.current) {
      const slotHeight = 68;
      scrollRef.current.scrollTop = slotIndex * slotHeight - 100;
    }
  }, [timeSlots]);

  const getSessionForSlot = (day: string, hour: number, minute: number) => {
    // const lastIndex = sessions.length - 1; const randomIndex = Math.floor(Math.random() *
    // (lastIndex + 1) + 0); return sessions[randomIndex];
    return sessions.find((session) => {
      if (session.date !== day) return false;
      const [startHour, startMinute] = session.startTime.split(":").map(Number);
      const [endHour, endMinute] = session.endTime.split(":").map(Number);

      const sessionStartMinutes = startHour * 60 + startMinute;
      const sessionEndMinutes = endHour * 60 + endMinute;
      const slotMinutes = hour * 60 + minute;

      return (
        slotMinutes >= sessionStartMinutes && slotMinutes < sessionEndMinutes
      );
    });
  };

  const handleSlotClick = useCallback(
    (day: string, hour: number, minute: number) => {
      const existingSession = getSessionForSlot(day, hour, minute);
      if (existingSession) return;

      if (
        pendingConfirmation?.day === day &&
        pendingConfirmation?.hour === hour &&
        pendingConfirmation?.minute === minute
      ) {
        // Confirm booking
        const startTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const endTime = `${hour.toString().padStart(2, "0")}:${(minute + 25)
          .toString()
          .padStart(2, "0")}`;

        onSessionBook({
          // title: "New Session",
          startTime,
          endTime,
          date: day,
          participant: "New Participant",
          // status: "booked",
        });

        setPendingConfirmation(null);
        setClickCooldown(true);
        setTimeout(() => setClickCooldown(false), 100); // Brief cooldown
      } else {
        // Set pending confirmation
        setPendingConfirmation({ day, hour, minute });
        setClickCooldown(true);
        setTimeout(() => setClickCooldown(false), 100); // Brief cooldown
      }
    },
    [pendingConfirmation, onSessionBook]
  );

  const isSlotPending = useCallback(
    (day: string, hour: number, minute: number) => {
      return (
        pendingConfirmation?.day === day &&
        pendingConfirmation?.hour === hour &&
        pendingConfirmation?.minute === minute
      );
    },
    [pendingConfirmation]
  );

  // Memoize grid template columns calculation
  const gridCols = useMemo(() => {
    const timeColWidth = "80px";
    const dayColsFr = `repeat(${daysToShow.length}, 1fr)`;
    return `${timeColWidth} ${dayColsFr}`;
  }, [daysToShow.length]);

  return (
    <>
      {/* WHITE CONTAINER WITH SCROLLBAR */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white border border-gray-200 min-h-0"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div className="min-w-full">
          {/* STICKY HEADER ROW */}
          <div className="sticky top-0 z-11 bg-white border-calendar-border">
            <div
              className="grid"
              style={{
                gridTemplateColumns: gridCols,
                width: "100%",
              }}
            >
              {/* Header time column */}
              <div
                className="border-r border-calendar-border bg-calendar-sidebar relative"
                style={{
                  height: "80px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <div className="absolute bottom-2 right-1 text-xs text-calendar-time-text">
                  EDT
                </div>
              </div>
              {/* day.isToday */}
              {/* Header day columns */}
              {daysToShow.map((day) => (
                <div
                  key={`header-${day.date}`}
                  className={`p-3 text-left border-r border-b border-calendar-border ${
                    day.isToday ? "bg-calendar-primary/5" : "bg-white"
                  }`}
                  style={{ height: "80px" }}
                >
                  <div className="text-xs font-medium text-calendar-time-text uppercase mb-1">
                    {day.dayName}
                  </div>
                  <div className="text-2xl font-bold bg-red text-foreground">
                    {day.dayNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TIME GRID CONTENT - NO OVERFLOW */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: gridCols,
              width: "100%",
            }}
          >
            {/* TIME SLOTS ROWS */}
            {timeSlots
              .map((slot, index) => {
                const isHourStart = slot.minute === 0;
                const isHalfHour = slot.minute === 30;

                return [
                  // Time column for this slot
                  <div
                    key={`time-${index}`}
                    className="border-r border-calendar-border bg-calendar-sidebar px-3 py-1 text-sm text-calendar-time-text font-medium relative pl-5 pt-1"
                    style={{ height: "73px" }}
                  >
                    <div className="absolute -top-1 right-1">
                      {isHourStart && (
                        <span className="block">{getHourLabel(slot.hour)}</span>
                      )}
                      {isHalfHour && (
                        <span className="block text-xs text-calendar-time-text/70">
                          30
                        </span>
                      )}
                    </div>
                  </div>,

                  // Day columns for this slot
                  ...daysToShow.map((day) => {
                    const sessionInSlot = getSessionForSlot(
                      day.date,
                      slot.hour,
                      slot.minute
                    );
                    const isHovered =
                      hoveredSlot?.day === day.date &&
                      hoveredSlot?.hour === slot.hour &&
                      hoveredSlot?.minute === slot.minute;
                    const isPending = isSlotPending(
                      day.date,
                      slot.hour,
                      slot.minute
                    );

                    return (
                      <div
                        key={`${day.date}-${index}`}
                        className={`border-r min-w-0 border-b border-calendar-border/50 transition-colors ${
                          sessionInSlot ? "cursor-pointer" : ""
                        } ${
                          day.isToday ? "bg-calendar-primary/5" : "bg-white"
                        }`}
                        style={{ height: "73px" }}
                        onMouseEnter={() => {
                          if (!isPending && !clickCooldown) {
                            setHoveredSlot({
                              day: day.date,
                              hour: slot.hour,
                              minute: slot.minute,
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredSlot(null)}
                        onClick={() =>
                          handleSlotClick(day.date, slot.hour, slot.minute)
                        }
                      >
                        {sessionInSlot ? (
                          <SessionBlock
                            key={sessionInSlot.id}
                            mode="booked"
                            session={sessionInSlot}
                            onUpdate={(updates) =>
                              onSessionUpdate(sessionInSlot.id, updates)
                            }
                            onDelete={onSessionDelete}
                            viewMode={viewMode}
                          />
                        ) : (
                          // TODO: refactor this lator to not use SessionBlock for
                          // pending/hover/empty states.
                          <SessionBlock
                            key={`${day.date}-${slot.hour}-${slot.minute}`}
                            viewMode={viewMode}
                            mode={
                              isPending
                                ? "pending"
                                : isHovered
                                ? "hover"
                                : "empty"
                            }
                            slotTime={slot.formatted}
                            onBook={() =>
                              handleSlotClick(day.date, slot.hour, slot.minute)
                            }
                            onRemovePending={() => setPendingConfirmation(null)}
                          />
                        )}
                      </div>
                    );
                  }),
                ];
              })
              .flat()}
          </div>
        </div>
      </div>
    </>
  );
};
