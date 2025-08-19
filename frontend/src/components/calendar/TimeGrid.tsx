import { useState, useRef, useEffect } from 'react';
import { Session, DayColumn } from '@/types/calendar';
import { SessionBlock } from './SessionBlock';
import { BookingModal } from './BookingModal';

interface TimeGridProps {
  daysToShow: DayColumn[];
  sessions: Session[];
  onSessionBook: (session: Omit<Session, 'id'>) => void;
  onSessionUpdate: (sessionId: string, updates: Partial<Session>) => void;
  viewMode: 'day' | 'week';
}

export const TimeGrid = ({ daysToShow, sessions, onSessionBook, onSessionUpdate, viewMode }: TimeGridProps) => {
  const [hoveredSlot, setHoveredSlot] = useState<{ day: string; hour: number; minute: number } | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; hour: number; minute: number } | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<{ day: string; hour: number; minute: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate time slots from 12 AM to 11 PM
  const timeSlots = Array.from({ length: 24 }, (_, hour) => {
    const slots = [];
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date();
      time.setHours(hour, minute);
      const formatted = time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      slots.push({ hour, minute, formatted });
    }
    return slots;
  }).flat();

  // Auto-scroll to current time on mount
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const slotIndex = timeSlots.findIndex(slot => slot.hour === currentHour);
    if (slotIndex !== -1 && scrollRef.current) {
      const slotElement = scrollRef.current.children[slotIndex] as HTMLElement;
      if (slotElement) {
        scrollRef.current.scrollTop = slotElement.offsetTop - 100;
      }
    }
  }, []);

  const getSessionsForSlot = (day: string, hour: number, minute: number) => {
    return sessions.filter(session => {
      if (session.date !== day) return false;
      
      const [startHour, startMinute] = session.startTime.split(':').map(Number);
      const [endHour, endMinute] = session.endTime.split(':').map(Number);
      
      const slotMinutes = hour * 60 + minute;
      const sessionStartMinutes = startHour * 60 + startMinute;
      const sessionEndMinutes = endHour * 60 + endMinute;
      
      return slotMinutes >= sessionStartMinutes && slotMinutes < sessionEndMinutes;
    });
  };

  const handleSlotClick = (day: string, hour: number, minute: number) => {
    const existingSessions = getSessionsForSlot(day, hour, minute);
    if (existingSessions.length > 0) return;
    
    if (pendingConfirmation?.day === day && 
        pendingConfirmation?.hour === hour && 
        pendingConfirmation?.minute === minute) {
      // Confirm booking
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endTime = `${hour.toString().padStart(2, '0')}:${(minute + 25).toString().padStart(2, '0')}`;
      
      onSessionBook({
        title: 'New Session',
        startTime,
        endTime,
        date: day,
        participant: 'New Participant',
        status: 'booked'
      });
      
      setPendingConfirmation(null);
    } else {
      // Set pending confirmation
      setPendingConfirmation({ day, hour, minute });
    }
  };

  const isSlotPending = (day: string, hour: number, minute: number) => {
    return pendingConfirmation?.day === day && 
           pendingConfirmation?.hour === hour && 
           pendingConfirmation?.minute === minute;
  };

  return (
    <>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <div className={`${daysToShow.length === 1 ? 'flex' : 'grid grid-cols-8'} min-h-full`}>
          {/* Time column */}
          <div className="border-r border-calendar-border bg-calendar-sidebar pl-5 pt-1">
            {timeSlots.map((slot, index) => {
              const isHourStart = slot.minute === 0;
              const isHalfHour = slot.minute === 30;
              
              // Format hour for display (12A, 1A, 2A, etc.)
              const getHourLabel = (hour: number) => {
                if (hour === 0) return '12A';
                if (hour === 12) return '12P';
                if (hour < 12) return `${hour}A`;
                return `${hour - 12}P`;
              };

              return (
                <div 
                  key={index}
                  className="px-3 py-1 text-sm text-calendar-time-text flex font-medium relative"
                  style={{ height: '68px' }}
                >
                  {isHourStart && (
                    <span className="absolute -top-2 right-1">{getHourLabel(slot.hour)}</span>
                  )}
                  {isHalfHour && (
                    <span className="absolute -top-2 right-1 text-xs text-calendar-time-text/70">30</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Day columns */}
          {daysToShow.map((day) => (
            <div key={day.date} className={`border-r border-calendar-border relative ${daysToShow.length === 1 ? 'flex-1' : ''}`}>
              {timeSlots.map((slot, slotIndex) => {
                const sessionsInSlot = getSessionsForSlot(day.date, slot.hour, slot.minute);
                const isHovered = hoveredSlot?.day === day.date && 
                                hoveredSlot?.hour === slot.hour && 
                                hoveredSlot?.minute === slot.minute;
                const isPending = isSlotPending(day.date, slot.hour, slot.minute);

                return (
                  <div
                    key={slotIndex}
                    className={`border-b border-calendar-border/50 relative cursor-pointer transition-colors ${
                      isHovered && sessionsInSlot.length === 0 ? 'bg-calendar-hover/10' : ''
                    } ${isPending ? 'bg-session-pending/20' : ''}`}
                    style={{ height: '68px' }}
                    onMouseEnter={() => setHoveredSlot({ day: day.date, hour: slot.hour, minute: slot.minute })}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onClick={() => handleSlotClick(day.date, slot.hour, slot.minute)}
                  >
                    {sessionsInSlot.map((session) => (
                      <SessionBlock 
                        key={session.id} 
                        session={session}
                        onUpdate={(updates) => onSessionUpdate(session.id, updates)}
                      />
                    ))}
                    
                    {isHovered && sessionsInSlot.length === 0 && (
                      <div className="absolute inset-0 bg-calendar-hover/20 border border-calendar-hover rounded text-xs text-white flex items-center justify-center font-medium">
                        {slot.formatted}
                      </div>
                    )}
                    
                    {isPending && (
                      <div className="absolute inset-0 bg-session-pending/40 border border-session-pending rounded text-xs text-white flex items-center justify-center font-medium">
                        Confirm?
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
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