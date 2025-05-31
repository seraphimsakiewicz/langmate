"use client"
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";

export default function Home() {
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

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

    function matchFound(data: any) {
      // console.log("match found", data);
      const match = data.find((match: any) => match.id !== socket.id);
      window.alert(`You've been matched with socket.id: ${match.id}`)
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
    // window.alert(`Match me: ${nativeLanguage} ${targetLanguage}`);
    console.log("looking for match on socket.id", socket.id)
    socket.emit("find-match", {
      nativeLanguage,
      targetLanguage
    });
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
              <Select onValueChange={setNativeLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your native language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleMatchMe} className="w-full mt-4" disabled={!nativeLanguage || !targetLanguage || nativeLanguage === targetLanguage}>Match me</Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </main>
  )
}