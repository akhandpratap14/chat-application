import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

import messageRoute from "./routes/message.route.js";
import suggestionRoute from "./routes/suggestions.route.js";
import roomRoute from "./routes/room.route.js";

app.use("/api/messages", messageRoute);
app.use("/api/suggestions", suggestionRoute);
app.use("/api/rooms", roomRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("room-message", ({ roomId, message }) => {
    io.to(roomId).emit("room-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected →", socket.id);
  });
});

server.listen(5050, () => {
  console.log("Backend running on http://localhost:5050");
});
