import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat-messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        console.error("Invalid chat history");
      }
    }
    return [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const typingMsg: Message = {
      id: "typing-indicator",
      role: "assistant",
      content: "Typing...",
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "OpenAI API error");
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "No response",
      };

      setMessages((prev) =>
        [...prev]
          .filter((m) => m.id !== "typing-indicator")
          .concat(assistantMsg)
      );
    } catch (err: any) {
      console.error("OpenAI error:", err);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "⚠️ Failed to fetch response from OpenAI.",
      };
      setMessages((prev) =>
        [...prev].filter((m) => m.id !== "typing-indicator").concat(errorMsg)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ChatWindow messages={messages} onClear={() => setMessages([])} />
      </div>
      {/* Input */}
      <div className="p-8 bg-white  flex justify-center">
        <div className="relative w-full max-w-4xl">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="w-full border border-gray-500 rounded-full py-6 pl-8 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-900 disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
