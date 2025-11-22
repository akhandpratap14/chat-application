/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function RoomMessageBubble({
  msg,
  myId,
}: {
  msg: any;
  myId: string | null;
}) {
  if (!msg || !msg.tokens) return null;

  const tokens = msg.tokens;
  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isMine = msg.senderId === myId;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`shadow px-3 py-2 text-black rounded-xl max-w-[75%] whitespace-pre-wrap wrap-break-word
          ${isMine ? "bg-[#DCF8C6] rounded-br-none" : "bg-white rounded-bl-none"}
        `}
      >
        {tokens.map((t: any, i: number) => {
          if (t.type === "text") {
            return <span key={i}>{t.value}</span>;
          }

          return (
            <span
              key={i}
              className="bg-blue-200 px-1 rounded text-blue-800 mx-1"
            >
              {t.trigger}
              {t.label}
            </span>
          );
        })}

        <div className="text-[10px] text-gray-600 text-right mt-1">
          {time}
        </div>
      </div>
    </div>
  );
}
