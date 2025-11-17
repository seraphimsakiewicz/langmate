export type Session = {
  id: string;
  // title: string;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  date: string; // Format: "YYYY-MM-DD"
  user_one_id: string;
  user_two_id: null | string;
  language_one_id: string;
  language_two_id: string;
  // status: 'ongoing' | 'upcoming' | 'booked' | 'pending';
};

export type Profile = {
  id: string;
  timezone: string;
  native_language_id: string;
};

export type TimeSlot = {
  hour: number;
  minute: number;
  formatted: string; // "12:00 AM"
};

export type DayColumn = {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
};

export type TimeFormat = "12h" | "24h";
