/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useRoomSocket(roomId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const socket = io("http://localhost:5050", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", roomId);
      setReady(true);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.disconnect();
      setReady(false);
    };
  }, [roomId]);

  const sendToRoom = (msg: any) => {
    if (!ready) {
      return;
    }
    socketRef.current?.emit("room-message", msg);
  };

  return { socketRef, sendToRoom, ready };
}
