import { Bell, Mail, Calendar, Trash2 } from "lucide-react";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import { useApp } from "../context/AppContext";

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full shrink-0 transition-colors relative ${
        checked ? "bg-sage-dark" : "bg-[#DAD5C6]"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

const ROWS = [
  { key: "notifications", icon: Bell, title: "Notifications", desc: "Get notified when your interview feedback is ready." },
  { key: "weeklyDigest", icon: Mail, title: "Weekly digest", desc: "A short email summary of your readiness progress." },
  { key: "practiceReminders", icon: Calendar, title: "Practice reminders", desc: "Gentle nudges to keep your practice streak going." },
];

export default function Settings() {
  const { settings, setSettings, sessionId, setAnalysis, setTechnicalResult, setEnglishResult, setBehavioralResult, setAptitudeScore, setDashboard } = useApp();

  const update = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const clearAssessment = () => {
    setAnalysis(null);
    setTechnicalResult(null);
    setEnglishResult(null);
    setBehavioralResult(null);
    setAptitudeScore(null);
    setDashboard(null);
  };

  return (
    <AppShell title="Settings" subtitle="Manage notifications and your assessment data.">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <h3 className="font-display text-lg text-ink mb-5">Notifications</h3>
          <div className="space-y-5">
            {ROWS.map(({ key, icon: Icon, title, desc }) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <Icon size={18} className="text-sage-dark mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ink font-medium text-sm">{title}</p>
                    <p className="text-sm text-muted">{desc}</p>
                  </div>
                </div>
                <Toggle checked={settings[key]} onChange={(v) => update(key, v)} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-lg text-ink mb-2">Session</h3>
          <p className="text-sm text-muted mb-4">
            Session ID: <span className="font-mono text-ink/70">{sessionId || "none yet"}</span>
          </p>
          <Button
            variant="secondary"
            icon={Trash2}
            iconPosition="left"
            onClick={clearAssessment}
            className="!text-terracotta"
          >
            Clear assessment data
          </Button>
          <p className="text-xs text-muted mt-2">
            Resets your resume analysis, interview scores, and roadmap so you can start fresh.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
