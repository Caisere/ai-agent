"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, chatHistory: messages }),
    });

    const data = await response.json();

    const assistantMessage: Message = {
      role: "assistant",
      content: data.message,
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto h-screen flex flex-col p-4">
      <h1 className="text-2xl font-semibold mb-4">Aria</h1>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] text-sm ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-100 text-gray-800 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="bg-gray-100 text-gray-400 text-sm p-3 rounded-lg self-start">
            Aria is thinking...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Say something..."
          className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </main>
  );
}
