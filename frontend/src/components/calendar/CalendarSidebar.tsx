import { Calendar, Users, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Session } from '@/types/calendar';

interface CalendarSidebarProps {
  onBookSession: () => void;
  ongoingSession?: Session;
}

export const CalendarSidebar = ({ onBookSession, ongoingSession }: CalendarSidebarProps) => {
  const timeRemaining = ongoingSession ? '25m' : null;

  return (
    <div className="w-64 bg-calendar-sidebar border-r border-calendar-border h-full flex flex-col">
      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-calendar-primary font-medium">
          <Calendar className="mr-3 h-4 w-4" />
          Calendar
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <Users className="mr-3 h-4 w-4" />
          Sessions
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <User className="mr-3 h-4 w-4" />
          People
        </Button>
      </div>

      {/* Book a session button */}
      <div className="px-4 mb-6">
        <Button 
          onClick={onBookSession}
          className="w-full bg-calendar-primary hover:bg-calendar-primary/90 text-white rounded-lg font-medium"
        >
          + Book a session
        </Button>
      </div>

      {/* Ongoing session */}
      {ongoingSession && (
        <div className="px-4 mb-6">
          <div className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            ONGOING
          </div>
          <div className="bg-white border border-calendar-border rounded-lg p-3">
            <div className="text-sm font-medium mb-1">
              {ongoingSession.startTime}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-session-ongoing rounded-full flex items-center justify-center text-white text-xs font-medium">
                J
              </div>
              <span className="text-sm text-foreground">{ongoingSession.participant}</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {timeRemaining}
            </div>
            <Button size="sm" className="w-full bg-session-ongoing hover:bg-session-ongoing/90 text-white text-xs">
              Join
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};