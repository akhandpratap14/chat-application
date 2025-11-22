/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import useInstance from "@/services/instance";

export function useRoomMessages(roomId: string) {
  const api = useInstance();

  return useQuery({
    queryKey: ["roomMessages", roomId],
    queryFn: async () => {
      if (!roomId) return [];

      const res = await api.get(`messages?roomId=${roomId}`);
      const data = res.data;

      return data.map((msg: any) => ({
        id: msg.id,
        tokens: msg.content,
        senderId: msg.senderId,
        roomId: msg.roomId,
        createdAt: msg.createdAt,
      }));
    },
    enabled: !!roomId, 
    staleTime: 1000 * 5,
  });
}
