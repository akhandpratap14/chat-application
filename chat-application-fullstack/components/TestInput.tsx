"use client";

import { useState, useRef } from "react";
import { useSuggestionQuery } from "@/hooks/useSuggestionQuery"; 
import { useDebounce } from "@uidotdev/usehooks";

export default function TagInput() {
  const [value, setValue] = useState("");
  const [showList, setShowList] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [triggerChar, setTriggerChar] = useState<"@" | "#" | null>(null);
  const [mentions, setMentions] = useState<string[]>([]);
  const [searchWord, setSearchWord] = useState(""); // <--- used for API

  const inputRef = useRef<HTMLInputElement>(null);

  // debounce for API call
  const debounced = useDebounce(searchWord, 250);

  // API suggestions
  const { data: apiSuggestions = [] } = useSuggestionQuery(debounced);

  // suggestions list converted to simple array "label"
  const list = apiSuggestions.map((item: any) => item.label);

  // Handle text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);

    const cursor = e.target.selectionStart ?? 0;
    const word = getCurrentWord(text, cursor);

    if (word.startsWith("@") || word.startsWith("#")) {
      const char = word[0] as "@" | "#";
      const keyword = word.slice(1); // remove @ or #

      setTriggerChar(char);
      setSearchWord(keyword); // <--- trigger API search
      setShowList(true);
      setActiveIndex(0);
    } else {
      setShowList(false);
      setTriggerChar(null);
      setSearchWord("");
    }
  };

  // keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList || list.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % list.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      replaceWord(list[activeIndex]);
    }
  };

  // Replace @word with selected
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

  // highlight only selected mentions
  const highlighted = value.replace(/(@\w+|#\w+)/g, (match) => {
    if (mentions.includes(match)) {
      return `<span style="background: yellow; border-radius:4px;">${match}</span>`;
    }
    return match;
  });

  return (
    <div className="relative w-[350px]">

      {/* Highlight layer */}
      <div
        className="absolute inset-0 p-2 text-black pointer-events-none whitespace-pre-wrap overflow-hidden"
        dangerouslySetInnerHTML={{ __html: highlighted || "" }}
      />

      {/* Invisible real input */}
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="border p-2 w-full bg-transparent relative z-10"
        style={{ color: "transparent", caretColor: "black" }}
        placeholder="Type @ or #..."
      />

      {/* Dropdown */}
      {showList && list.length > 0 && (
        <div className="absolute left-0 bottom-full mb-1 w-full border bg-white shadow z-50 text-black">
          {list.map((label: string, i: number) => (
            <div
              key={label}
              onMouseDown={() => replaceWord(label)}
              className={`p-2 cursor-pointer ${
                i === activeIndex ? "bg-gray-200" : ""
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

// get word at cursor
function getCurrentWord(text: string, cursor: number) {
  const left = text.slice(0, cursor);
  const parts = left.split(" ");
  return parts[parts.length - 1];
}

// start & end of mention
function getWordBoundaries(text: string, cursor: number) {
  let start = cursor - 1;
  while (start >= 0 && text[start] !== " ") start--;

  let end = cursor;
  while (end < text.length && text[end] !== " ") end++;

  return { start: start + 1, end };
}
