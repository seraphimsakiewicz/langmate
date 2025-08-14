export interface Session {
    id: string;
    title: string;
    startTime: string; // Format: "HH:mm"
    endTime: string; // Format: "HH:mm"
    date: string; // Format: "YYYY-MM-DD"
    participant: string;
    status: 'ongoing' | 'booked' | 'pending';
    avatar?: string;
}

export interface TimeSlot {
    hour: number;
    minute: number;
    formatted: string; // "12:00 AM"
}

export interface DayColumn {
    date: string;
    dayName: string;
    dayNumber: number;
    isToday: boolean;
}