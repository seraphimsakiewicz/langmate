import { SecondNav } from "@/components/layout/second-nav";
import { BookingModal } from "@/components/calendar/BookingModal";
import { Header } from "@/components/layout/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-hidden">
          <div className="flex flex-col h-screen bg-background">
            <SecondNav />
            <div className="flex-1 overflow-hidden">{children}</div>
            <BookingModal />
          </div>
        </main>
      </div>
    </div>
  );
}
