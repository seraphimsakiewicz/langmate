import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayColumn } from '@/types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  weekDays: DayColumn[];
}

export const CalendarHeader = ({ 
  currentDate, 
  onPrevWeek, 
  onNextWeek, 
  weekDays 
}: CalendarHeaderProps) => {
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="bg-white border-b border-calendar-border">
      {/* Top header with month/year and controls */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onPrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">{monthYear}</h1>
            <Button variant="ghost" size="sm" onClick={onNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="bg-calendar-primary text-white border-calendar-primary hover:bg-calendar-primary/90">
            Day
          </Button>
          <Button size="sm" variant="ghost">
            Week
          </Button>
          <Button size="sm" variant="ghost" className="text-calendar-primary">
            Refer
          </Button>
          <Button size="sm" variant="ghost">
            <HelpCircle className="h-4 w-4 mr-1" />
            Help
          </Button>
          <div className="w-8 h-8 bg-calendar-primary rounded-full"></div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-8 border-t border-calendar-border">
        <div className="p-3"></div> {/* Empty cell for time column */}
        {weekDays.map((day) => (
          <div key={day.date} className="p-3 text-center">
            <div className="text-xs font-medium text-calendar-time-text uppercase mb-1">
              {day.dayName}
            </div>
            <div className={`text-2xl font-bold ${
              day.isToday 
                ? 'text-calendar-primary bg-calendar-primary/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto' 
                : 'text-foreground'
            }`}>
              {day.dayNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};