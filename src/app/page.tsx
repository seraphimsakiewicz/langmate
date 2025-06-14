"use client"
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Language, SessionData, SessionInfo, UserData, FindMatchData } from "@/types";

export default function Home() {
  const router = useRouter();
  const [nativeLanguage, setNativeLanguage] = useState<Language>("en");
  const [targetLanguage, setTargetLanguage] = useState<Language>("es");

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [isLookingForMatch, setIsLookingForMatch] = useState<boolean>(false);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
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

      toast.success(`You've been matched with socket.id: ${match.id}`, {
        description: "You can now start chatting with your langmate",
        dismissible: false,
        action: {
          label: "Join session starting in 30 seconds!!!",
          onClick: () => router.push(`/session/${sessionId}`),
        }
      })
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
  }, []);

  const handleMatchMe = () => {
    setIsLookingForMatch(true);
    const findMatchData: FindMatchData = {
      nativeLanguage,
      targetLanguage
    }
    socket.emit("find-match", findMatchData);
  }

  function handleConnect() {
    if (isMatched) {
      router.push(`/session/${sessionId}`)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col gap-2">
        <p>Connected: {isConnected ? "✅" : "❌"}</p>
        <p>Transport: {transport}</p>
      </div>
      <Card className="w-full max-w-md p-4">

        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">Find a langmate</h1>
            <p className="text-sm text-gray-500">
              Select your language and find a langmate to practice with.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <Select onValueChange={(value) => setNativeLanguage(value as Language)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your native language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setTargetLanguage(value as Language)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleMatchMe} className="w-full mt-4" disabled={!nativeLanguage || !targetLanguage || nativeLanguage === targetLanguage || isLookingForMatch}>
                {isLookingForMatch ? "Looking for match..." : "Match me"}
              </Button>
              {isMatched &&
                <Button onClick={handleConnect} className="w-full mt-4" disabled={!nativeLanguage || !targetLanguage || nativeLanguage === targetLanguage || isLookingForMatch}>
                  Join Session
                </Button>}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </main>
  )
}