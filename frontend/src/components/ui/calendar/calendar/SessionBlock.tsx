import { Session } from '@/types/calendar';

interface SessionBlockProps {
  session: Session;
  onUpdate: (updates: Partial<Session>) => void;
}

export const SessionBlock = ({ session, onUpdate }: SessionBlockProps) => {
  const getStatusColor = () => {
    switch (session.status) {
      case 'ongoing':
        return 'bg-session-ongoing text-white';
      case 'booked':
        return 'bg-session-booked text-white';
      case 'pending':
        return 'bg-session-pending text-white';
      default:
        return 'bg-session-booked text-white';
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

  return (
    <div 
      className={`absolute rounded text-xs p-1 ${getStatusColor()} transition-all hover:shadow-md cursor-pointer`}
      style={{ 
        left: '2px',
        right: '2px',
        top: '2px',
        bottom: '2px',
        minHeight: '48px', // Ensure minimum height for 25-minute sessions
        zIndex: 10
      }}
    >
      <div className="font-medium text-xs mb-1">
        {formatTime(session.startTime)} - {formatTime(session.endTime)}
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-medium">
          {getInitials(session.participant)}
        </div>
        <span className="text-[10px] font-medium truncate">
          {session.participant}
        </span>
      </div>
    </div>
  );
};