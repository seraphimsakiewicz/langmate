import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniCalendar } from "@/components/ui/mini-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Session, DayColumn } from "@/types/calendar";
import { formatDate } from "@/data/sessionsData";
import { useMiniCalendar, MiniCalendarProps } from "@/hooks/useMiniCalendar";

interface BookingModalProps {
  onBook: (session: Omit<Session, "id">) => void;
  weekDays: DayColumn[];
  modalState: {
    setOpenModal: (state: boolean) => void;
    openModal: boolean;
  };
}

export const BookingModal = ({ onBook, modalState }: BookingModalProps) => {
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { setOpenModal, openModal } = modalState;

  const {
    selectedDate,
    displayMonth,
    handleDisplayMonth,
    handleDateSelect,
    currentDate,
    startMonth,
    endMonth,
    openPopper,
    handlePopper,
  }: MiniCalendarProps = useMiniCalendar();

  // Generate time options (every 30 minutes from 12 AM to 11.30 PM)
  const timeOptions = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 24 && minute > 0) break; // Stop at midnight.
      const time = new Date();
      time.setHours(hour, minute);
      const formatted = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeOptions.push({
        value: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        label: formatted,
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      return;
    }

    const [hour, minute] = selectedTime.split(":");
    // const endHour = minute >= 30 ? hour + 1 : hour;
    const endMinute = minute === "30" ? "55" : "25";

    const endTime = `${hour}:${endMinute}`;

    onBook({
      startTime: selectedTime,
      endTime,
      date: formatDate(selectedDate),
      participant: "New Participant",
      // status: "booked",
    });

    // Reset form
    handleDateSelect(new Date());
    onClose();
  };

  const onClose = () => {
    setOpenModal(false);
    handleDateSelect(new Date());
    setSelectedTime("");
  };

  const timeValid = (): boolean => {
    if (!selectedTime) return false;
    const [selectedHours, selectedMinutes] = selectedTime.split(":").map(Number);
    const selectedTimeDate = new Date(selectedDate);
    selectedTimeDate.setHours(selectedHours, selectedMinutes, 0, 0);
    // time valid is selectedTime is greater than time of currentDate
    return selectedTimeDate > new Date();
  };

  const shortUS = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Book a Session</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="selectedDate" className="px-1">
              Date
            </Label>
            <Popover open={openPopper} modal={true} onOpenChange={handlePopper}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="selectedDate"
                  className="w-full justify-between font-normal"
                >
                  {selectedDate ? shortUS.format(selectedDate) : "Select Date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                <MiniCalendar
                  mode="single"
                  selected={selectedDate}
                  disabled={{ before: currentDate }}
                  startMonth={startMonth}
                  endMonth={endMonth}
                  onMonthChange={handleDisplayMonth}
                  month={displayMonth}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime} required>
              <SelectTrigger className="[&_svg]:![color:var(--color-foreground)] [&_svg]:opacity-100">
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
              disabled={!selectedDate || !selectedTime || !timeValid()}
            >
              Book Session
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
