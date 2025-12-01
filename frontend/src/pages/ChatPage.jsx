import React, { useState } from "react";
import api from "../utils/api";
import ChatBox from "../components/ChatBox";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [notebookId, setNotebookId] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (content) => {
    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", {
        notebook_id: notebookId || null,
        messages: newMessages,
      });
      setMessages([...newMessages, { role: "assistant", content: res.data.answer }]);
    } catch (e) {
      console.error(e);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong with the AI request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = (type) => {
    if (type === "mcq") {
      send("Generate 100 multiple-choice questions from my current notebook.");
    } else if (type === "summary") {
      send("Create a concise exam summary for this notebook.");
    } else if (type === "plan") {
      send("Make a day-by-day study plan for this exam.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <aside className="hidden md:flex flex-col w-56 bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Chat history</h2>
        <p className="text-xs text-slate-400 mb-3">
          For brevity, this demo keeps the current session only. Persist threads in Supabase
          if you want full history.
        </p>
        <div className="mt-auto">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Notebook ID (optional)
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/70 focus:border-blue-500"
            placeholder="Link a notebook for RAG"
            value={notebookId}
            onChange={(e) => setNotebookId(e.target.value)}
          />
        </div>
      </aside>
      <section className="flex-1 bg-slate-50">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-full p-4">
          <ChatBox messages={messages} onSend={send} onQuick={handleQuick} />
          {loading && (
            <p className="mt-1 text-[10px] text-slate-400">
              Thinking with Ollama… make sure your local model is running.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}


