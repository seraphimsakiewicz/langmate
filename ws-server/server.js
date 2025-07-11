const { v4: uuidv4 } = require('uuid');
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const server = createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(
    "WebSocket Server Running, psst sign up for the waitlist at langmate.io"
  );
});
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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

const port = process.env.WS_PORT || 8080;

server.listen(port, () => {
  console.log(`🚀 WebSocket Server running on port ${port}`);
});

io.on("connection", (socket) => {
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
        startTime: new Date(new Date().getTime() + 1000 * 60 * 0.1).toString(),
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
