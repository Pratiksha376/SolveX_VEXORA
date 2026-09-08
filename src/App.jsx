import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import EnglishCoach from "./pages/EnglishCoach";
import TechnicalInterview from "./pages/TechnicalInterview";
import BehavioralInterview from "./pages/BehavioralInterview";
import TopicMockInterview from "./pages/TopicMockInterview";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { useApp } from "./context/AppContext";

function RequireAuth({ children }) {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/app/resume" element={<RequireAuth><ResumeAnalysis /></RequireAuth>} />
      <Route path="/app/english" element={<RequireAuth><EnglishCoach /></RequireAuth>} />
      <Route path="/app/technical" element={<RequireAuth><TechnicalInterview /></RequireAuth>} />
      <Route path="/app/behavioral" element={<RequireAuth><BehavioralInterview /></RequireAuth>} />
      <Route path="/app/topic-interview" element={<RequireAuth><TopicMockInterview /></RequireAuth>} />
      <Route path="/app/roadmap" element={<RequireAuth><Roadmap /></RequireAuth>} />
      <Route path="/app/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/app/settings" element={<RequireAuth><Settings /></RequireAuth>} />
    </Routes>
  );
}
