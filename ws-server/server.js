import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const matches = [];

const createRoom = async (sessionInfo) => {
  const DAILY_API_KEY = process.env.DAILY_API_KEY;
  if (!DAILY_API_KEY) {
    throw new Error("Missing Daily API key");
  }
  const { startTime } = sessionInfo;
  const dailyResponse = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        // expires 2 minutes after the session starts
        exp: Math.floor(new Date(startTime).getTime() / 1000) + 60,
      },
    }),
  });

  if (!dailyResponse.ok) {
    const text = await dailyResponse.text();
    throw new Error(text);
  }
  const newRoom = await dailyResponse.json();
  return newRoom.url;
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // ...
    socket.on("find-match", async (data) => {
      console.log("matches", matches);
      const foundMatch = matches.find(
        (match) =>
          match.nativeLanguage === data.targetLanguage &&
          match.targetLanguage === data.nativeLanguage
      );
      if (foundMatch) {
        const sessionInfo = {
          sessionId: uuidv4(),
          startTime: new Date(
            new Date().getTime() + 1000 * 60 * 0.10
          ).toString(),
        };

        const roomUrl = await createRoom(sessionInfo);

        const combinedMatch = [
          {
            id: socket.id,
            ...data,
          },
          foundMatch,
          { ...sessionInfo, roomUrl: roomUrl },
        ];
        socket.emit("match-found", combinedMatch);
        io.to(foundMatch.id).emit("match-found", combinedMatch);
        matches.splice(matches.indexOf(foundMatch), 1);
      } else {
        matches.push({
          id: socket.id,
          nativeLanguage: data.nativeLanguage,
          targetLanguage: data.targetLanguage,
        });
      }
      console.log("matches", matches);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
