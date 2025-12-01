import React from "react";
import { CalendarDays, FilePlus2, HelpCircle, MessageCircle, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            Overview
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mt-1">
            Welcome back, {user?.email?.split("@")[0] || "Student"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Continue where you left off — your notebooks, questions, and exams are synced.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
          <CalendarDays className="text-blue-600" size={20} />
          <div>
            <p className="text-xs text-slate-500">Next exam</p>
            <p className="text-sm font-medium text-slate-900">
              DS Exam in <span className="text-blue-600 font-semibold">12 days</span>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard
          icon={<FilePlus2 size={18} />}
          title="Create new note"
          description="Start a fresh notebook for a new course or topic."
        />
        <DashboardCard
          icon={<HelpCircle size={18} />}
          title="Generate questions"
          description="Turn your notes into exam-style questions."
        />
        <DashboardCard
          icon={<MessageCircle size={18} />}
          title="Ask AI about notes"
          description="Clarify tricky concepts from your materials."
        />
        <DashboardCard
          icon={<PlusCircle size={18} />}
          title="Add exam"
          description="Track dates and generate a study plan."
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent notes
            </h2>
            <button className="text-xs text-blue-600 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-2 text-sm text-slate-500">
            <p className="text-xs text-slate-400">
              Connect to Supabase to load your recent notebooks.
            </p>
            <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/60">
              <p className="text-xs text-slate-500">
                This section will show your latest notebooks and quick links once the
                Supabase tables are populated.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Upcoming exams
          </h2>
          <div className="space-y-3 text-sm text-slate-500">
            <p className="text-xs text-slate-400">
              Exams from your planner will appear here with countdowns.
            </p>
            <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/60">
              <p className="text-xs text-slate-500">
                Use the Exam Planner page to add exams and generate AI study plans.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardCard({ icon, title, description }) {
  return (
    <button className="flex flex-col items-start gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 text-left hover:shadow-md hover:border-blue-100 transition-all">
      <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </button>
  );
}


