// import { createServer } from "node:http";
// import { Server } from "socket.io";
// import { v4 as uuidv4 } from "uuid";
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// const port = process.env.WS_PORT || 8080;

// const matches = [];

// const createRoom = async (sessionInfo) => {
//   const DAILY_API_KEY = process.env.DAILY_API_KEY;
//   if (!DAILY_API_KEY) {
//     throw new Error("Missing Daily API key");
//   }
//   const { startTime } = sessionInfo;
//   const dailyResponse = await fetch("https://api.daily.co/v1/rooms", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${DAILY_API_KEY}`,
//     },
//     body: JSON.stringify({
//       properties: {
//         // expires 2 minutes after the session starts
//         exp: Math.floor(new Date(startTime).getTime() / 1000) + 60,
//       },
//     }),
//   });

//   if (!dailyResponse.ok) {
//     const text = await dailyResponse.text();
//     throw new Error(text);
//   }
//   const newRoom = await dailyResponse.json();
//   return newRoom.url;
// };

// // redefine app, handler

// app.prepare().then(() => {
//   const httpServer = createServer(handler);

//   const io = new Server(httpServer);

//   io.on("connection", (socket) => {
//     // ...
//     socket.on("find-match", async (data) => {
//       console.log("matches", matches);
//       const foundMatch = matches.find(
//         (match) =>
//           match.nativeLanguage === data.targetLanguage &&
//           match.targetLanguage === data.nativeLanguage
//       );
//       if (foundMatch) {
//         const sessionInfo = {
//           sessionId: uuidv4(),
//           startTime: new Date(
//             new Date().getTime() + 1000 * 60 * 0.1
//           ).toString(),
//         };

//         const roomUrl = await createRoom(sessionInfo);

//         const combinedMatch = [
//           {
//             id: socket.id,
//             ...data,
//           },
//           foundMatch,
//           { ...sessionInfo, roomUrl: roomUrl },
//         ];
//         socket.emit("match-found", combinedMatch);
//         io.to(foundMatch.id).emit("match-found", combinedMatch);
//         matches.splice(matches.indexOf(foundMatch), 1);
//       } else {
//         matches.push({
//           id: socket.id,
//           nativeLanguage: data.nativeLanguage,
//           targetLanguage: data.targetLanguage,
//         });
//       }
//       console.log("matches", matches);
//     });
//   });

//   httpServer
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://localhost:${port}`);
//     });
// });
