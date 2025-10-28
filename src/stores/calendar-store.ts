import { Session } from "@/types/calendar";
import { create } from "zustand";

interface CalendarStore {
  // SideBar state
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (newState: boolean) => void;
  userSetSidebarCollapsed: boolean;
  setUserSetSidebarCollapsed: (newState: boolean) => void;

  // Calendar mode
  calendarMode: "day" | "week";
  setCalendarMode: (mode: "day" | "week") => void;
  userSetViewMode: boolean;
  setUserSetViewMode: (newState: boolean) => void;

  // Sessions
  sessions: Session[];
  addSession: (session: Omit<Session, "id">) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  deleteSession: (sessionId: string) => void;

  // BookingModal
  openModal: boolean;
  setOpenModal: (newModalState: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
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
  userSetViewMode: false,
  setCalendarMode: (mode) => set({ calendarMode: mode, userSetViewMode: true }),
  sessions: [],
  addSession: (newSession: Omit<Session, "id">) =>
    set((state) => {
      const slotOccupied = [...state.sessions].some(
        (item) => newSession.date === item.date && newSession.startTime === item.startTime
      );

      if (slotOccupied) return state;

      const newSessionObject: Session = {
        ...newSession,
        id: `session-${Date.now()}`,
      };
      return { sessions: [...state.sessions, newSessionObject] };
    }),
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
