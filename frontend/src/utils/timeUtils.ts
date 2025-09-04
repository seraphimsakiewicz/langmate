/**
 * Utility functions for time formatting and session management
 * Extracted from components to improve performance and reusability
 */

export const formatTime = (time: string): string => {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const isSessionStartingSoon = (session: { date: string; startTime: string }): boolean => {
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

export const getHourLabel = (hour: number): string => {
  if (hour === 0) return "12A";
  if (hour === 12) return "12P";
  if (hour < 12) return `${hour}A`;
  return `${hour - 12}P`;
};

/**
 * Generate time slots from 12 AM to 11 PM with 30-minute intervals
 * Memoized to prevent recreation on every render
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

/**
 * Create a hash map of sessions indexed by day-hour-minute for O(1) lookup
 */
export const createSessionLookup = (sessions: Array<{ date: string; startTime: string; endTime: string; id: string }>) => {
  const lookup: Record<string, Array<{ date: string; startTime: string; endTime: string; id: string }>> = {};
  
  sessions.forEach((session) => {
    const [startHour, startMinute] = session.startTime.split(":").map(Number);
    const [endHour, endMinute] = session.endTime.split(":").map(Number);
    
    const sessionStartMinutes = startHour * 60 + startMinute;
    const sessionEndMinutes = endHour * 60 + endMinute;
    
    // Add session to all time slots it spans
    for (let minutes = sessionStartMinutes; minutes < sessionEndMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const key = `${session.date}-${hour}-${minute}`;
      
      if (!lookup[key]) {
        lookup[key] = [];
      }
      lookup[key].push(session);
    }
  });
  
  return lookup;
};

/**
 * Get sessions for a specific time slot using the lookup hash map
 */
export const getSessionsForSlot = (
  lookup: Record<string, Array<{ date: string; startTime: string; endTime: string; id: string }>>,
  day: string,
  hour: number,
  minute: number
) => {
  const key = `${day}-${hour}-${minute}`;
  return lookup[key] || [];
};