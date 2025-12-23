"use client";
import { useEffect, useRef, useState } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  // A ref for the container div
  const callContainerRef = useRef<HTMLDivElement>(null!);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [names, setNames] = useState<{ userName: string; partnerName: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();
  const { id } = useParams();

  // Create the call frame (Daily's prebuilt UI)
  const call = useCallFrame({
    parentElRef: callContainerRef,
    options: {
      showLeaveButton: false,
      iframeStyle: { width: "100%", height: "100%" },
    },
  });

  useEffect(() => {
    const getRoom = async () => {
      const res = await fetch(`/api/sessions/room?id=${id}`);
      const data = await res.json();
      if (res.status === 200) {
        setRoomUrl(data.roomUrl);
        setStartTime(data.startTime);
        setNames({ userName: data.userName, partnerName: data.partnerName });
      } else {
        console.log("error", data);
      }
    };
    getRoom();
  }, [id]);

  useEffect(() => {
    if (!startTime) return;

    const endTime = new Date(startTime).getTime() + 30 * 60 * 1000;
    const updateTimeLeft = () => {
      const diff = endTime - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTimeLeft();
    const timerId = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [startTime]);

  // Join when ready
  useEffect(() => {
    if (call && roomUrl) {
      // TODO: auto add userName prop from profile
      call.join({ url: roomUrl, userName: names?.userName || "Guest" });
    }
  }, [call, roomUrl]);

  const formatTimeLeft = (ms: number | null) => {
    if (ms === null) return "--:--";
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleLeave = async () => {
    try {
      await call?.leave();
    } catch (error) {
      console.error("Error leaving call", error);
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur">
        <div />

        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-3xl font-semibold tracking-tight">Swaptalk</span>
          <p className="text-xs text-white/70 sm:text-sm">
            Decide who starts. Set a timer for half the time that's left, then switch!
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="flex flex-col items-center rounded-lg bg-white/10 px-3 py-2 text-sm shadow">
            <span className="text-xs uppercase text-white/70">Ends in</span>
            <span className="text-lg font-semibold tabular-nums">{formatTimeLeft(timeLeft)}</span>
          </div>
          <button
            onClick={handleLeave}
            className="rounded-md hover:cursor-pointer bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Leave
          </button>
        </div>
      </header>

      <main className="relative flex-1">
        {!roomUrl ? (
          <div className="flex h-full items-center justify-center text-sm text-white/70">
            Loading...
          </div>
        ) : (
          <DailyProvider callObject={call}>
            <div ref={callContainerRef} className="absolute inset-0" />
          </DailyProvider>
        )}
      </main>
    </div>
  );
}
