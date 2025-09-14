import {
  Calendar as CalendarIcon,
  Users as UsersIcon,
  User as UserIcon,
  Menu as MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecondNavProps {
  currentView: "calendar" | "sessions" | "people";
  onViewChange: (view: "calendar" | "sessions" | "people") => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItemProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}
export const SecondNav = ({ currentView, onViewChange, onToggleCollapse }: SecondNavProps) => {
  return (
    <div className="border-b border-calendar-border bg-white">
      <div className="py-3">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={`p-2 mr-2 ${currentView !== "calendar" && "invisible"}`}
          >
            <MenuIcon className="size-[1.5rem]" />
          </Button>

          <NavItem onClick={() => onViewChange("calendar")} isActive={currentView === "calendar"}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </NavItem>
          <NavItem onClick={() => onViewChange("sessions")} isActive={currentView === "sessions"}>
            <UsersIcon className="mr-2 h-4 w-4" />
            Sessions
          </NavItem>
          <NavItem onClick={() => onViewChange("people")} isActive={currentView === "people"}>
            <UserIcon className="mr-2 h-4 w-4" />
            People
          </NavItem>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ isActive, onClick, children, className = "" }: NavItemProps) => (
  <Button
    variant="ghost"
    className={`px-4 py-2 ${className} ${
      isActive
        ? "bg-calendar-primary/10 text-black pointer-events-none font-medium border-b-2 border-calendar-primary"
        : "text-muted-foreground hover:text-foreground hover:underline"
    }`}
    onClick={onClick}
  >
    {children}
  </Button>
);
