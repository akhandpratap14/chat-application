/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import RoomsSidebar from "@/components/RoomsSidebar";

export default function ChatLayout({ children }: any) {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <RoomsSidebar />

      {/* Right Side → Active Chat */}
      <div className="flex-1 bg-gray-100">
        {children}
      </div>
    </div>
  );
}
