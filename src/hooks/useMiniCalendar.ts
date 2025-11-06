"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";

export type MiniCalendarProps = {
  selectedDate: Date;
  displayMonth: Date;
  openPopper: boolean;
  handleDateSelect: (selectedDate: Date | undefined) => void;
  handleDisplayMonth: (displayMonth: Date) => void;
  handlePopper: (open: boolean) => void;
  currentDate: Date;
  startMonth: Date;
  endMonth: Date;
};

type MiniCalendarOptions = {
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
  timezone?: string;
};

export const useMiniCalendar = (options?: MiniCalendarOptions) => {
  const timezone = options?.timezone ?? "UTC";

  const today = useMemo(
    () => DateTime.now().setZone(timezone).startOf("day"),
    [timezone]
  );

  const initialZonedDate = useMemo(() => {
    if (options?.initialDate) {
      return DateTime.fromJSDate(options.initialDate)
        .setZone(timezone, { keepLocalTime: true })
        .startOf("day");
    }
    return today;
  }, [options?.initialDate, timezone, today]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialZonedDate.toJSDate());
  const [displayMonth, setDisplayMonth] = useState<Date>(initialZonedDate.toJSDate());
  const [openPopper, setOpenPopper] = useState<boolean>(false);

  useEffect(() => {
    setSelectedDate(initialZonedDate.toJSDate());
    setDisplayMonth(initialZonedDate.toJSDate());
  }, [initialZonedDate]);

  const currentDate = today.toJSDate();
  const startMonth = today.startOf("month").toJSDate();
  const endMonth = today.plus({ years: 10 }).startOf("month").toJSDate();

  const handleDateSelect = (nextDate: Date | undefined): void => {
    if (!nextDate) return;
    if (options?.onDateChange) {
      options?.onDateChange?.(nextDate);
    } else {
      setSelectedDate(nextDate);
    }
  };

  const handleDisplayMonth = (nextMonth: Date): void => {
    if (!nextMonth) return;
    setDisplayMonth(nextMonth);
  };

  const handlePopper = (open: boolean): void => {
    setOpenPopper(open);

    if (!open && selectedDate.getMonth() !== displayMonth.getMonth()) {
      setDisplayMonth(selectedDate);
    }
  };

  return {
    selectedDate,
    displayMonth,
    openPopper,
    handleDateSelect,
    handleDisplayMonth,
    handlePopper,
    currentDate,
    startMonth,
    endMonth,
  };
};
