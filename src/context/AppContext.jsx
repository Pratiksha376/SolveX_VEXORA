import { createContext, useContext, useState, useMemo } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState(null); // resume analysis object
  const [technicalResult, setTechnicalResult] = useState(null); // { technical_score, tips }
  const [englishResult, setEnglishResult] = useState(null); // { fluency, grammar, ... }
  const [behavioralResult, setBehavioralResult] = useState(null);
  const [aptitudeScore, setAptitudeScore] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [user, setUser] = useState(null); // { name, email, phone }
  const [settings, setSettings] = useState({
    notifications: true,
    weeklyDigest: true,
    practiceReminders: false,
  });

  const isAuthenticated = Boolean(user);

  const logout = () => {
    setUser(null);
  };

  const hasResume = Boolean(analysis);
  const hasTechnical = Boolean(technicalResult);
  const hasEnglish = Boolean(englishResult);
  const hasBehavioral = Boolean(behavioralResult);
  const hasAssessment = hasResume || hasTechnical || hasEnglish || hasBehavioral;

  const value = useMemo(
    () => ({
      sessionId, setSessionId,
      targetRole, setTargetRole,
      analysis, setAnalysis,
      technicalResult, setTechnicalResult,
      englishResult, setEnglishResult,
      behavioralResult, setBehavioralResult,
      aptitudeScore, setAptitudeScore,
      dashboard, setDashboard,
      hasResume, hasTechnical, hasEnglish, hasBehavioral, hasAssessment,
      user, setUser, isAuthenticated, logout,
      settings, setSettings,
    }),
    [sessionId, targetRole, analysis, technicalResult, englishResult, behavioralResult, aptitudeScore, dashboard, user, settings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
