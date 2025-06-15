"use client"
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Language, SessionData } from "@/types";
import { useRouter } from "next/navigation";
import { DailyProvider, useCallFrame } from '@daily-co/daily-react';
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";

type SessionPhase = "LOADING" | "WAITING" | "FIRST_LANG" | "SECOND_LANG" | "DONE";
type PageParams = {
    sessionId: string;
}

export default function SessionPage() {
    const { sessionId } = useParams<PageParams>();
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [timeTillSwitch, setTimeTillSwitch] = useState<string>("");
    const [startTime, setStartTime] = useState<number>(0);
    const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
    // LOADING, WAITING, FIRST_LANG, SECOND_LANG, DONE
    const [sessionPhase, setSessionPhase] = useState<SessionPhase>("LOADING");
    const [roomUrl, setRoomUrl] = useState<string>("");

    // Create a ref for the Daily iframe container

    // null! is a non-null assertion operator, it tells the compiler that the value is not null.
    const callContainerRef = useRef<HTMLDivElement>(null!);
    const confettiRef = useRef<ConfettiRef>(null);


    // Create the Daily call frame (Prebuilt UI) and attach it to our div:
    const call = useCallFrame({
        parentElRef: callContainerRef,
        options: {
            showLeaveButton: false,            // hide Daily's default leave button
            iframeStyle: { width: '100%', height: '100%' }  // make iframe fill its container
        }
    });

    useEffect(() => {
        // This ONLY runs on the client after component mounts
        const data: Partial<SessionData> = JSON.parse(localStorage.getItem(sessionId as string) || "{}");
        console.log("data", data);
        if (data[2]?.startTime) {
            setStartTime(new Date(data[2].startTime).getTime());
            setSessionPhase("WAITING");
            setRoomUrl(data[2].roomUrl);
        }
    }, [sessionId]);

    // TODO: add harp sound after session ends should be 3-4 seconds long.
    // Figure out how to kick out the user after the session ends, without the UI showing though.

    useEffect(() => {

        if (startTime === 0) return;
        const timer = setInterval(function () {
            // Get current date and time
            const now = new Date().getTime();
            const switchTime = startTime + (0.10 * 60 * 1000);
            const sessionEndTime = startTime + (0.20 * 60 * 1000);

            if (now < startTime) {
                setSessionPhase("WAITING");
                // Find the distance between now and the count down date
                const distance = startTime - now;

                // Time calculations for days, hours, minutes and seconds
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft(`${minutes}m ${seconds}s`);
                setTimeTillSwitch("");
            } else if (now < switchTime) {
                setSessionPhase("FIRST_LANG");
                const sessionTimeLeft = sessionEndTime - now;
                const switchTimeLeft = switchTime - now

                const sessionMinutes = Math.floor(sessionTimeLeft / (1000 * 60));
                const sessionSeconds = Math.floor((sessionTimeLeft % (1000 * 60)) / 1000);
                const switchMinutes = Math.floor(switchTimeLeft / (1000 * 60));
                const switchSeconds = Math.floor((switchTimeLeft % (1000 * 60)) / 1000);

                setTimeLeft(`${sessionMinutes}m ${sessionSeconds}s`);
                setTimeTillSwitch(`${switchMinutes}m ${switchSeconds}s`);
            } else if (now < sessionEndTime) {
                setCurrentLanguage("es")
                setSessionPhase("SECOND_LANG");
                const sessionTimeLeft = sessionEndTime - now;
                const sessionMinutes = Math.floor(sessionTimeLeft / (1000 * 60));
                const sessionSeconds = Math.floor((sessionTimeLeft % (1000 * 60)) / 1000);

                setTimeLeft(`${sessionMinutes}m ${sessionSeconds}s`);
                setTimeTillSwitch("");
            } else {
                setSessionPhase("DONE");
                setTimeLeft("0m 0s");
                const audio = new Audio("/sounds/session-end.mp3")
                audio.play();
                // confettiRef.current?.fire();
                clearInterval(timer);
            }

        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    useEffect(() => {
        if (call && roomUrl) {
            call.join({ url: roomUrl });
        }
    }, [call, roomUrl]);


    const renderDisplay = () => {
        switch (sessionPhase) {
            case "LOADING":
                return <div>Loading session...</div>
            case "WAITING":
                return (
                    <div>
                        <p>Starting in: {timeLeft}</p>
                    </div>
                )
            case "FIRST_LANG":
                return (
                    <div>
                        <p>Session ends in: {timeLeft}</p>
                        <p>Time till switch: {timeTillSwitch}</p>
                        <p>Current language: {currentLanguage}</p>
                    </div>
                )
            case "SECOND_LANG":
                return <div>
                    <p>Session ends in: {timeLeft}</p>
                    <p>Current language: {currentLanguage}</p>
                </div>
            case "DONE":
                return <div>Done...</div>
            default:
                return <div>Loading...</div>
        }
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-900">
            {/* Top Navigation Header */}
            <div className="h-20 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90">
                {/* Left: User Profile Card */}
                <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                        <div className="font-semibold text-gray-900">Partner Name</div>
                        <div className="text-sm text-gray-600">Language Partner</div>
                    </div>
                </div>

                {/* Center: Langmate Branding */}
                <h1 className="text-2xl font-bold text-white">Langmate</h1>

                {/* Right: Timer and Controls */}
                <div className="flex items-center space-x-4">
                    <div className="bg-white rounded-lg px-4 py-2">
                        <div className="text-sm text-gray-600">
                            {/* TODO: fix the UI, to make it look better with the 2 timers. */}
                            {renderDisplay()}
                        </div>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg" onClick={async () => {
                        localStorage.removeItem(sessionId as string);
                        router.push("/");
                    }}>
                        Leave
                    </button>
                </div>
            </div>



            <DailyProvider callObject={call}>
                <Confetti
                    ref={confettiRef}
                    className="absolute top-20 left-1/2 right-1/2 bottom-0 pointer-events-none z-50"
                    manualstart={false}  // Explicitly set to auto-fire on mount
                    options={{
                        particleCount: 500,
                        origin: { x: .75, y: 0.2 }
                    }}
                // manualstart={true}
                // activates the confetti on mount of page, to test it.
                />
                <div ref={callContainerRef} className="w-full h-full" />
            </DailyProvider>
        </div>
    )
}