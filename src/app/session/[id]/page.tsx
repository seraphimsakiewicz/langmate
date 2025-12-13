"use client";
import { useEffect, useRef, useState } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";
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
    <div className="fixed inset-0 bg-gray-900">
      {!roomUrl ? (
        <p>Loading...</p>
      ) : (
        <DailyProvider callObject={call}>
          <div ref={callContainerRef} className="w-full h-full" />
        </DailyProvider>
      )}
    </div>
  );
}
