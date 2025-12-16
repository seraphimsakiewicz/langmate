"use client";
import { useEffect, useRef, useState } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Page() {
  // A ref for the container div
  const callContainerRef = useRef<HTMLDivElement>(null!);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const { id } = useParams();

  // Create the call frame (Daily's prebuilt UI)
  const call = useCallFrame({
    parentElRef: callContainerRef,
    options: {
      showLeaveButton: true,
      iframeStyle: { width: "100%", height: "100%" },
    },
  });

  useEffect(() => {
    const getRoom = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sessions/room?id=${id}`);
      const data = await res.json();
      if (res.status === 200) {
        setRoomUrl(data.roomUrl);
      } else {
        console.log("error", data);
      }
    };
    getRoom();
  }, [id]);

  // Join when ready
  useEffect(() => {
    if (call && roomUrl) {
      // TODO: auto add username from profile 
      call.join({ url: roomUrl });
    }
  }, [call, roomUrl]);

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white">
      <header className="flex h-14 items-center justify-center border-b border-white/10 bg-black/60 px-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-semibold tracking-tight">Langmate</span>
        </div>
      </header>

      <main className="relative flex-1">
        {!roomUrl ? (
          <div className="flex h-full items-center justify-center text-sm text-white/70">Loading...</div>
        ) : (
          <DailyProvider callObject={call}>
            <div ref={callContainerRef} className="absolute inset-0" />
          </DailyProvider>
        )}
      </main>
    </div>
  );
}
