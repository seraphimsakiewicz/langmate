"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// todo, try to use builder.io to generate a calendar.

const localizer = momentLocalizer(moment);
const ACCENT = "rgb(14,187,253)";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    status: "matching" | "booked";
  };
};

type Session = {
  id: string;
  date: string;
  day: number;
  hour: number;
  minute: 0 | 30;
  label: string;
};

const pad = (n: number) => n.toString().padStart(2, "0");
const fmtAMPM = (h: number, m: number) => {
  const ap = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${ap}`;
};

function toISODateLocal(d: Date) {
  const z = new Date(d);
  z.setMinutes(z.getMinutes() - z.getTimezoneOffset());
  return z.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function sessionsToEvents(sessions: Session[]): CalendarEvent[] {
  return sessions.map((session) => {
    const startDate = new Date(`${session.date}T${pad(session.hour)}:${pad(session.minute)}:00`);
    const endDate = new Date(startDate.getTime() + 25 * 60 * 1000); // 25 minutes duration
    
    return {
      id: session.id,
      title: session.label,
      start: startDate,
      end: endDate,
      resource: {
        status: session.label === "Matching..." ? "matching" : "booked"
      }
    };
  });
}

export default function WeeklyScheduler() {
  const initialDate = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  // Initialize with sample sessions
  const [sessions, setSessions] = useState<Session[]>(() => {
    const today = new Date();
    const wed = addDays(today, (3 - today.getDay() + 7) % 7); // Next Wednesday
    const date = toISODateLocal(wed);
    return [
      { id: "a", date, day: 3, hour: 18, minute: 0, label: "Matching..." },
      { id: "b", date, day: 3, hour: 18, minute: 30, label: "Terence M." },
    ];
  });

  const events = useMemo(() => sessionsToEvents(sessions), [sessions]);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    // Only allow 30-minute slots on the hour or half-hour
    const start = new Date(slotInfo.start);
    const minutes = start.getMinutes();
    
    if (minutes !== 0 && minutes !== 30) {
      return; // Invalid time slot
    }

    // Check if slot is already booked
    const existingEvent = events.find(event => 
      event.start.getTime() === start.getTime()
    );
    
    if (existingEvent) {
      return; // Slot already booked
    }

    setSelectedSlot({ start, end: new Date(start.getTime() + 25 * 60 * 1000) });
  }, [events]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (window.confirm(`Remove session "${event.title}"?`)) {
      setSessions(prev => prev.filter(s => s.id !== event.id));
    }
  }, []);

  const confirmBooking = useCallback(() => {
    if (!selectedSlot) return;
    
    const start = selectedSlot.start;
    const newSession: Session = {
      id: crypto.randomUUID(),
      date: toISODateLocal(start),
      day: start.getDay(),
      hour: start.getHours(),
      minute: start.getMinutes() as 0 | 30,
      label: "Matching..."
    };
    
    setSessions(prev => [...prev, newSession]);
    setSelectedSlot(null);
  }, [selectedSlot]);

  const cancelBooking = useCallback(() => {
    setSelectedSlot(null);
  }, []);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const isMatching = event.resource?.status === "matching";
    return {
      style: {
        backgroundColor: isMatching ? ACCENT : "#10B981",
        borderColor: isMatching ? ACCENT : "#10B981",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "12px"
      }
    };
  }, []);

  const slotStyleGetter = useCallback((date: Date) => {
    const minutes = date.getMinutes();
    // Highlight valid time slots (on the hour and half-hour)
    if (minutes === 0 || minutes === 30) {
      return {
        style: {
          backgroundColor: "rgba(14,187,253,0.05)"
        }
      };
    }
    return {};
  }, []);

  return (
    <>
      {/* Custom CSS for styling */}
      <style jsx>{`
        .rbc-calendar {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        /* Hour slots with darker borders */
        .rbc-time-slot {
          border-bottom: 1px solid #e2e8f0 !important;
        }
        
        /* Hour lines (every hour) - darker */
        .rbc-timeslot-group {
          border-bottom: 2px solid #94a3b8 !important;
          min-height: 60px;
        }
        
        /* Half-hour dividers */
        .rbc-time-slot:nth-child(2) {
          border-bottom: 1px solid #cbd5e1 !important;
        }
        
        /* Time gutter styling */
        .rbc-time-gutter .rbc-timeslot-group {
          border-bottom: 2px solid #94a3b8 !important;
        }
        
        /* Day columns */
        .rbc-day-slot {
          border-right: 1px solid #e2e8f0;
        }
        
        /* Header styling */
        .rbc-header {
          border-bottom: 2px solid #94a3b8 !important;
          padding: 12px 8px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          color: #374151 !important;
          background: #f8fafc !important;
        }
        
        /* Time labels */
        .rbc-time-gutter .rbc-time-slot {
          color: #6b7280 !important;
          font-size: 12px !important;
          text-align: right !important;
          padding-right: 8px !important;
        }
        
        /* Today highlighting */
        .rbc-today {
          background-color: rgba(14, 187, 253, 0.03) !important;
        }
        
        /* Event styling improvements */
        .rbc-event {
          border-radius: 6px !important;
          border: none !important;
          font-weight: 500 !important;
          font-size: 12px !important;
          padding: 2px 6px !important;
        }
        
        /* Selected slot highlighting */
        .rbc-selected {
          background-color: rgba(14, 187, 253, 0.1) !important;
        }
        
        /* Remove default borders that conflict */
        .rbc-time-view {
          border: none !important;
        }
        
        /* Calendar container */
        .rbc-calendar {
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        
        /* Current time indicator */
        .rbc-current-time-indicator {
          background-color: ${ACCENT} !important;
          height: 2px !important;
        }
      `}</style>
      
      <div className="w-full h-full bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Enhanced Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
          <div className="text-xl font-bold text-gray-800">Langmate Calendar</div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  currentDate.toDateString() === new Date().toDateString()
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  currentView === Views.DAY
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setCurrentView(Views.DAY)}
              >
                Day
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  currentView === Views.WEEK
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setCurrentView(Views.WEEK)}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div style={{ height: "calc(100vh - 200px)", padding: "24px", background: "#fafbfc" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            selectable={true}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            slotPropGetter={slotStyleGetter}
            step={30}
            timeslots={1}
            min={new Date(0, 0, 0, 0, 0, 0)}
            max={new Date(0, 0, 0, 23, 59, 59)}
            formats={{
              timeGutterFormat: (date) => {
                const hours = date.getHours();
                const minutes = date.getMinutes();
                if (minutes === 0) {
                  return fmtAMPM(hours, minutes);
                }
                return '';
              },
              eventTimeRangeFormat: ({ start, end }) => 
                `${fmtAMPM(start.getHours(), start.getMinutes())} — ${fmtAMPM(end.getHours(), end.getMinutes())}`,
            }}
            components={{
              toolbar: () => null,
            }}
          />
        </div>
      </div>

      {/* Enhanced Booking Confirmation Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white border rounded-xl shadow-2xl p-6 min-w-[350px] mx-4" style={{ borderColor: ACCENT }}>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Book Time Slot</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-800">
                {fmtAMPM(selectedSlot.start.getHours(), selectedSlot.start.getMinutes())} — {fmtAMPM(selectedSlot.end.getHours(), selectedSlot.end.getMinutes())}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedSlot.start.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-all shadow-sm"
                style={{ backgroundColor: ACCENT }}
                onClick={confirmBooking}
              >
                Confirm Booking
              </button>
              <button
                className="px-4 py-3 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-all"
                style={{ borderColor: ACCENT, color: ACCENT }}
                onClick={cancelBooking}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}