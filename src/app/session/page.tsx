"use client";
import { useEffect, useRef } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";

export default function Page() {
  // 1. A ref for the container div
  const callContainerRef = useRef<HTMLDivElement>(null!);

  // 2. Create the call frame (Daily's prebuilt UI)
  const call = useCallFrame({
    parentElRef: callContainerRef,
    options: {
      showLeaveButton: true,
      iframeStyle: { width: "100%", height: "100%" },
    },
  });

  // 3. Hardcoded room URL for testing
  const roomUrl = "https://englishchats.daily.co/jloumAq4E6iRMh7cEEaN";

  // 4. Join when ready
  useEffect(() => {
    if (call && roomUrl) {
      call.join({ url: roomUrl });
    }
  }, [call, roomUrl]);

  return (
    <div className="fixed inset-0 bg-gray-900">
      <DailyProvider callObject={call}>
        <div ref={callContainerRef} className="w-full h-full" />
      </DailyProvider>
    </div>
  );
}
