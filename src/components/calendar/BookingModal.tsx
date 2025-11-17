"use client";

import { useMemo, useState } from "react";
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
import { useMiniCalendar } from "@/hooks/useMiniCalendar";
import { useCalendarStore } from "@/stores/calendar-store";
import { DateTime } from "luxon";

export const BookingModal = () => {
  const { setOpenModal, openModal, addSession, profile } = useCalendarStore();
  const safeTimezone = profile.timezone || "UTC";
  const [selectedTime, setSelectedTime] = useState<string>("");

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
  } = useMiniCalendar({ timezone: safeTimezone });

  // Generate time options (every 30 minutes from 12 AM to 11.30 PM)
  const timeOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 24 && minute > 0) break;
        const slot = DateTime.fromObject({ hour, minute }, { zone: safeTimezone });
        options.push({
          value: slot.toFormat("HH:mm"),
          label: slot.toFormat("h:mm a"),
        });
      }
    }
    return options;
  }, [safeTimezone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      return;
    }

    const [hour, minute] = selectedTime.split(":").map(Number);
    const selectedDateTime = DateTime.fromJSDate(selectedDate)
      .setZone(safeTimezone, { keepLocalTime: true })
      .set({ hour, minute, second: 0, millisecond: 0 });
    const localStartTime = selectedDateTime.toFormat("yyyy-LL-dd'T'HH:mm:ss");

    await addSession(localStartTime);
    onClose();
  };

  const onClose = () => {
    setOpenModal(false);
    handleDateSelect(DateTime.now().setZone(safeTimezone).toJSDate());
    setSelectedTime("");
  };

  const timeValid = (): boolean => {
    if (!selectedTime) return false;
    const [selectedHours, selectedMinutes] = selectedTime.split(":").map(Number);
    const selectedDateTime = DateTime.fromJSDate(selectedDate)
      .setZone(safeTimezone, { keepLocalTime: true })
      .set({ hour: selectedHours, minute: selectedMinutes, second: 0, millisecond: 0 });
    const now = DateTime.now().setZone(safeTimezone);
    return selectedDateTime > now;
  };

  const formattedSelectedDate = selectedDate
    ? DateTime.fromJSDate(selectedDate)
        .setZone(safeTimezone, { keepLocalTime: true })
        .toFormat("MMM d, yyyy")
    : "Select Date";

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
                  {formattedSelectedDate}
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
