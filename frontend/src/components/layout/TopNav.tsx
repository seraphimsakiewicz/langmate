import {
  Calendar as CalendarIcon,
  Users as UsersIcon,
  User as UserIcon,
  Menu as MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  currentView: "calendar" | "sessions" | "people";
  onViewChange: (view: "calendar" | "sessions" | "people") => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const TopNav = ({ currentView, onViewChange, onToggleCollapse }: TopNavProps) => {
  return (
    <div className="border-b border-calendar-border bg-white">
      <div className="py-3">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={`p-2 mr-2 ${
              currentView !== "calendar" ? "invisible" : "hover:cursor-pointer"
            }`}
          >
            <MenuIcon className="size-[1.5rem]" />
          </Button>

          <Button
            variant="ghost"
            className={`px-4 py-2 ${
              currentView === "calendar"
                ? "bg-calendar-primary/10 text-calendar-primary font-medium border-b-2 border-calendar-primary"
                : "text-muted-foreground hover:text-foreground hover:cursor-pointer"
            }`}
            onClick={() => onViewChange("calendar")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant="ghost"
            className={`px-4 py-2 ${
              currentView === "sessions"
                ? "bg-calendar-primary/10 text-calendar-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:cursor-pointer"
            }`}
            onClick={() => onViewChange("sessions")}
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Sessions
          </Button>
          <Button
            variant="ghost"
            className={`px-4 py-2 ${
              currentView === "people"
                ? "bg-calendar-primary/10 text-calendar-primary font-medium border-b-2 border-calendar-primary"
                : "text-muted-foreground hover:text-foreground hover:cursor-pointer"
            }`}
            onClick={() => onViewChange("people")}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            People
          </Button>
        </div>
      </div>
    </div>
  );
};
