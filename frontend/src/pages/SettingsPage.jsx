import React, { useState } from "react";
import { Moon, SunMedium, Trash2, UserCog } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.email?.split("@")[0] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [theme, setTheme] = useState("light");

  const saveProfile = () => {
    alert("Profile update wiring to Supabase can be added here.");
  };

  const exportNotes = () => {
    alert("Export all notes from Supabase (CSV/Markdown) can be implemented here.");
  };

  const deleteAccount = () => {
    if (!window.confirm("This will delete your account and all notes. Continue?")) {
      return;
    }
    alert("Call a backend endpoint to delete Supabase user data, then logout.");
    logout();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <UserCog size={18} className="text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">Account settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Name
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500/80 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={saveProfile}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          Save changes
        </button>
        <div className="pt-2">
          <p className="text-xs text-slate-400">
            To fully persist settings, create a `profiles` table in Supabase and sync
            updates here.
          </p>
        </div>
      </section>
      <section className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-slate-900 mb-2">Theme</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${
                theme === "light"
                  ? "bg-blue-50 border-blue-400 text-blue-700"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              <SunMedium size={14} />
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              <Moon size={14} />
              Dark
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            For full dark mode, wire this toggle into a theme context and Tailwind
            `dark` classes.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <p className="text-sm font-semibold text-slate-900">Data</p>
          <button
            onClick={exportNotes}
            className="w-full inline-flex items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-700 py-2 hover:bg-slate-50"
          >
            Export notes
          </button>
          <button
            onClick={deleteAccount}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 text-xs text-red-600 py-2 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete account
          </button>
        </div>
      </section>
    </div>
  );
}


