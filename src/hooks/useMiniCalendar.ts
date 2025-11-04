"use client";

import { useState } from "react";

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
};

export const useMiniCalendar = (options?: MiniCalendarOptions) => {
  const [selectedDate, setSelectedDate] = useState<Date>(options?.initialDate ?? new Date());
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [openPopper, setOpenPopper] = useState<boolean>(false);

  const currentDate = new Date();

  const startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const endMonth = new Date(currentDate.getFullYear() + 10, 11, 1);

  const handleDateSelect = (selectedDate: Date | undefined): void => {
    if (!selectedDate) return;
    if (options?.onDateChange) {
      options?.onDateChange?.(selectedDate);
    } else {
      setSelectedDate(selectedDate);
    }
  };

  const handleDisplayMonth = (displayMonth: Date): void => {
    if (!displayMonth) return;
    setDisplayMonth(displayMonth);
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
