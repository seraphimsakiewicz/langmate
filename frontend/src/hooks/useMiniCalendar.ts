import { useState } from "react";

export const useMiniCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [openPopper, setOpenPopper] = useState<boolean>(false);

  const currentDate = new Date();

  const startMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const endMonth = new Date(currentDate.getFullYear() + 10, 11, 1);

  const shortUS = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const handleDisplayMonth = (date: Date) => {
    if (!date) return;
    setDisplayMonth(date)
  }

  const handlePopper = (open: boolean) => {
    setOpenPopper(open);

    if (!open && selectedDate.getMonth() !== displayMonth.getMonth()) {
      setDisplayMonth(selectedDate);
    }
  }

  return {
    selectedDate,
    displayMonth,
    openPopper,
    setDisplayMonth,
    setSelectedDate,
    handleDateSelect,
    handleDisplayMonth,
    handlePopper,
    currentDate,
    startMonth,
    endMonth,
    shortUS,
  };
}