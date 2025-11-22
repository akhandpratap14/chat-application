/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import RoomChat from "@/components/RoomChat";
import { usePathname } from 'next/navigation'
export default function RoomPage() {


  const pathname = usePathname()
  const roomId = pathname.split("/").pop();

  return <RoomChat roomId={roomId} />;
}
