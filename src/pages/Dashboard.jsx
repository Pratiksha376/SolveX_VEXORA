import { FileText, Mic, Code2, Users, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ScoreRing from "../components/ScoreRing";
import ProgressBar from "../components/ProgressBar";
import SkillTag from "../components/SkillTag";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { analysis, technicalResult, englishResult, behavioralResult, hasAssessment, targetRole } = useApp();

  const resumeScore = analysis?.analysis?.resume_score ?? null;
  const technicalScore = technicalResult?.technical_score ?? null;
  const englishScore = englishResult?.overall ?? null;
  const behavioralScore = behavioralResult?.overall ?? null;

  const scored = [resumeScore, technicalScore, englishScore, behavioralScore].filter(
    (s) => typeof s === "number"
  );
  const overall = scored.length
    ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
    : null;

  const gaps = analysis?.analysis?.missing_skills ?? [];

  return (
    <AppShell title="Dashboard" subtitle={hasAssessment ? `Target role: ${targetRole || "Not set"}` : undefined}>
      {!hasAssessment ? (
        <Card className="max-w-2xl mx-auto mt-8">
          <EmptyState
            icon={Sparkles}
            title="Your career profile is waiting to be built."
            description="Upload your resume to begin your assessment. Once you do, this page becomes your career readiness command center."
            action={<Button to="/app/resume" icon={ArrowRight}>Analyze My Resume</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center">
            <Card className="flex flex-col items-center py-8">
              <ScoreRing score={overall ?? 0} size={148} label="Career Readiness" />
            </Card>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { label: "Resume", value: resumeScore },
                { label: "English", value: englishScore },
                { label: "Technical", value: technicalScore },
                { label: "Behavioral", value: behavioralScore },
              ].map(({ label, value }) => (
                <Card key={label} className="text-center">
                  <p className="text-sm text-muted mb-1">{label}</p>
                  <p className="font-display text-3xl text-ink">{value ?? "—"}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-display text-lg text-ink mb-4">Your Top Skill Gaps</h3>
              {gaps.length ? (
                <div className="flex flex-wrap gap-2">
                  {gaps.map((g) => (
                    <SkillTag key={g} tone="missing">{g}</SkillTag>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No resume analysis yet — gaps will appear here once you upload one.</p>
              )}
            </Card>
            <Card className="bg-sage-soft/60 border-sage-soft">
              <h3 className="font-display text-lg text-sage-dark mb-2">Today's Recommendation</h3>
              <p className="text-ink/80 leading-relaxed">
                {gaps.length
                  ? `Spend 20 minutes practicing ${gaps[0]} — it's your most-cited gap right now.`
                  : "Complete an interview round to unlock a personalized recommendation."}
              </p>
            </Card>
          </div>

          <Card>
            <h3 className="font-display text-lg text-ink mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              <Button to="/app/english" variant="secondary" icon={Mic} iconPosition="left">Practice English</Button>
              <Button to="/app/technical" variant="secondary" icon={Code2} iconPosition="left">Technical Interview</Button>
              <Button to="/app/behavioral" variant="secondary" icon={Users} iconPosition="left">Behavioral Practice</Button>
              <Button to="/app/resume" variant="secondary" icon={FileText} iconPosition="left">Analyze Resume</Button>
            </div>
          </Card>

          <Card className="bg-ink text-cream flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center shrink-0">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="font-display text-lg mb-1">Topic Mock Interview</h3>
                <p className="text-sm text-cream/70">
                  Pick any topic — React, DBMS, System Design — and run a focused Q&amp;A round.
                </p>
              </div>
            </div>
            <Button to="/app/topic-interview" variant="secondary" icon={ArrowRight} className="!bg-white !text-ink shrink-0">
              Start Practicing
            </Button>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
