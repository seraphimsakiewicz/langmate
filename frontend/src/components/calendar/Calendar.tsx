import { useState } from 'react';
import { CalendarSidebar } from './CalendarSidebar';
import { CalendarHeader } from './CalendarHeader';
import { TimeGrid } from './TimeGrid';
import { BookingModal } from './BookingModal';
import { TopNav } from '../layout/TopNav';
import { Session, DayColumn } from '@/types/calendar';
import { dummySessions } from '@/data/sessionsData';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<Session[]>(dummySessions);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [currentView, setCurrentView] = useState<'calendar' | 'sessions' | 'people'>('calendar');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Generate days based on current date and view mode
  const getDaysToShow = (date: Date, mode: 'day' | 'week'): DayColumn[] => {
    if (mode === 'day') {
      // Show only the current day
      return [{
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNumber: date.getDate(),
        isToday: date.toDateString() === new Date().toDateString(),
      }];
    } else {
      // Show the full week
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
    }
  };

  const daysToShow = getDaysToShow(currentDate, viewMode);

  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
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

  const renderMainContent = () => {
    switch (currentView) {
      case 'calendar':
        return (
          <div className="flex h-full">
            <CalendarSidebar 
              onBookSession={() => setShowBookingModal(true)}
              ongoingSession={ongoingSession}
              isCollapsed={isSidebarCollapsed}
            />
            
            <div className="flex-1 flex flex-col">
              <CalendarHeader 
                currentDate={currentDate}
                onPrevPeriod={handlePrevPeriod}
                onNextPeriod={handleNextPeriod}
                onDateSelect={handleDateSelect}
                daysToShow={daysToShow}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              <TimeGrid 
                daysToShow={daysToShow}
                sessions={sessions}
                onSessionBook={handleSessionBook}
                onSessionUpdate={handleSessionUpdate}
                viewMode={viewMode}
              />
            </div>
          </div>
        );
      case 'sessions':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-muted-foreground">Sessions</h2>
              <p className="text-muted-foreground mt-2">Session management coming soon</p>
            </div>
          </div>
        );
      case 'people':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-muted-foreground">People</h2>
              <p className="text-muted-foreground mt-2">People management coming soon</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 overflow-hidden">
        {renderMainContent()}
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBook={handleSessionBook}
        weekDays={daysToShow}
      />
    </div>
  );
};