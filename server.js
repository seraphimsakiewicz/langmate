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

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // ...
    socket.on("find-match", (data) => {
      console.log("matches", matches);
      const foundMatch = matches.find(
        (match) =>
          match.nativeLanguage === data.targetLanguage &&
          match.targetLanguage === data.nativeLanguage
      );
      if (foundMatch) {
        const combinedMatch = [
          {
            id: socket.id,
            ...data,
          },
          foundMatch,
          {
            sessionId: uuidv4(),
            startTime: new Date(new Date().getTime() + 1000 * 60 * 0.5).toString(),
          }
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
