import { Session } from '@/types/calendar';
import { X } from 'lucide-react';

interface SessionBlockProps {
  session: Session;
  onUpdate: (updates: Partial<Session>) => void;
  onDelete?: (sessionId: string) => void;
}

export const SessionBlock = ({ session, onDelete }: SessionBlockProps) => {
  const getStatusColor = () => {
    switch (session.status) {
      case 'ongoing':
      case 'upcoming':
        return 'border-2 border-session-booked text-session-booked font-medium';
      case 'booked':
        return 'border-2 border-session-booked text-session-booked font-medium';
      case 'pending':
        return 'border-2 border-calendar-primary text-calendar-primary font-medium';
      default:
        return 'border-2 border-session-booked text-session-booked font-medium';
    }
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isSessionStartingSoon = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Only check sessions for today
    if (session.date !== today) return false;
    
    const [startHour, startMinute] = session.startTime.split(':').map(Number);
    const sessionStart = new Date();
    sessionStart.setHours(startHour, startMinute, 0, 0);
    
    const timeDiff = sessionStart.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    // Session starts within 60 minutes and hasn't started yet
    return minutesDiff >= 0 && minutesDiff <= 60;
  };

  const renderBookedSession = () => (
    <div 
      className={`absolute rounded text-xs justify-betweenp-[6px] ${getStatusColor()} transition-all`}
      style={{ 
        left: '2px',
        right: '2px',
        top: '2px',
        bottom: '2px',
        minHeight: '56px',
        zIndex: 10
      }}
    >
      {/* Top: Time with Cancel button */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs sm:text-sm font-medium leading-tight">
          {formatTime(session.startTime)} - {formatTime(session.endTime)}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) {
              onDelete(session.id);
            }
          }}
          className="text-session-booked hover:text-session-booked/70 transition-colors cursor-pointer hover:bg-gray-100 rounded p-1"
        >
          <X className="w-[26px] h-[26px] bg-calendar-primary/10" />
        </button>
      </div>

      {/* Bottom: Avatar + Name OR Join Button */}
      {isSessionStartingSoon() ? (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle join session logic here
            console.log('Joining session:', session.id);
          }}
          className="w-full bg-session-booked hover:bg-session-booked/90 text-white text-xs px-2 py-1 rounded font-medium transition-colors cursor-pointer"
        >
          Join
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-session-booked rounded-full flex items-center justify-center text-white text-[9px] font-medium flex-shrink-0">
            {getInitials(session.participant)}
          </div>
          <span className="text-xs sm:text-sm font-medium truncate">
            {session.participant}
          </span>
        </div>
      )}
    </div>
  );

  const renderOtherSession = () => (
    <div 
      className={`absolute rounded text-xs p-1 ${getStatusColor()} transition-all`}
      style={{ 
        left: '2px',
        right: '2px',
        top: '2px',
        bottom: '2px',
        minHeight: '48px',
        zIndex: 10
      }}
    >
      <div className="text-xs sm:text-sm mb-1">
        {formatTime(session.startTime)} - {formatTime(session.endTime)}
      </div>
      <div className="flex items-center gap-1">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-medium ${
          session.status === 'booked' ? 'bg-session-booked text-white' : 'bg-white/20'
        }`}>
          {getInitials(session.participant)}
        </div>
        <span className="text-xs sm:text-sm">
          {session.participant}
        </span>
      </div>
    </div>
  );

  return session.status === 'booked' ? renderBookedSession() : renderOtherSession();
};