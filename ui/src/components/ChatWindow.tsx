import type { Message } from "../App";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: Message[];
  onClear: () => void;
};

const ChatWindow = ({ messages, onClear }: Props) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col mb-4 px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-700">Chatty</h1>
          <button
            onClick={onClear}
            className="text-sm px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            Clear Chat
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Chat with an AI assistant powered by OpenAI.
        </p>
      </div>

      {/* Messages OR Empty State */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-3xl text-neutral-900">
            Hey there, how can I help you today?
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
