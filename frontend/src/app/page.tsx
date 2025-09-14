"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Language, SessionInfo, UserData, FindMatchData } from "@/types";
import { Calendar } from "@/components/calendar/Calendar";

export default function Home() {
  const router = useRouter();
  const [nativeLanguage, setNativeLanguage] = useState<Language>("en");
  const [targetLanguage, setTargetLanguage] = useState<Language>("es");

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [isLookingForMatch, setIsLookingForMatch] = useState<boolean>(false);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");

  /*   useEffect(() => {
      if (socket.connected) {
        onConnect();
      }
  
      function onConnect() {
        setIsConnected(true);
        setTransport(socket.io.engine.transport.name);
  
        socket.io.engine.on("upgrade", (transport) => {
          setTransport(transport.name);
        });
  
      }
  
      function onDisconnect() {
        setIsConnected(false);
        setTransport("N/A");
      }
  
      async function matchFound(data: SessionData) {
        // Get only the user data (first two items)
        const users = [data[0], data[1]];
        const sessionInfo = data[2] as SessionInfo | undefined;
        const match = users.find((user: UserData) => user.id !== socket.id) as UserData | undefined;
  
        if (!match) {
          toast.error("No match found");
          return;
        }
        // get session id from data
        const { sessionId } = sessionInfo as SessionInfo;
        setSessionId(sessionId);
        setIsMatched(true);
        localStorage.setItem(sessionId, JSON.stringify(
          data
        ));
  
        setIsLookingForMatch(false);
      }
  
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("match-found", matchFound);
  
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("match-found", matchFound);
      };
    }, []); */

  const handleMatchMe = () => {
    setIsLookingForMatch(true);
    const findMatchData: FindMatchData = {
      nativeLanguage,
      targetLanguage,
    };
    // socket.emit("find-match", findMatchData);
  };

  function handleConnect() {
    if (isMatched) {
      router.push(`/session/${sessionId}`);
    }
  }

  return (
    <main className="h-full overflow-hidden">
      <Calendar />
    </main>
  );
}
// TODO: below wil lbe new contents, need to take
/* import { redirect } from "next/navigation";

export default function AppHome() {
  redirect("/calendar");
} */
