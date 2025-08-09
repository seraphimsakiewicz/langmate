"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Minute = 0 | 30;
type Slot = { date: string; day: number; hour: number; minute: Minute };
type Session = {
  id: string;
  date: string;
  day: number;
  hour: number;
  minute: Minute;
  label: string;
};

const ACCENT = "rgb(14,187,253)";
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ROW_H = 64; // was 48 - larger hour blocks

const pad = (n: number) => n.toString().padStart(2, "0");
const fmtAMPM = (h: number, m: number) => {
  const ap = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${ap}`;
};
const add25 = (h: number, m: number) => {
  let t = h * 60 + m + 25;
  if (t > 24 * 60) t = 24 * 60;
  return { h: Math.floor(t / 60), m: t % 60 };
};

function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  const dow = (x.getDay() + 6) % 7;
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - dow);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function addWeeks(d: Date, n: number) {
  return addDays(d, n * 7);
}
function toDateInputValue(d: Date) {
  const z = new Date(d);
  z.setMinutes(z.getMinutes() - z.getTimezoneOffset());
  return z.toISOString().slice(0, 10);
}
function toISODateLocal(d: Date) {
  const z = new Date(d);
  z.setMinutes(z.getMinutes() - z.getTimezoneOffset());
  return z.toISOString().slice(0, 10);
}

/* =============================== Component =============================== */
export default function WeeklyScheduler() {
  const initialMonday = useMemo(() => startOfWeekMonday(new Date()), []);
  const [weekAnchor, setWeekAnchor] = useState(initialMonday);
  const [dayMode, setDayMode] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [selected, setSelected] = useState<Slot | null>(null);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  const dateByDay = (d: number) => toISODateLocal(addDays(weekAnchor, d));

  // tie sessions to real dates so week nav filters correctly
  const [sessions, setSessions] = useState<Session[]>(() => {
    const wed = addDays(initialMonday, 2);
    const date = toISODateLocal(wed);
    return [
      { id: "a", date, day: 2, hour: 18, minute: 0, label: "Matching..." },
      { id: "b", date, day: 2, hour: 18, minute: 30, label: "Terence M." },
    ];
  });

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setSelected(null);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function onPickDate(val: string) {
    const picked = new Date(val + "T00:00:00");
    setWeekAnchor(startOfWeekMonday(picked));
    setActiveDay(((picked.getDay() + 6) % 7) as number);
    setSelected(null);
  }

  function confirmBook(slot: Slot) {
    const exists = sessions.some(
      (s) =>
        s.date === slot.date && s.hour === slot.hour && s.minute === slot.minute
    );
    if (exists) {
      setSelected(null);
      return;
    } // hard guard
    setSessions((prev) =>
      prev.concat({
        id: crypto.randomUUID(),
        date: slot.date,
        day: slot.day,
        hour: slot.hour,
        minute: slot.minute,
        label: "Matching...",
      })
    );
    setSelected(null);
  }

  function removeAt(slot: Slot) {
    setSessions((prev) =>
      prev.filter(
        (s) =>
          !(
            s.date === slot.date &&
            s.hour === slot.hour &&
            s.minute === slot.minute
          )
      )
    );
    setSelected(null);
  }

  const colDays = dayMode ? [activeDay] : days;
  const headerDates = colDays.map((d) =>
    addDays(weekAnchor, d).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  );

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden border bg-white"
      style={{ borderColor: "#e5e7eb" }}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2">
        <div className="text-lg font-semibold">Langmate Calendar</div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              className="border px-2 py-1 text-sm"
              onClick={() => (
                setWeekAnchor((w) => addWeeks(w, -1)), setSelected(null)
              )}
            >
              ← Week
            </button>
            <button
              className="border px-2 py-1 text-sm"
              onClick={() => (setWeekAnchor(initialMonday), setSelected(null))}
            >
              Today
            </button>
            <button
              className="border px-2 py-1 text-sm"
              onClick={() => (
                setWeekAnchor((w) => addWeeks(w, 1)), setSelected(null)
              )}
            >
              Week →
            </button>
          </div>
          <div className="ml-2 flex items-center gap-1">
            <label className="text-sm">Day mode</label>
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={dayMode}
              onChange={(e) => setDayMode(e.target.checked)}
            />
            {dayMode && (
              <select
                className="border px-2 py-1 text-sm"
                value={activeDay}
                onChange={(e) => setActiveDay(parseInt(e.target.value))}
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {dayNames[d]}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="ml-2 flex items-center gap-1">
            <button
              className="border px-2 py-1 text-sm"
              onClick={() => (
                setWeekAnchor((w) => addWeeks(w, -1)), setSelected(null)
              )}
            >
              ←
            </button>
            <input
              type="date"
              className="border px-2 py-1 text-sm"
              value={toDateInputValue(weekAnchor)}
              onChange={(e) => onPickDate(e.target.value)}
            />
            <button
              className="border px-2 py-1 text-sm"
              onClick={() => (
                setWeekAnchor((w) => addWeeks(w, 1)), setSelected(null)
              )}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid grid-cols-[100px_repeat(var(--cols),1fr)] border-b px-2 py-2 text-sm"
        style={{ ["--cols" as any]: colDays.length }}
      >
        <div className="text-right pr-2 text-gray-500">EDT</div>
        {headerDates.map((label, i) => (
          <div key={i} className="text-center font-medium">
            {label}
          </div>
        ))}
      </div>

      {/* Scrollable grid */}
      <div
        className="grid grid-cols-[100px_repeat(var(--cols),1fr)] overflow-y-auto"
        style={{ maxHeight: 640, ["--cols" as any]: colDays.length }}
      >
        <TimeGutter />
        {colDays.map((day) => (
          <div key={`dcol-${day}`} className="relative">
            {Array.from({ length: 24 }, (_, h) => (
              <HourRow
                key={`d${day}-h${h}`}
                day={day}
                hour={h}
                date={dateByDay(day)}
                sessions={sessions}
                selected={selected}
                setSelected={setSelected}
                onConfirm={confirmBook}
                onRemove={removeAt}
              />
            ))}
            {/* Midnight row */}
            <div
              className="h-[var(--row)] opacity-60"
              style={{ ["--row" as any]: `${ROW_H}px` }}
            >
              <div
                className="h-full w-full border-t border-b"
                style={{ borderColor: "rgba(14,187,253,0.25)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function TimeGutter() {
  return (
    <div className="border-r">
      {Array.from({ length: 24 }, (_, h) => (
        <div
          key={`g-${h}`}
          className="h-[calc(2*var(--row))]"
          style={{ ["--row" as any]: `${ROW_H}px` }}
        >
          <div className="flex h-[var(--row)] items-start justify-end pr-2 text-xs text-gray-600">
            {fmtAMPM(h, 0)}
          </div>
          <div className="flex h-[var(--row)] items-start justify-end pr-2 text-xs text-gray-400">
            {fmtAMPM(h, 30)}
          </div>
        </div>
      ))}
      <div
        className="h-[var(--row)]"
        style={{ ["--row" as any]: `${ROW_H}px` }}
      >
        <div className="flex h-full items-center justify-end pr-2 text-xs text-gray-400">
          Midnight
        </div>
      </div>
    </div>
  );
}

function HourRow(props: {
  day: number;
  hour: number;
  date: string;
  sessions: Session[];
  selected: Slot | null;
  setSelected: React.Dispatch<React.SetStateAction<Slot | null>>;
  onConfirm: (s: Slot) => void;
  onRemove: (s: Slot) => void;
}) {
  const {
    day,
    hour,
    date,
    sessions,
    selected,
    setSelected,
    onConfirm,
    onRemove,
  } = props;
  return (
    <div className="relative" style={{ height: ROW_H * 2 }}>
      {/* put borders behind everything and ignore pointer events */}
      <div
        className="pointer-events-none absolute inset-0 border z-0"
        style={{ borderColor: "rgba(14,187,253,0.35)" }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-1/2 border-t border-dotted z-0"
        style={{ borderColor: "rgba(14,187,253,0.22)" }}
      />
      <Cell
        {...{
          day,
          hour,
          minute: 0 as Minute,
          date,
          sessions,
          selected,
          setSelected,
          onConfirm,
          onRemove,
        }}
      />
      <Cell
        {...{
          day,
          hour,
          minute: 30 as Minute,
          date,
          sessions,
          selected,
          setSelected,
          onConfirm,
          onRemove,
        }}
      />
    </div>
  );
}

const POPOVER_H = 64; // height of the confirm popover

function Cell({
  day,
  hour,
  minute,
  date,
  sessions,
  selected,
  setSelected,
  onConfirm,
  onRemove,
}: {
  day: number;
  hour: number;
  minute: Minute;
  date: string;
  sessions: Session[];
  selected: Slot | null;
  setSelected: React.Dispatch<React.SetStateAction<Slot | null>>;
  onConfirm: (s: Slot) => void;
  onRemove: (s: Slot) => void;
}) {
  const slot: Slot = { date, day, hour, minute };
  const { h: eh, m: em } = add25(hour, minute);

  const here = sessions.filter(
    (s) =>
      s.date === date && s.day === day && s.hour === hour && s.minute === minute
  );
  const exists = here.length > 0;

  const isSelected =
    !!selected &&
    selected.date === date &&
    selected.day === day &&
    selected.hour === hour &&
    selected.minute === minute;

  // When the slot is selected *and* already booked, show the card below the popover
  // Otherwise, card sits near the top of the slot with a small gap
  const cardTop = isSelected && exists ? POPOVER_H + 6 : 6;

  return (
    <div
      className="absolute left-0 right-0 z-10"
      style={{ height: ROW_H, top: minute === 0 ? 0 : ROW_H }}
    >
      {/* The slot surface */}
      <button
        className="relative z-10 h-full w-full cursor-pointer text-left focus:outline-none"
        onClick={() => setSelected(slot)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setSelected(slot);
        }}
        style={{ boxShadow: isSelected ? `inset 0 0 0 2px ${ACCENT}` : "none" }}
        onMouseEnter={(e) => {
          if (!isSelected)
            (
              e.currentTarget as HTMLButtonElement
            ).style.boxShadow = `inset 0 0 0 2px ${ACCENT}`;
        }}
        onMouseLeave={(e) => {
          if (!isSelected)
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >
        {/* Confirm container INSIDE the slot */}
        {isSelected && (
          <div
            className="absolute left-1 right-1 z-50 flex flex-col gap-2 border bg-white p-2"
            style={{ borderColor: ACCENT, top: 4, height: POPOVER_H }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm text-white disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
                disabled={exists}
                onClick={() => onConfirm(slot)}
              >
                Book
              </button>
              <button
                className="border px-3 py-1 text-sm"
                style={{ borderColor: ACCENT, color: ACCENT }}
                onClick={() => console.log("More", slot)}
              >
                More
              </button>
            </div>
            <button
              className="border px-3 py-1 text-sm"
              style={{ borderColor: ACCENT, color: ACCENT }}
              onClick={() => (exists ? onRemove(slot) : setSelected(null))}
            >
              {exists ? "Remove" : "Cancel"}
            </button>
          </div>
        )}

        {/* Session card – always render when it exists; sits below the popover if open */}
        {here.map((s) => (
          <div
            key={s.id}
            className="absolute left-[2px] right-[2px] bg-white px-2 text-xs"
            style={{
              top: cardTop,
              height: `calc(${ROW_H}px * (25/30))`,
              border: `2px solid ${ACCENT}`,
              borderRadius: 0,
              boxShadow: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex h-full items-center justify-between">
              <span className="truncate">
                {fmtAMPM(hour, minute)} — {fmtAMPM(eh, em)}
              </span>
              {/* Cancel (X) button always visible on the card */}
              <button
                className="absolute right-1 top-1 h-5 w-5 leading-[18px] text-center"
                title="Cancel"
                style={{
                  border: `1px solid ${ACCENT}`,
                  color: ACCENT,
                  background: "#fff",
                }}
                onClick={() => onRemove(slot)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </button>
    </div>
  );
}
