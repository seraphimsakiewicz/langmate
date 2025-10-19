import { Header } from "@/components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <Header />
      {children}
    </div>
  );
}
