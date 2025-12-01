import React from "react";

export default function NotesEditor({ title, onTitleChange, content, onContentChange }) {
  return (
    <div className="flex flex-col h-full">
      <input
        className="w-full text-xl md:text-2xl font-semibold text-slate-900 bg-transparent outline-none mb-3 placeholder:text-slate-400"
        placeholder="Untitled notebook"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
        <span className="px-2 py-1 rounded-full bg-slate-100">Markdown-style</span>
        <span>Use **bold**, # headings, and - bullet lists.</span>
      </div>
      <textarea
        className="flex-1 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 leading-relaxed"
        placeholder="Type your lecture notes, summaries, and key formulas here..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </div>
  );
}


