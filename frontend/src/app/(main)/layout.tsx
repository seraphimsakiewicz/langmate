import { Header } from "@/components/layout/header";
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
