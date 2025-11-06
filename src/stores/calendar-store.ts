import { Session } from "@/types/calendar";
import { create } from "zustand";

interface CalendarStore {
  // Timezone
  timezone: string | null;
  setTimezone: (zone: string) => void;

  // SideBar state
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (newState: boolean) => void;
  userSetSidebarCollapsed: boolean;
  setUserSetSidebarCollapsed: (newState: boolean) => void;

  // Calendar mode
  calendarMode: "day" | "week";
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
  setCalendarMode: (mode: "day" | "week") => void;
  userSetViewMode: boolean;
  setUserSetViewMode: (newState: boolean) => void;

  // Sessions
  sessions: Session[];
  addSession: (startTime: string) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  deleteSession: (sessionId: string) => void;

  // BookingModal
  openModal: boolean;
  setOpenModal: (newModalState: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  timezone: null,
  setTimezone: (zone: string) =>
    set(() => ({
      timezone: zone,
    })),
  isSidebarCollapsed: false,
  userSetSidebarCollapsed: false,
  setIsSidebarCollapsed: (newState: boolean) =>
    set(() => ({
      isSidebarCollapsed: newState,
    })),
  setUserSetSidebarCollapsed: (newState: boolean) =>
    set(() => ({
      userSetSidebarCollapsed: newState,
    })),
  setUserSetViewMode: (newState: boolean) =>
    set(() => ({
      userSetViewMode: newState,
    })),
  calendarMode: "day",
  calendarDate: new Date(),
  setCalendarDate: (date: Date) => set({ calendarDate: date }),
  userSetViewMode: false,
  setCalendarMode: (mode) => set({ calendarMode: mode, userSetViewMode: true }),
  sessions: [],
  addSession: async (localStartTime: string) => {
    try {
      console.log("in addsession with localStartTime:", localStartTime);
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localStartTime }),
      });
      if (!res.ok) throw new Error("Failed to create session");
      const { session } = await res.json(); // session.start_time is ISO string
      console.log("Created session:", session);
      set((state) => ({
        sessions: [...state.sessions, session],
      }));
      return session;
    } catch (error) {
      console.error("Error in addSession:", error);
      set((state) => ({
        sessions: [...state.sessions],
      }));
    }
  },
  updateSession: (sessionId, updates) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session
      ),
    })),
  deleteSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== sessionId),
    })),
  setOpenModal: (newModalState: boolean) =>
    set(() => ({
      openModal: newModalState,
    })),
  openModal: false,
}));
