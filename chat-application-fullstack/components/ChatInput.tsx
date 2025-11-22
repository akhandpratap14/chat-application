/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { useSuggestionQuery } from "@/hooks/useSuggestionQuery";
import { useDebounce } from "@uidotdev/usehooks";
import { useDispatch } from "react-redux";
import { addRoomMessage, setTokens } from "@/redux/chatSlice";
import useInstance from "@/services/instance";
import { useMutation } from "@tanstack/react-query";

export default function TagInput({ myId, roomId, sendToRoom }: any) {
  const [value, setValue] = useState("");
  const [showList, setShowList] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [triggerChar, setTriggerChar] = useState<"@" | "#" | null>(null);
  const [mentions, setMentions] = useState<string[]>([]);
  const [searchWord, setSearchWord] = useState("");

  const dispatch = useDispatch();
  const api = useInstance();
  const inputRef = useRef<HTMLInputElement>(null);

  const messageMutation = useMutation({
    mutationFn: async ({ tokens, senderId, roomId }: any) => {
      const res = await api.post("messages", { tokens, senderId, roomId });
      return res.data;
    },
    onSuccess: (savedMessage) => {
      const normalized = {
        id: savedMessage.id,
        tokens: savedMessage.content,
        senderId: savedMessage.senderId,
        roomId: savedMessage.roomId,
        createdAt: savedMessage.createdAt,
      };

      sendToRoom({ roomId, message: normalized });
      dispatch(addRoomMessage(normalized));

      setValue("");
      setMentions([]);
    },
  });

  const tokenize = (text: string) => {
    const parts = text.split(" ");
    const tokens: any[] = [];

    parts.forEach((part) => {
      if (!part.trim()) return;
      if (part.startsWith("@") || part.startsWith("#")) {
        tokens.push({ type: "tag", label: part.slice(1), trigger: part[0] });
      } else {
        tokens.push({ type: "text", value: part + " " });
      }
    });

    return tokens;
  };

  const debounced = useDebounce(searchWord, 250);
  const { data: apiSuggestions = [] } = useSuggestionQuery(debounced);
  const list = apiSuggestions.map((item: any) => item.label);

  const sendMessage = () => {
    if (!value.trim()) return;

    const tokens = tokenize(value);
    dispatch(setTokens(tokens));

    messageMutation.mutate({
      tokens,
      senderId: myId,
      roomId,
    });

    setValue("");
    setMentions([]);
    setShowList(false);
    setTriggerChar(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);

    const cursor = e.target.selectionStart ?? 0;
    const word = getCurrentWord(text, cursor);

    if (word.startsWith("@") || word.startsWith("#")) {
      const char = word[0] as "@" | "#";
      const keyword = word.slice(1);

      setTriggerChar(char);
      setSearchWord(keyword);
      setShowList(true);
      setActiveIndex(0);
    } else {
      setShowList(false);
      setTriggerChar(null);
      setSearchWord("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (showList && list.length > 0) {
        e.preventDefault();
        replaceWord(list[activeIndex]);
        return;
      }
      e.preventDefault();
      sendMessage();
      return;
    }

    if (!showList || list.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % list.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + list.length) % list.length);
    }
  };

  const replaceWord = (selected: string) => {
    if (!inputRef.current || !triggerChar) return;

    const cursor = inputRef.current.selectionStart ?? 0;
    const text = value;
    const { start, end } = getWordBoundaries(text, cursor);

    const finalTag = triggerChar + selected;
    const newText = text.slice(0, start) + finalTag + " " + text.slice(end);

    setValue(newText);
    setShowList(false);
    setMentions((prev) => [...prev, finalTag]);

    setTimeout(() => {
      const pos = start + finalTag.length + 1;
      inputRef.current?.setSelectionRange(pos, pos);
    }, 0);
  };

  const highlighted = value.replace(/(@\w+|#\w+)/g, (m) =>
    mentions.includes(m)
      ? `<span style="background:#fde047;border-radius:4px;padding:2px;">${m}</span>`
      : m
  );

  return (
    <div className="relative w-full">

      <div
        className="absolute inset-0 px-3 py-2 text-black pointer-events-none whitespace-pre-wrap overflow-hidden"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />

      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="border rounded-lg p-3 w-full bg-transparent relative z-10 text-black"
        style={{ color: "transparent", caretColor: "black" }}
        placeholder="Type a message..."
      />

      {showList && list.length > 0 && (
        <div className="absolute left-0 bottom-full mb-2 w-full bg-white border shadow rounded-md text-black z-50">
          {list.map((label: string, i: number) => (
            <div
              key={label}
              onMouseDown={() => replaceWord(label)}
              className={`p-2 cursor-pointer ${
                i === activeIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              {triggerChar}
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getCurrentWord(text: string, cursor: number) {
  const left = text.slice(0, cursor);
  const parts = left.split(" ");
  return parts[parts.length - 1];
}

function getWordBoundaries(text: string, cursor: number) {
  let start = cursor - 1;
  while (start >= 0 && text[start] !== " ") start--;

  let end = cursor;
  while (end < text.length && text[end] !== " ") end++;

  return { start: start + 1, end };
}
