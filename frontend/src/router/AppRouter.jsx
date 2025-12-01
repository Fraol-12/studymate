import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import NotesPage from "../pages/NotesPage";
import ChatPage from "../pages/ChatPage";
import QuestionGeneratorPage from "../pages/QuestionGeneratorPage";
import ExamPlannerPage from "../pages/ExamPlannerPage";
import SettingsPage from "../pages/SettingsPage";
import AppShell from "../components/layout/AppShell";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppShell />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="questions" element={<QuestionGeneratorPage />} />
        <Route path="planner" element={<ExamPlannerPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


