import React from "react";
import { Search, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-3 flex-1">
        <div className="md:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            AI
          </div>
          <span className="text-sm font-semibold text-slate-900">
            AI Study Notebook
          </span>
        </div>
        <div className="flex-1 max-w-xl mx-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100">
            <Search size={16} className="text-slate-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search notes, notebooks…"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:block text-right">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="text-sm font-medium text-slate-900">
            {user?.email ?? "Student"}
          </p>
        </div>
        <div className="h-9 w-9 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-700">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}


