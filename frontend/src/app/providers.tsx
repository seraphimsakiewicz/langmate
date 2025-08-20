"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// If you use both shadcn toasts:
// import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create the QueryClient once
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        {children}
        {/* Mount your toasts once at the root */}
        <Sonner position="bottom-center" richColors duration={10000} />
        {/* Or, if you also need shadcn's non-sonner toaster: */}
        {/* <ShadcnToaster /> */}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
