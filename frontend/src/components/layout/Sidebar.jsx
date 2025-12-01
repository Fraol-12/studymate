import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, MessageCircle, HelpCircle, Calendar, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const linkClasses =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex md:flex-col w-60 border-r bg-white/80 backdrop-blur-sm">
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI Study Notebook</p>
            <p className="text-xs text-slate-500">Exam assistant</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 text-slate-600">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink
          to="/notes"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`
          }
        >
          <FileText size={18} />
          Notes
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`
          }
        >
          <MessageCircle size={18} />
          AI Chat
        </NavLink>
        <NavLink
          to="/questions"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`
          }
        >
          <HelpCircle size={18} />
          Question Generator
        </NavLink>
        <NavLink
          to="/planner"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`
          }
        >
          <Calendar size={18} />
          Exam Planner
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>
      <div className="px-3 py-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}


