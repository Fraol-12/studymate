import React, { useState } from "react";
import api from "../utils/api";
import { FileDown, HelpCircle } from "lucide-react";

export default function QuestionGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("medium");
  const [qtype, setQtype] = useState("mcq");
  const [notebookId, setNotebookId] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/ai/quiz", {
        notebook_id: notebookId || null,
        text: topic,
        level,
        qtype,
      });
      setResult(res.data.quiz_raw);
    } catch (e) {
      console.error(e);
      setResult("Failed to generate questions. Check backend/Ollama.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    const blob = new Blob([result || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-4rem)]">
      <section className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <HelpCircle size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Question Generator
            </h2>
            <p className="text-xs text-slate-500">
              Create MCQs, true/false, or theory questions for any topic.
            </p>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Topic / prompt
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 min-h-[80px]"
            placeholder="e.g. Dynamic programming on sequences, operating systems deadlocks, etc."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Level
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Type
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
              value={qtype}
              onChange={(e) => setQtype(e.target.value)}
            >
              <option value="mcq">MCQ</option>
              <option value="tf">True/False</option>
              <option value="theory">Theory</option>
              <option value="mix">Mix</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Notebook ID (optional)
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
            placeholder="Link a notebook for context"
            value={notebookId}
            onChange={(e) => setNotebookId(e.target.value)}
          />
        </div>
        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Generating…" : "Generate questions"}
        </button>
        <button
          onClick={downloadPdf}
          disabled={!result}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-700 py-2 text-xs hover:bg-slate-50 disabled:opacity-60"
        >
          <FileDown size={16} />
          Download as text (PDF-ready)
        </button>
      </section>
      <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Generated questions
        </h3>
        <div className="h-full border border-slate-100 rounded-xl bg-slate-50/60 p-3 text-xs text-slate-700 overflow-y-auto whitespace-pre-wrap">
          {result || (
            <p className="text-slate-400">
              Your generated questions will appear here as JSON/text. You can format or
              export them as needed.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}


