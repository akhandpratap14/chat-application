/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import useInstance from "@/services/instance";

export default function RoomsSidebar() {

    const api = useInstance();

    const router = useRouter();
    const pathname = usePathname();

    const queryClient = useQueryClient();

    const [myId, setMyId] = useState<string | null>(null);

    useEffect(() => {
        Promise.resolve().then(() => {
            let id = localStorage.getItem("userId");
            if (!id) {
                id = crypto.randomUUID();
                localStorage.setItem("userId", id);
            }
            setMyId(id);
        });
    }, []);

    const { data: rooms = [] } = useQuery({
        queryKey: ["rooms", myId],
        queryFn: async () => {
            const res = await api.get(`rooms?userId=${myId}`)
            return res.data;
        },
        enabled: !!myId,
    });

    const createRoomMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post("rooms", { userId: myId, name: "Chat Room" });
            return res.data;
        },
        onSuccess: (room) => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            router.push(`/chat/${room.id}`);
        },
    });

  const createRoom = () => createRoomMutation.mutate();

    if (!myId)
        return <div className="w-72 border-r p-4">Loading…</div>;

  return (
    <div className="w-72 border-r bg-white flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-black text-lg">Chats</h2>
        <button
          className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
          onClick={createRoom}
        >
          + Room
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map((room: any) => {
          const active = pathname === `/chat/${room.id}`;
          return (
            <div
              key={room.id}
              onClick={() => router.push(`/chat/${room.id}`)}
              className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                active ? "bg-gray-200" : ""
              }`}
            >
              <p className="font-medium text-black">{room.name}</p>
              <p className="text-sm text-gray-500">{room.id}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
