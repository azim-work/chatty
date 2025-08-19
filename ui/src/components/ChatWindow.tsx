import { useRef, useEffect } from "react";
import type { Message } from "../App";
import MessageBubble from "./MessageBubble";

type Props = {
  modelName: string;
  messages: Message[];
  onClear: () => void;
  onLogout: () => void;
};

const ChatWindow = ({ modelName, messages, onClear, onLogout }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col mb-4 px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-700">Chatty</h1>

          {/* Centered model name */}
          <span className="text-sm text-gray-500 absolute left-1/2 transform -translate-x-1/2">
            Model: {modelName}
          </span>
          <div className="flex gap-1">
            <button
              onClick={onClear}
              className="text-sm px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
            >
              Clear Chat
            </button>
            <button
              onClick={onLogout}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-1">Feed your curiosity.</p>
      </div>

      {/* Messages OR Empty State */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-3xl text-neutral-900">
            Hey there, how can I help you today?
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
