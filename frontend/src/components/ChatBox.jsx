import React, { useRef, useState } from "react";
import { ArrowUpCircle, Sparkles } from "lucide-react";

export default function ChatBox({ messages, onSend, onQuick }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI Chat</p>
            <p className="text-xs text-slate-500">
              Ask questions based on your notebooks and uploads.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 border border-slate-100 rounded-2xl bg-white overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-slate-400">
            Start a conversation or use a quick action below to generate MCQs, summaries,
            or a study plan.
          </p>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className="flex">
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-blue-600 text-white rounded-br-sm"
                  : "mr-auto bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          <QuickButton label="Generate 100 MCQs" onClick={() => onQuick("mcq")} />
          <QuickButton label="Create summary" onClick={() => onQuick("summary")} />
          <QuickButton label="Make study plan" onClick={() => onQuick("plan")} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 resize-none bg-transparent text-xs md:text-sm outline-none max-h-32"
            placeholder="Ask a question about your notes, e.g. “Explain quicksort for exams.”"
            value={input}
            onChange={handleInput}
          />
          <button
            type="submit"
            className="text-blue-600 hover:text-blue-700 disabled:opacity-60"
            disabled={!input.trim()}
          >
            <ArrowUpCircle size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}

function QuickButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-700 hover:bg-slate-200"
    >
      {label}
    </button>
  );
}


