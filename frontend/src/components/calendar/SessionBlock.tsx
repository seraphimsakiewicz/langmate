import { Session } from '@/types/calendar';
import { X } from 'lucide-react';

interface SessionBlockProps {
  session: Session;
  onUpdate: (updates: Partial<Session>) => void;
  onDelete?: (sessionId: string) => void;
}

export const SessionBlock = ({ session, onUpdate, onDelete }: SessionBlockProps) => {
  const getStatusColor = () => {
    switch (session.status) {
      case 'ongoing':
        return 'bg-session-ongoing text-white';
      case 'booked':
        return 'border-2 border-session-booked bg-session-booked/10 text-session-booked font-medium';
      case 'pending':
        return 'border-2 border-calendar-primary bg-calendar-primary/10 text-calendar-primary font-medium';
      default:
        return 'border-2 border-session-booked bg-session-booked/10 text-session-booked font-medium';
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

  const renderBookedSession = () => (
    <div 
      className={`absolute rounded text-xs p-2 ${getStatusColor()} transition-all hover:shadow-md cursor-pointer`}
      style={{ 
        left: '2px',
        right: '2px',
        top: '2px',
        bottom: '2px',
        minHeight: '48px',
        zIndex: 10
      }}
    >
      {/* Top: Time with Cancel button */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-medium leading-tight">
          {formatTime(session.startTime)}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) {
              onDelete(session.id);
            }
          }}
          className="text-session-booked hover:text-session-booked/70 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Bottom: Avatar + Name */}
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 bg-session-booked rounded-full flex items-center justify-center text-white text-[9px] font-medium flex-shrink-0">
          {getInitials(session.participant)}
        </div>
        <span className="text-[10px] font-medium truncate">
          {session.participant}
        </span>
      </div>
    </div>
  );

  const renderOtherSession = () => (
    <div 
      className={`absolute rounded text-xs p-1 ${getStatusColor()} transition-all hover:shadow-md cursor-pointer`}
      style={{ 
        left: '2px',
        right: '2px',
        top: '2px',
        bottom: '2px',
        minHeight: '48px',
        zIndex: 10
      }}
    >
      <div className="text-[11px] mb-1">
        {formatTime(session.startTime)} - {formatTime(session.endTime)}
      </div>
      <div className="flex items-center gap-1">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-medium ${
          session.status === 'booked' ? 'bg-session-booked text-white' : 'bg-white/20'
        }`}>
          {getInitials(session.participant)}
        </div>
        <span className="text-xs">
          {session.participant}
        </span>
      </div>
    </div>
  );

  return session.status === 'booked' ? renderBookedSession() : renderOtherSession();
};