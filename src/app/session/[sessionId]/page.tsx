"use client"
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useState } from "react";
import DailyIframe from "@daily-co/daily-js";
import { Language, SessionData } from "@/types";

type SessionPhase = "LOADING" | "WAITING" | "FIRST_LANG" | "SECOND_LANG" | "DONE";
type PageParams = {
    sessionId: string;
}

export default function SessionPage() {
    const { sessionId } = useParams<PageParams>();
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [timeTillSwitch, setTimeTillSwitch] = useState<string>("");
    const [startTime, setStartTime] = useState<number>(0);
    const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
    // LOADING, WAITING, FIRST_LANG, SECOND_LANG, DONE
    const [sessionPhase, setSessionPhase] = useState<SessionPhase>("LOADING");

    // Create a ref for the Daily iframe container
    const callFrameRef = useRef<HTMLDivElement>(null);
    const dailyRef = useRef<any>(null);
    const isCreatingRef = useRef<boolean>(false);
    const roomUrl = `https://englishchats.daily.co/langmate-demo`;

    useEffect(() => {
        // This ONLY runs on the client after component mounts
        const data: Partial<SessionData> = JSON.parse(localStorage.getItem(sessionId as string) || "{}");
        if (data[2]?.startTime) {
            setStartTime(new Date(data[2].startTime).getTime());
            setSessionPhase("WAITING");
        }
    }, [sessionId]);

    useEffect(() => {

        if (startTime === 0) return;
        const timer = setInterval(function () {
            // Get current date and time
            const now = new Date().getTime();
            const switchTime = startTime + (0.5 * 60 * 1000);
            const sessionEndTime = startTime + (1 * 60 * 1000);

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
                clearInterval(timer);
            }

        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    useEffect(() => {
        // Prevent creating multiple instances
        if (isCreatingRef.current || dailyRef.current) {
            return;
        }

        // Create Daily iframe when component mounts
        if (callFrameRef.current) {
            isCreatingRef.current = true;

            try {
                dailyRef.current = DailyIframe.createFrame(callFrameRef.current, {
                    iframeStyle: {
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '8px'
                    },
                    showLeaveButton: true,
                    showFullscreenButton: true,
                });

                // Join the room
                dailyRef.current.join({ url: roomUrl });
            } catch (error) {
                console.error('Error creating Daily iframe:', error);
            } finally {
                isCreatingRef.current = false;
            }
        }

        // Cleanup on unmount
        return () => {
            if (dailyRef.current) {
                try {
                    dailyRef.current.destroy();
                } catch (error) {
                    console.error('Error destroying Daily iframe:', error);
                }
                dailyRef.current = null;
            }
            isCreatingRef.current = false;
        };
    }, []); // Empty dependency array - only run once

    const renderDisplay = () => {
        switch (sessionPhase) {
            case "LOADING":
                return <div>Loading session...</div>
            case "WAITING":
                return (
                    <div>
                        <p>Session starts in: {timeLeft}</p>
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
        <div>
            <div>SessionPage {sessionId}</div>
            {renderDisplay()}
            {/* Daily Prebuilt Video Interface */}
            <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <div ref={callFrameRef} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    )
}