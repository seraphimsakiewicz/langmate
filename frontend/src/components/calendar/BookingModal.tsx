import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Session, DayColumn } from '@/types/calendar';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (session: Omit<Session, 'id'>) => void;
  weekDays: DayColumn[];
}

export const BookingModal = ({ isOpen, onClose, onBook, weekDays }: BookingModalProps) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participantName, setParticipantName] = useState('');

  // Generate time options (every 30 minutes from 9 AM to 6 PM)
  const timeOptions = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break; // Stop at 6:00 PM
      const time = new Date();
      time.setHours(hour, minute);
      const formatted = time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      timeOptions.push({
        value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        label: formatted
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDay || !selectedTime || !participantName.trim()) {
      return;
    }

    const [hour, minute] = selectedTime.split(':').map(Number);
    const endHour = minute >= 30 ? hour + 1 : hour;
    const endMinute = minute >= 30 ? (minute + 25) % 60 : minute + 25;
    
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    onBook({
      title: `Session with ${participantName}`,
      startTime: selectedTime,
      endTime,
      date: selectedDay,
      participant: participantName,
      status: 'booked'
    });

    // Reset form
    setSelectedDay('');
    setSelectedTime('');
    setParticipantName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Book a Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="day">Date</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a day" />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map((day) => (
                  <SelectItem key={day.date} value={day.date}>
                    {day.dayName}, {day.dayNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-calendar-primary hover:bg-calendar-primary/90"
              disabled={!selectedDay || !selectedTime || !participantName.trim()}
            >
              Book Session
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};