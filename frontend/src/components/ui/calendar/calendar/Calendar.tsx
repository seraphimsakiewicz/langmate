import { useState } from 'react';
import { CalendarSidebar } from './CalendarSidebar';
import { CalendarHeader } from './CalendarHeader';
import { TimeGrid } from './TimeGrid';
import { BookingModal } from './BookingModal';
import { Session, DayColumn } from '@/types/calendar';
import { dummySessions } from '@/data/sessionsData';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<Session[]>(dummySessions);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Generate week days based on current date
  const getWeekDays = (date: Date): DayColumn[] => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      
      weekDays.push({
        date: currentDay.toISOString().split('T')[0],
        dayName: currentDay.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNumber: currentDay.getDate(),
        isToday: currentDay.toDateString() === new Date().toDateString(),
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays(currentDate);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleSessionBook = (newSession: Omit<Session, 'id'>) => {
    const session: Session = {
      ...newSession,
      id: `session-${Date.now()}`,
    };
    setSessions(prev => [...prev, session]);
  };

  const handleSessionUpdate = (sessionId: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, ...updates } : session
    ));
  };

  // Find ongoing session for sidebar
  const ongoingSession = sessions.find(session => session.status === 'ongoing');

  return (
    <div className="flex h-screen bg-background">
      <CalendarSidebar 
        onBookSession={() => setShowBookingModal(true)}
        ongoingSession={ongoingSession}
      />
      
      <div className="flex-1 flex flex-col">
        <CalendarHeader 
          currentDate={currentDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          weekDays={weekDays}
        />
        
        <TimeGrid 
          weekDays={weekDays}
          sessions={sessions}
          onSessionBook={handleSessionBook}
          onSessionUpdate={handleSessionUpdate}
        />
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBook={handleSessionBook}
        weekDays={weekDays}
      />
    </div>
  );
};