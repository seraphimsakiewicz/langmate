import { useState, useRef, useEffect } from "react";
import { Session, DayColumn } from "@/types/calendar";
import { SessionBlock } from "./SessionBlock";
import { BookingModal } from "./BookingModal";

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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    day: string;
    hour: number;
    minute: number;
  } | null>(null);
  const [clickCooldown, setClickCooldown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate time slots from 12 AM to 11 PM
  const timeSlots = Array.from({ length: 24 }, (_, hour) => {
    const slots = [];
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date();
      time.setHours(hour, minute);
      const formatted = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      slots.push({ hour, minute, formatted });
    }
    return slots;
  }).flat();

  // Auto-scroll to current time on mount
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const slotIndex = timeSlots.findIndex((slot) => slot.hour === currentHour);
    if (slotIndex !== -1 && scrollRef.current) {
      const slotHeight = 68;
      scrollRef.current.scrollTop = slotIndex * slotHeight - 100;
    }
  }, []);

  const getSessionsForSlot = (day: string, hour: number, minute: number) => {
    return sessions.filter((session) => {
      if (session.date !== day) return false;

      const [startHour, startMinute] = session.startTime.split(":").map(Number);
      const [endHour, endMinute] = session.endTime.split(":").map(Number);

      const slotMinutes = hour * 60 + minute;
      const sessionStartMinutes = startHour * 60 + startMinute;
      const sessionEndMinutes = endHour * 60 + endMinute;

      return (
        slotMinutes >= sessionStartMinutes && slotMinutes < sessionEndMinutes
      );
    });
  };

  const handleSlotClick = (day: string, hour: number, minute: number) => {
    const existingSessions = getSessionsForSlot(day, hour, minute);
    if (existingSessions.length > 0) return;

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
        title: "New Session",
        startTime,
        endTime,
        date: day,
        participant: "New Participant",
        status: "booked",
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
  };

  const isSlotPending = (day: string, hour: number, minute: number) => {
    return (
      pendingConfirmation?.day === day &&
      pendingConfirmation?.hour === hour &&
      pendingConfirmation?.minute === minute
    );
  };

  // Calculate grid template columns
  const getGridCols = () => {
    const timeColWidth = "80px";
    const dayColsFr = `repeat(${daysToShow.length}, 1fr)`;
    return `${timeColWidth} ${dayColsFr}`;
  };

  return (
    <>
      {/* WHITE CONTAINER WITH SCROLLBAR - like Focusmate */}
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
                gridTemplateColumns: getGridCols(),
                width: "100%",
              }}
            >
              {/* Header time column */}
              <div
                className="border-r border-calendar-border bg-calendar-sidebar"
                style={{
                  height: "80px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <div className="p-3 text-xs text-calendar-time-text">EDT</div>
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
              gridTemplateColumns: getGridCols(),
              width: "100%",
            }}
          >
            {/* TIME SLOTS ROWS */}
            {timeSlots
              .map((slot, index) => {
                const isHourStart = slot.minute === 0;
                const isHalfHour = slot.minute === 30;

                const getHourLabel = (hour: number) => {
                  if (hour === 0) return "12A";
                  if (hour === 12) return "12P";
                  if (hour < 12) return `${hour}A`;
                  return `${hour - 12}P`;
                };

                return [
                  // Time column for this slot
                  <div
                    key={`time-${index}`}
                    className="border-r border-calendar-border bg-calendar-sidebar pl-5 pt-1 px-3 py-1 text-sm text-calendar-time-text flex font-medium relative"
                    style={{ height: "73px" }}
                  >
                    {isHourStart && (
                      <span className="absolute -top-1 right-1">
                        {getHourLabel(slot.hour)}
                      </span>
                    )}
                    {isHalfHour && (
                      <span className="absolute -top-1 right-1 text-xs text-calendar-time-text/70">
                        30
                      </span>
                    )}
                  </div>,

                  // Day columns for this slot
                  ...daysToShow.map((day) => {
                    const sessionsInSlot = getSessionsForSlot(
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
                        className={`border-r border-calendar-border border-b border-calendar-border/50 relative transition-colors ${
                          sessionsInSlot.length === 0 ? "cursor-pointer" : ""
                        } ${
                          day.isToday ? "bg-calendar-primary/5" : "bg-white"
                        } ${
                          isHovered && sessionsInSlot.length === 0 && !isPending
                            ? ""
                            : ""
                        } ${isPending ? "" : ""}`}
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
                        {sessionsInSlot.map((session) => (
                          <SessionBlock
                            key={session.id}
                            session={session}
                            onUpdate={(updates) =>
                              onSessionUpdate(session.id, updates)
                            }
                            onDelete={onSessionDelete}
                            viewMode={viewMode}
                          />
                        ))}

                        {isHovered && sessionsInSlot.length === 0 && (
                          <div className="absolute inset-0 border border-calendar-hover rounded text-md text-primary flex items-center justify-center font-medium">
                            {slot.formatted}
                          </div>
                        )}

                        {isPending && (
                          <div className="absolute inset-0 bg-white border-1 border-calendar-primary rounded text-xs flex flex-col justify-between p-1 cursor-default">
                            <div className="flex gap-1 mb-1 h-full">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSlotClick(
                                    pendingConfirmation!.day,
                                    pendingConfirmation!.hour,
                                    pendingConfirmation!.minute
                                  );
                                }}
                                className="bg-calendar-primary text-white text-[12px] px-2 py-1 rounded font-medium hover:bg-calendar-primary/90 transition-colors flex-1 cursor-pointer"
                              >
                                Book
                              </button>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPendingConfirmation(null);
                              }}
                              className="h-8/10 border border-calendar-primary text-calendar-primary text-[12px] px-2 py-1 rounded font-medium hover:bg-calendar-primary/5 transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
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

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBook={onSessionBook}
        weekDays={daysToShow}
      />
    </>
  );
};
