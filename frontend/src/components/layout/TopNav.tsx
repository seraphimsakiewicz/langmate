import { Calendar, Users, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopNavProps {
  currentView: 'calendar' | 'sessions' | 'people';
  onViewChange: (view: 'calendar' | 'sessions' | 'people') => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const TopNav = ({ currentView, onViewChange, isSidebarCollapsed, onToggleCollapse }: TopNavProps) => {
  return (
    <div className="border-b border-calendar-border bg-white">
      <div className="px-6 py-3">
        <div className="flex items-center space-x-1">
          {/* Hamburger menu - only show when on calendar view */}
          {currentView === 'calendar' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleCollapse}
              className="p-2 mr-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className={`px-4 py-2 ${
              currentView === 'calendar' 
                ? 'bg-calendar-primary/10 text-calendar-primary font-medium border-b-2 border-calendar-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onViewChange('calendar')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button 
            variant="ghost" 
            className={`px-4 py-2 ${
              currentView === 'sessions' 
                ? 'bg-calendar-primary/10 text-calendar-primary font-medium border-b-2 border-calendar-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onViewChange('sessions')}
          >
            <Users className="mr-2 h-4 w-4" />
            Sessions
          </Button>
          <Button 
            variant="ghost" 
            className={`px-4 py-2 ${
              currentView === 'people' 
                ? 'bg-calendar-primary/10 text-calendar-primary font-medium border-b-2 border-calendar-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onViewChange('people')}
          >
            <User className="mr-2 h-4 w-4" />
            People
          </Button>
        </div>
      </div>
    </div>
  );
};