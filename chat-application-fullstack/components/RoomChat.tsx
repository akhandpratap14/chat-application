/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addRoomMessage, setRoomMessages } from "@/redux/chatSlice";
import { useRoomMessages } from "@/hooks/useRoomMessages";

import RoomMessageBubble from "./RoomMessageBubble";
import ChatInput from "@/components/ChatInput";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import useInstance from "@/services/instance";
import { selectMessagesForRoom } from "@/redux/chatSelectors";
import TagInput from "./TestInput";

export default function RoomChat({ roomId }: any) {
  const dispatch = useDispatch();
  const api = useInstance();

  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }
    setMyId(id);
  }, []);


  const { data: roomMessages } = useRoomMessages(roomId);

  useEffect(() => {
    if (roomMessages?.length) {
      dispatch(setRoomMessages({ roomId, messages: roomMessages }));
    }
  }, [roomMessages, roomId]);

  useEffect(() => {
    if (!roomId || !myId) return;
    api.post("rooms/join", { roomId, userId: myId });
  }, [roomId, myId]);

  const { socketRef, sendToRoom, ready } = useRoomSocket(roomId);

  const messages = useSelector(selectMessagesForRoom(roomId));

  useEffect(() => {
    if (!ready) return;        

    const socket = socketRef.current;
    if (!socket) return;

    const handler = (msg: any) => {

      if (msg?.roomId === roomId) {
        dispatch(addRoomMessage(msg));
      }
    };

    socket.on("room-message", handler);
    return () =>{ socket.off("room-message", handler);}
  }, [ready, roomId, dispatch]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (!myId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      <div className="p-3 bg-white border-b flex justify-between items-center">
        <h2 className="font-semibold text-black text-lg">Room: {roomId}</h2>

        <button
          className="text-sm bg-black text-white px-2 py-1 rounded"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Room link copied!");
          }}
        >
          Copy Link
        </button>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg: any) => (
          <RoomMessageBubble key={msg.id} msg={msg} myId={myId} />
        ))}
      </div>

      <div className="border-t bg-white p-3">
        <ChatInput myId={myId} roomId={roomId} sendToRoom={sendToRoom} />
        {/* <TagInput/> */}
      </div>
    </div>
  );
}
