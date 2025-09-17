import {
  Calendar as CalendarIcon,
  Users as UsersIcon,
  User as UserIcon,
  Menu as MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCalendarStore } from "@/stores/calendar-store";
import { MiniCalendarProps, useMiniCalendar } from "@/hooks/useMiniCalendar";

interface NavItemProps {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}
export const SecondNav = () => {
  const pathName = usePathname();
  const { toggleSidebar } = useCalendarStore();

  const getCurrentView = () => {
    if (pathName.includes("/calendar")) return "calendar";
    if (pathName.includes("/sessions")) return "sessions";
    if (pathName.includes("/people")) return "people";
  };

  const currentView = getCurrentView();
  return (
    <div className="border-b border-calendar-border bg-white">
      <div className="py-3">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={`p-2 mr-2 ${currentView !== "calendar" && "invisible"}`}
          >
            <MenuIcon className="size-[1.5rem]" />
          </Button>

          <NavItem isActive={currentView === "calendar"}>
            <Link href="/calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </NavItem>
          <NavItem isActive={currentView === "sessions"}>
            <Link href="/sessions">
              <UsersIcon className="mr-2 h-4 w-4" />
              Sessions
            </Link>
          </NavItem>
          <NavItem isActive={currentView === "people"}>
            <Link href="/people">
              <UserIcon className="mr-2 h-4 w-4" />
              People
            </Link>
          </NavItem>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ isActive, children, className = "" }: NavItemProps) => (
  <Button
    variant="ghost"
    className={`px-4 py-2 ${className} ${
      isActive
        ? "bg-calendar-primary/10 text-black pointer-events-none font-medium border-b-2 border-calendar-primary"
        : "text-muted-foreground hover:text-foreground hover:underline"
    }`}
  >
    {children}
  </Button>
);
