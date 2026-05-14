import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import express from "express";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

interface Participant {
  id: string;
  name: string;
  vote: string | null;
}

interface Room {
  participants: Map<string, Participant>;
  revealed: boolean;
}

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  const io = new Server(server);

  const rooms = new Map<string, Room>();

  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId, userName }) => {
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          participants: new Map(),
          revealed: false,
        });
      }
      
      const room = rooms.get(roomId)!;
      room.participants.set(socket.id, { id: socket.id, name: userName, vote: null });
      
      io.to(roomId).emit("room-update", {
        participants: Array.from(room.participants.values()),
        revealed: room.revealed,
      });
    });

    socket.on("vote", ({ roomId, vote }) => {
      const room = rooms.get(roomId);
      if (room && room.participants.has(socket.id)) {
        room.participants.get(socket.id)!.vote = vote;
        io.to(roomId).emit("room-update", {
          participants: Array.from(room.participants.values()),
          revealed: room.revealed,
        });
      }
    });

    socket.on("reveal", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.revealed = true;
        io.to(roomId).emit("room-update", {
          participants: Array.from(room.participants.values()),
          revealed: room.revealed,
        });
      }
    });

    socket.on("reset", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.revealed = false;
        room.participants.forEach((p) => (p.vote = null));
        io.to(roomId).emit("room-update", {
          participants: Array.from(room.participants.values()),
          revealed: room.revealed,
        });
      }
    });

    socket.on("disconnect", () => {
      rooms.forEach((room, roomId) => {
        if (room.participants.has(socket.id)) {
          room.participants.delete(socket.id);
          io.to(roomId).emit("room-update", {
            participants: Array.from(room.participants.values()),
            revealed: room.revealed,
          });
          if (room.participants.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });

  // Handle all other routes with Next.js
  expressApp.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
