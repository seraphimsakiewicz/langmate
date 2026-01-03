"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DayColumn } from "@/types/calendar";
import { SessionBlock } from "./SessionBlock";
import { generateTimeSlots, getHourLabel } from "@/utils/timeUtils";
import { useCalendarStore } from "@/stores/calendar-store";
import { DateTime } from "luxon";

// Generate days based on current date and view mode
const getDaysToShow = (date: Date, mode: "day" | "week", timezone: string): DayColumn[] => {
  const baseDate = DateTime.fromJSDate(date)
    .setZone(timezone, { keepLocalTime: true })
    .startOf("day");
  const today = DateTime.now().setZone(timezone).startOf("day");

  if (mode === "day") {
    // Show only the current day
    return [
      {
        date: baseDate.toFormat("yyyy-LL-dd"),
        dayName: baseDate.toFormat("ccc").toUpperCase(),
        dayNumber: baseDate.day,
        isToday: baseDate.hasSame(today, "day"),
      },
    ];
  } else {
    // Show the full week, starting Monday
    const weekday = baseDate.weekday; // 1 (Mon) - 7 (Sun)
    const startOfWeek = weekday === 1 ? baseDate : baseDate.minus({ days: weekday - 1 });

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = startOfWeek.plus({ days: i });

      weekDays.push({
        date: currentDay.toFormat("yyyy-LL-dd"),
        dayName: currentDay.toFormat("ccc").toUpperCase(),
        dayNumber: currentDay.day,
        isToday: currentDay.hasSame(today, "day"),
      });
    }
    return weekDays;
  }
};

export const TimeGrid = () => {
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

  const { calendarDate, calendarMode, sessions, addSession, matchSession, deleteSession, profile } =
    useCalendarStore();

  const safeTimezone = profile.timezone ?? "UTC";
  const daysToShow = getDaysToShow(calendarDate, calendarMode, safeTimezone);

  const [clickCooldown, setClickCooldown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Memoize expensive time slot generation
  const timeSlots = useMemo(() => generateTimeSlots(safeTimezone), [safeTimezone]);

  // Auto-scroll to current time on mount
  useEffect(() => {
    const now = DateTime.now().setZone(safeTimezone);
    const currentHour = now.hour;
    const slotIndex = timeSlots.findIndex((slot) => slot.hour === currentHour);
    if (slotIndex !== -1 && scrollRef.current) {
      const slotHeight = 68;
      scrollRef.current.scrollTop = slotIndex * slotHeight - 100;
    }
  }, [timeSlots, safeTimezone]);

  const getSessionForSlot = (day: string, hour: number, minute: number) => {
    const getCreatedAtMillis = (value?: string) => {
      const parsed = DateTime.fromISO(value ?? "");
      return parsed.isValid ? parsed.toMillis() : Number.MAX_SAFE_INTEGER;
    };

    const sessionsInBlock = sessions.filter((session) => {
      if (session.date !== day) return false;
      const [startHour, startMinute] = session.startTime.split(":").map(Number);
      return hour === startHour && minute === startMinute;
    });

    if (!sessionsInBlock.length) return undefined;

    // Prefer sessions the user created or booked.
    const mySessions = sessionsInBlock.filter(
      (session) => session.user_one_id === profile.id || session.user_two_id === profile.id
    );
    if (mySessions.length) {
      return [...mySessions].sort(
        (a, b) => getCreatedAtMillis(a.createdAt) - getCreatedAtMillis(b.createdAt)
      )[0];
    }

    // Otherwise show the oldest matching-language open session.
    const languageMatched = sessionsInBlock.filter(
      (session) => session.language_two_id === profile.fluent_language_id
    );
    if (!languageMatched.length) return undefined;

    return [...languageMatched].sort(
      (a, b) => getCreatedAtMillis(a.createdAt) - getCreatedAtMillis(b.createdAt)
    )[0];
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

        const localStartTime = `${day}T${startTime}:00`;
        console.log("localStartTime", localStartTime);
        addSession(localStartTime);

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
    [pendingConfirmation, addSession]
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
                  {DateTime.now().setZone(safeTimezone).toFormat("ZZZZ")}
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
                  <div className="text-2xl font-bold bg-red text-foreground">{day.dayNumber}</div>
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
                      {isHourStart && <span className="block">{getHourLabel(slot.hour)}</span>}
                      {isHalfHour && (
                        <span className="block text-xs text-calendar-time-text/70">30</span>
                      )}
                    </div>
                  </div>,

                  // Day columns for this slot
                  ...daysToShow.map((day) => {
                    const sessionInSlot = getSessionForSlot(day.date, slot.hour, slot.minute);
                    const isHovered =
                      hoveredSlot?.day === day.date &&
                      hoveredSlot?.hour === slot.hour &&
                      hoveredSlot?.minute === slot.minute;
                    const isPending = isSlotPending(day.date, slot.hour, slot.minute);

                    return (
                      <div
                        key={`${day.date}-${index}`}
                        className={`border-r min-w-0 border-b border-calendar-border/50 transition-colors ${day.isToday ? "bg-calendar-primary/5" : "bg-white"}`}
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
                        onClick={() => handleSlotClick(day.date, slot.hour, slot.minute)}
                      >
                        {sessionInSlot ? (
                          <SessionBlock
                            key={sessionInSlot.id}
                            mode="booked"
                            session={sessionInSlot}
                            matchSession={matchSession}
                            onDelete={deleteSession}
                            calendarMode={calendarMode}
                          />
                        ) : (
                          // TODO: refactor this lator to not use SessionBlock for
                          // pending/hover/empty states.
                          <SessionBlock
                            key={`${day.date}-${slot.hour}-${slot.minute}`}
                            calendarMode={calendarMode}
                            mode={isPending ? "pending" : isHovered ? "hover" : "empty"}
                            slotTime={slot.formatted}
                            matchSession={matchSession}
                            onBook={() => handleSlotClick(day.date, slot.hour, slot.minute)}
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
