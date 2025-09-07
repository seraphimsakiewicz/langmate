/**
 * Utility functions for time formatting and session management Extracted from components to improve
 * performance and reusability
 */

import { Session } from "@/types/calendar";

export const formatTime = (time: string, hour12 = true): string => {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: hour12,
  });
};

export const isSessionStartingSoon = (session: Session): boolean => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Only check sessions for today
  if (session.date !== today) return false;

  const [startHour, startMinute] = session.startTime.split(":").map(Number);
  const sessionStart = new Date();
  sessionStart.setHours(startHour, startMinute, 0, 0);

  // Session starts within 60 minutes and hasn't started yet

  // TODO need to fix this to actually check upcoming in 10 min lol
  return true;
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
export const generateTimeSlots = () => {
  return Array.from({ length: 24 }, (_, hour) => {
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
};
