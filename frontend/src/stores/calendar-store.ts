import { Session } from "@/types/calendar";
import { create } from "zustand";

//   const [openModal, setOpenModal] = useState<boolean>(false);
//   const [sessions, setSessions] = useState<Session[]>(dummySessions);
//   const [calendarMode, setCalendarMode] = useState<"day" | "week">("day");
//   const [currentView, setCurrentView] = useState<"calendar" | "sessions" | "people">("calendar");
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [userSetViewMode, setUserSetViewMode] = useState(false);
//   const [userSetSidebarCollapsed, setUserSetSidebarCollapsed] = useState(false);

interface CalendarStore {
  // SideBar state
  isSidebarCollapsed: boolean;
  userSetSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Calendar mode
  calendarMode: "day" | "week";
  userSetViewMode: boolean;
  setCalendarMode: (mode: "day" | "week") => void;

  // Sessions
  sessions: Session[];
  addSession: (session: Session) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  deleteSession: (sessionId: string) => void;

  // BookingModal
  openModal: boolean;
  setOpenModal: () => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  isSidebarCollapsed: false,
  userSetSidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
      // todo rename to userSetSidebar
      userSetSidebarCollapsed: true,
    })),
  calendarMode: "day",
  userSetViewMode: false,
  setCalendarMode: (mode) => set({ calendarMode: mode, userSetViewMode: true }),
  sessions: [],
  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
    })),
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
  setOpenModal: () =>
    set((state) => ({
      openModal: !state.openModal,
    })),
  openModal: false,
}));
