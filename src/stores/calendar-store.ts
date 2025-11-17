import { Session, Profile } from "@/types/calendar";
import { create } from "zustand";

export interface CalendarStore {
  // Timezone
  profile: Profile;
  setProfile: (newProfile: Profile) => void;

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
  addSession: (localStartTime: string) => Promise<Session | undefined>;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  deleteSession: (sessionId: string) => void;

  // BookingModal
  openModal: boolean;
  setOpenModal: (newModalState: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  profile: { id: "", timezone: "UTC", native_language_id: "" },
  setProfile: (newProfile: Profile) =>
    set(() => ({
      profile: newProfile,
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
  deleteSession: async (sessionId) => {
    const res = await fetch("/api/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) {
      console.error("Failed to delete session with id:", sessionId);
      return;
    }
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== sessionId),
    }));
  },
  setOpenModal: (newModalState: boolean) =>
    set(() => ({
      openModal: newModalState,
    })),
  openModal: false,
}));
