import { useState } from "react";
import { Pencil, Check, LogOut, Mail, Phone, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import ScoreRing from "../components/ScoreRing";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { user, setUser, logout, targetRole, analysis, technicalResult, englishResult, behavioralResult } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user || { name: "", email: "", phone: "" });

  const save = () => {
    setUser(draft);
    setEditing(false);
  };

  const doLogout = () => {
    logout();
    navigate("/");
  };

  const scores = [
    { label: "Resume", value: analysis?.analysis?.resume_score },
    { label: "English", value: englishResult?.overall },
    { label: "Technical", value: technicalResult?.technical_score },
    { label: "Behavioral", value: behavioralResult?.overall },
  ].filter((s) => typeof s.value === "number");

  const overall = scores.length
    ? Math.round(scores.reduce((a, b) => a + b.value, 0) / scores.length)
    : 0;

  return (
    <AppShell title="Profile" subtitle="Your account and assessment summary.">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-sage-soft text-sage-dark flex items-center justify-center font-display text-2xl">
                {(user?.name || "?")[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="font-display text-xl text-ink">{user?.name || "Not signed in"}</h2>
                <p className="text-sm text-muted">Target role: {targetRole || "Not set yet"}</p>
              </div>
            </div>
            {!editing ? (
              <Button variant="secondary" icon={Pencil} iconPosition="left" onClick={() => { setDraft(user); setEditing(true); }}>
                Edit
              </Button>
            ) : (
              <Button icon={Check} iconPosition="left" onClick={save}>
                Save
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-ink">Full name</label>
              {editing ? (
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-ink focus:border-sage outline-none"
                />
              ) : (
                <p className="text-ink/80">{user?.name || "—"}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5 text-sm font-medium text-ink">
                <Mail size={14} /> Email
              </label>
              {editing ? (
                <input
                  value={draft.email}
                  onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-ink focus:border-sage outline-none"
                />
              ) : (
                <p className="text-ink/80">{user?.email || "—"}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5 text-sm font-medium text-ink">
                <Phone size={14} /> Phone
              </label>
              {editing ? (
                <input
                  value={draft.phone}
                  onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-ink focus:border-sage outline-none"
                />
              ) : (
                <p className="text-ink/80">{user?.phone || "—"}</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-lg text-ink mb-5 flex items-center gap-2">
            <Target size={18} className="text-sage-dark" /> Assessment Summary
          </h3>
          {scores.length ? (
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreRing score={overall} size={112} label="Readiness" />
              <div className="grid grid-cols-2 gap-4 flex-1 w-full">
                {scores.map((s) => (
                  <div key={s.label} className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted">{s.label}</span>
                    <span className="font-medium text-ink">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">
              No assessments yet — your scores will show up here once you complete a resume analysis or interview round.
            </p>
          )}
        </Card>

        <Button onClick={doLogout} variant="secondary" icon={LogOut} iconPosition="left" className="!text-terracotta">
          Log out
        </Button>
      </div>
    </AppShell>
  );
}
