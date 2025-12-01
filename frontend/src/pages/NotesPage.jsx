import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Sparkles, StickyNote } from "lucide-react";
import NotesEditor from "../components/NotesEditor";
import FileUploader from "../components/FileUploader";
import { useAuth } from "../context/AuthContext";

export default function NotesPage() {
  const { user } = useAuth();
  const [notebooks, setNotebooks] = useState([]);
  const [activeNotebook, setActiveNotebook] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/notebooks/list");
        setNotebooks(res.data);
        if (res.data.length > 0) {
          selectNotebook(res.data[0]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectNotebook = async (nb) => {
    setActiveNotebook(nb);
    setTitle(nb.title);
    try {
      const res = await api.get(`/notebooks/notes/${nb.id}`);
      if (res.data) {
        setContent(res.data.content);
        setAiResult(res.data.ai_summary || "");
      } else {
        setContent("");
        setAiResult("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createNotebook = async () => {
    const baseTitle = "New notebook";
    try {
      const res = await api.post("/notebooks/create", {
        title: baseTitle,
        description: "",
      });
      const nb = res.data;
      setNotebooks((prev) => [nb, ...prev]);
      selectNotebook(nb);
    } catch (e) {
      console.error(e);
      alert("Failed to create notebook");
    }
  };

  const saveNote = async () => {
    if (!activeNotebook) return;
    try {
      // update title if changed
      if (title !== activeNotebook.title) {
        await api.post("/notebooks/create", {
          title,
          description: activeNotebook.description,
        });
      }
      await api.post("/notebooks/notes", {
        notebook_id: activeNotebook.id,
        content,
      });
    } catch (e) {
      console.error(e);
      alert("Failed to save note");
    }
  };

  const runAI = async (type) => {
    if (!activeNotebook) return;
    setLoadingAction(type);
    try {
      let endpoint = "/ai/summary";
      if (type === "explain") endpoint = "/ai/chat";
      if (type === "questions") endpoint = "/ai/quiz";

      if (endpoint === "/ai/chat") {
        const res = await api.post(endpoint, {
          notebook_id: activeNotebook.id,
          messages: [
            { role: "user", content: `Explain this content in simple terms:\n${content}` },
          ],
        });
        setAiResult(res.data.answer);
      } else if (endpoint === "/ai/quiz") {
        const res = await api.post(endpoint, {
          notebook_id: activeNotebook.id,
          text: content,
          level: "medium",
          qtype: "mix",
        });
        setAiResult(res.data.quiz_raw);
      } else {
        const res = await api.post(endpoint, {
          notebook_id: activeNotebook.id,
          text: content,
        });
        setAiResult(res.data.summary);
      }
    } catch (e) {
      console.error(e);
      alert("AI request failed");
    } finally {
      setLoadingAction("");
    }
  };

  const handleExtracted = (text) => {
    setContent((prev) => `${prev}\n\n${text}`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <aside className="hidden md:flex flex-col w-64 bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Notebooks</h2>
          <button
            onClick={createNotebook}
            className="text-xs px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {notebooks.map((nb) => (
            <button
              key={nb.id}
              onClick={() => selectNotebook(nb)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left ${
                activeNotebook?.id === nb.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <StickyNote size={14} />
              <span className="truncate">{nb.title}</span>
            </button>
          ))}
          {notebooks.length === 0 && (
            <p className="text-xs text-slate-400 mt-4">
              No notebooks yet. Create one to start capturing notes.
            </p>
          )}
        </div>
      </aside>

      <section className="flex-1 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-slate-500">Notebook editor</p>
              <p className="text-xs text-slate-400">
                Logged in as {user?.email || "student"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FileUploader
                notebookId={activeNotebook?.id}
                onExtracted={handleExtracted}
              />
              <button
                onClick={saveNote}
                className="px-3 py-2 rounded-lg text-xs md:text-sm bg-slate-900 text-white hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </div>
          <NotesEditor
            title={title}
            onTitleChange={setTitle}
            content={content}
            onContentChange={setContent}
          />
        </div>

        <div className="w-full lg:w-80 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  AI Study Panel
                </p>
                <p className="text-xs text-slate-500">
                  Summaries, explanations, and practice questions.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <AIButton
              label="Summarize"
              active={loadingAction === "summary"}
              onClick={() => runAI("summary")}
            />
            <AIButton
              label="Explain"
              active={loadingAction === "explain"}
              onClick={() => runAI("explain")}
            />
            <AIButton
              label="Generate questions"
              active={loadingAction === "questions"}
              onClick={() => runAI("questions")}
            />
            <span className="px-2 py-1 rounded-full bg-slate-100 text-[10px] text-slate-500">
              Mind-map (text) via summary/questions
            </span>
          </div>
          <div className="flex-1 border border-slate-100 rounded-xl bg-slate-50/60 p-3 text-xs text-slate-700 overflow-y-auto whitespace-pre-wrap">
            {aiResult || (
              <p className="text-slate-400">
                Run an AI action to see summaries, explanations, or questions here.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AIButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={active}
      className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 disabled:opacity-60"
    >
      {active ? `${label}…` : label}
    </button>
  );
}


