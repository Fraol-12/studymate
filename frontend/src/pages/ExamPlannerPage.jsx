import React, { useState } from "react";
import api from "../utils/api";
import { CalendarDays, ListChecks } from "lucide-react";

export default function ExamPlannerPage() {
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [targetGrade, setTargetGrade] = useState("A");
  const [plan, setPlan] = useState("");
  const [countdown, setCountdown] = useState("");
  const [notebookId, setNotebookId] = useState("");
  const [loading, setLoading] = useState(false);

  const addExam = async () => {
    if (!subject || !examDate) return;
    const dateObj = new Date(examDate);
    const today = new Date();
    const diff = Math.ceil(
      (dateObj.getTime() - new Date(today.toDateString()).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setCountdown(`${subject} exam in ${diff} days`);

    setLoading(true);
    try {
      const prompt = `Subject: ${subject}\nDifficulty: ${difficulty}\nTarget grade: ${targetGrade}`;
      const res = await api.post("/ai/study-plan", {
        notebook_id: notebookId || null,
        text: prompt,
        exam_date: examDate,
      });
      setPlan(res.data.plan_raw);
    } catch (e) {
      console.error(e);
      setPlan("Failed to generate study plan. Check backend/Ollama.");
    } finally {
      setLoading(false);
    }
  };

  const daysForCalendar = () => {
    if (!examDate) return [];
    const dateObj = new Date(examDate);
    return [dateObj.getDate()];
  };

  const highlightedDays = daysForCalendar();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-[calc(100vh-4rem)]">
      <section className="xl:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarDays size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Exam planner
            </h2>
            <p className="text-xs text-slate-500">
              Add exams and let AI build a day-by-day plan.
            </p>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Subject
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
            placeholder="e.g. Data Structures midterm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Exam date
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Difficulty
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Target grade
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
            >
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Notebook ID (optional)
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
              placeholder="Use notes as context"
              value={notebookId}
              onChange={(e) => setNotebookId(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={addExam}
          disabled={loading || !subject || !examDate}
          className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Generating plan…" : "Add exam & generate plan"}
        </button>
        <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/70 text-xs text-slate-600">
          <p className="font-medium mb-1">Countdown</p>
          <p className="text-slate-500">
            {countdown || "Add an exam date to see the countdown here."}
          </p>
        </div>
      </section>
      <section className="xl:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <ListChecks size={18} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            AI-generated study plan
          </h3>
        </div>
        <div className="h-full border border-slate-100 rounded-xl bg-slate-50/60 p-3 text-xs text-slate-700 overflow-y-auto whitespace-pre-wrap">
          {plan || (
            <p className="text-slate-400">
              Your day-by-day plan will appear here in text/JSON. You can map this into a
              more visual UI or calendar later.
            </p>
          )}
        </div>
      </section>
      <section className="xl:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays size={18} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Calendar overview
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-2">
          Simple month view mock. Integrate a full calendar library (e.g. React Big
          Calendar) if you want richer interactions.
        </p>
        <SimpleCalendar highlightedDays={highlightedDays} />
      </section>
    </div>
  );
}

function SimpleCalendar({ highlightedDays }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-slate-600">
      {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
        <div key={d} className="font-medium mb-1">
          {d}
        </div>
      ))}
      {days.map((d) => {
        const isExam = highlightedDays.includes(d);
        return (
          <div
            key={d}
            className={`h-7 flex items-center justify-center rounded-full ${
              isExam ? "bg-blue-600 text-white font-semibold" : "bg-slate-50"
            }`}
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}


