/**
 * Utility functions for time formatting and session management Extracted from components to improve
 * performance and reusability
 */

import { DateTime } from "luxon";
import { Session } from "@/types/calendar";

const defaultTimezone = "UTC";

export const formatTime = (
  time: string,
  hour12 = true,
  timezone: string = defaultTimezone
): string => {
  const dt = DateTime.fromFormat(time, "HH:mm", { zone: timezone });
  return dt.toFormat(hour12 ? "h:mm a" : "HH:mm");
};

export const isSessionStartingSoon = (
  session: Session,
  timezone: string = defaultTimezone
): boolean => {
  const now = DateTime.now().setZone(timezone);
  const today = now.toISODate();

  // Only check sessions for today
  if (session.date !== today) return false;

  const sessionStart = DateTime.fromISO(`${session.date}T${session.startTime}`, {
    zone: timezone,
  });

  if (!sessionStart.isValid) return false;
  const diff = sessionStart.diff(now, "minutes").minutes;
  return diff >= 0 && diff <= 60;
};

export const isBeforeSessionStart = (
  session: Session,
  timezone: string = defaultTimezone
): boolean => {
  const now = DateTime.now().setZone(timezone);
  const sessionStart = DateTime.fromISO(`${session.date}T${session.startTime}`, {
    zone: timezone,
  });

  if (!sessionStart.isValid) return false;
  return now < sessionStart;
};

export const isSlotInPast = (
  date: string,
  hour: number,
  minute: number,
  timezone: string = defaultTimezone
): boolean => {
  const now = DateTime.now().setZone(timezone);
  const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  const sessionStart = DateTime.fromISO(`${date}T${startTime}`, { zone: timezone });

  if (!sessionStart.isValid) return false;
  return now > sessionStart;
};

export const isInJoinWindow = (session: Session, timezone: string = defaultTimezone): boolean => {
  const now = DateTime.now().setZone(timezone);
  const sessionStart = DateTime.fromISO(`${session.date}T${session.startTime}`, {
    zone: timezone,
  });

  if (!sessionStart.isValid) return false;
  const diffMinutes = now.diff(sessionStart, "minutes").minutes;
  /* people can join from 10 minutes before session starts or up to 35 minutes after it starts (5
   min grace period) */
  return diffMinutes >= -10 && diffMinutes <= 35;
};

export const getHourLabel = (hour: number): string => {
  if (hour === 0) return "12A";
  if (hour === 12) return "12P";
  if (hour < 12) return `${hour}A`;
  return `${hour - 12}P`;
};

/**
 * Generate time slots from 12 AM to 11 PM with 30-minute intervals Memoized to prevent recreation
 * on every render
 */
export const generateTimeSlots = (timezone: string = defaultTimezone) => {
  return Array.from({ length: 24 }, (_, hour) => {
    const slots = [];
    for (let minute = 0; minute < 60; minute += 30) {
      const formatted = DateTime.fromObject({ hour, minute }, { zone: timezone }).toFormat(
        "h:mm a"
      );
      slots.push({ hour, minute, formatted });
    }
    return slots;
  }).flat();
};

// Takes "HH:mm" format, returns "HH:mm" format
export const calculateEndTime = (startTime: string, durationMinutes: number) => {
  const [hour, minute] = startTime.split(":").map(Number);
  const totalMinutes = hour * 60 + minute + durationMinutes;
  const endHour = Math.floor(totalMinutes / 60) % 24; // Handle midnight wrap
  const endMinute = totalMinutes % 60;
  return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
};
