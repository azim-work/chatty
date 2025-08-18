import { useEffect, useRef } from "react";
import type { Message } from "../App";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: Message[];
  onClear: () => void;
};

const ChatWindow = ({ messages, onClear }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[calc(100vh-100px)]">
      <div className="flex justify-end mb-4">
        <button
          onClick={onClear}
          className="text-sm px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
        >
          Clear Chat
        </button>
      </div>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
