import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MODEL_NAME = "GPT-4o";
const model = "gpt-4o";
const ENV_PASSWORD = import.meta.env.VITE_APP_PASSWORD;

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat-messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        console.error("Invalid chat history");
      }
    }
    return [];
  });
  const [input, setInput] = useState("");

  // Auto-login if localStorage flag is present
  useEffect(() => {
    const wasAuthed = localStorage.getItem("hm-auth");
    if (wasAuthed === "true") {
      setAuthenticated(true);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const tryLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password === ENV_PASSWORD) {
      localStorage.setItem("hm-auth", "true");
      setAuthenticated(true);
      setPassword("");
    } else if (!password.trim()) {
      alert("Please enter the password.");
    } else {
      alert("Incorrect password.");
    }
  };

  const logout = () => {
    localStorage.removeItem("hm-auth");
    setAuthenticated(false);
    setPassword("");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      alert("Missing OpenAI API key.");
      return;
    }

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
          model,
          stream: true,
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

      const decoder = new TextDecoder("utf-8");
      const reader = res.body!.getReader();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing-indicator").concat(assistantMsg)
      );

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n")
          .filter((line) => line.trim().startsWith("data: "))
          .map((line) => line.replace("data: ", "").trim());

        for (const line of lines) {
          if (line === "[DONE]") break;

          try {
            const json = JSON.parse(line);
            const token = json.choices?.[0]?.delta?.content;
            if (token) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsg.id
                    ? { ...m, content: m.content + token }
                    : m
                )
              );
            }
          } catch (err) {
            console.error("Streaming parse error", err);
          }
        }
      }
    } catch (err) {
      console.error("OpenAI error:", err);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "⚠️ Failed to fetch response from OpenAI.",
      };
      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing-indicator").concat(errorMsg)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!authenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-5xl font-semibold text-neutral-900 mb-2 tracking-tight">
            Chatty
          </h1>
          <p className="text-md text-gray-500 mb-8 ">Feed your curiosity.</p>

          <form onSubmit={tryLogin} className="p-6 rounded w-96 mx-auto">
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-neutral-800 transition"
            >
              Let's go!
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Chat */}
      <div className="flex-1 overflow-y-auto">
        <ChatWindow
          modelName={MODEL_NAME}
          messages={messages}
          onClear={() => setMessages([])}
          onLogout={logout}
        />
      </div>

      {/* Input */}
      <div className="p-8 bg-white flex justify-center">
        <div className="relative w-full max-w-4xl">
          <input
            type="text"
            placeholder="Ask me anything..."
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="w-full border border-gray-500 rounded-full py-4 pl-6 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
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
      <p className="text-center text-xs text-gray-400 px-4 pb-4">
        This is a public playground environment. <br className="sm:hidden" />
        Please don’t enter any sensitive or personal information.
      </p>
    </div>
  );
}

export default App;
