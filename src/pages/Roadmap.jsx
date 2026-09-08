import { useState } from "react";
import { Map, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";
import { getDashboard } from "../lib/api";
import { aptitudeQuestions } from "../lib/mockData";

function AptitudeQuiz({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const select = (qid, idx) => setAnswers((a) => ({ ...a, [qid]: idx }));

  const finish = () => {
    const correct = aptitudeQuestions.filter((q) => answers[q.id] === q.answer).length;
    const score = Math.round((correct / aptitudeQuestions.length) * 100);
    setSubmitted(true);
    onComplete(score);
  };

  const allAnswered = aptitudeQuestions.every((q) => answers[q.id] !== undefined);

  return (
    <Card>
      <h3 className="font-display text-lg text-ink mb-1">Quick Aptitude Check</h3>
      <p className="text-sm text-muted mb-6">Five questions, scored instantly in your browser.</p>
      <div className="space-y-6">
        {aptitudeQuestions.map((q, qi) => (
          <div key={q.id}>
            <p className="text-ink font-medium mb-3">{qi + 1}. {q.prompt}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => select(q.id, oi)}
                  className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                    answers[q.id] === oi
                      ? "border-sage bg-sage-soft text-sage-dark"
                      : "border-border text-ink/80 hover:border-sage"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!submitted && (
        <Button onClick={finish} disabled={!allAnswered} className="mt-6" icon={ArrowRight}>
          Submit Quiz
        </Button>
      )}
    </Card>
  );
}

export default function Roadmap() {
  const { sessionId, hasAssessment, dashboard, setDashboard, aptitudeScore, setAptitudeScore } = useApp();
  const [loading, setLoading] = useState(false);
  const [quizDone, setQuizDone] = useState(aptitudeScore !== null);

  const generateRoadmap = async (score) => {
    setLoading(true);
    const res = await getDashboard({ sessionId, aptitudeScore: score ?? aptitudeScore });
    setDashboard(res);
    setLoading(false);
  };

  const handleQuizComplete = (score) => {
    setAptitudeScore(score);
    setQuizDone(true);
    generateRoadmap(score);
  };

  if (!hasAssessment) {
    return (
      <AppShell title="Career Roadmap" subtitle="Your personalized plan, once you've been assessed.">
        <Card className="max-w-2xl mx-auto mt-8">
          <EmptyState
            icon={Map}
            title="Your roadmap will appear here."
            description="Complete a resume analysis or an interview round first, and SkillSetGo will build a week-by-week plan around your actual gaps."
            action={<Button to="/app/resume" icon={ArrowRight}>Start with Resume Analysis</Button>}
          />
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title="Career Roadmap" subtitle="A week-by-week plan built from your assessment.">
      <div className="max-w-3xl mx-auto space-y-6">
        {!quizDone && <AptitudeQuiz onComplete={handleQuizComplete} />}

        {loading && (
          <Card className="text-center py-10">
            <Spinner label="Building your personalized roadmap..." />
          </Card>
        )}

        {dashboard && !loading && (
          <>
            <Card className="bg-sage-dark text-white">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={18} />
                <p className="text-sm text-white/80">Overall Readiness</p>
              </div>
              <p className="font-display text-4xl">{dashboard.overall_readiness_score}/100</p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h4 className="font-medium text-ink mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {dashboard.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-ink/80 flex gap-2">
                      <CheckCircle2 size={15} className="text-sage-dark shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h4 className="font-medium text-ink mb-3">Priority Gaps</h4>
                <ul className="space-y-2">
                  {dashboard.priority_gaps.map((s, i) => (
                    <li key={i} className="text-sm text-ink/80 flex gap-2">
                      <ArrowRight size={15} className="text-terracotta shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card>
              <h3 className="font-display text-lg text-ink mb-5">Your Roadmap</h3>
              <div className="space-y-5">
                {dashboard.roadmap.map((w) => (
                  <div key={w.week} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-sage-soft text-sage-dark flex items-center justify-center text-sm font-medium shrink-0">
                      {w.week}
                    </div>
                    <div className="pb-5 border-b border-border flex-1 last:border-0 last:pb-0">
                      <p className="font-medium text-ink mb-1.5">Week {w.week}: {w.focus}</p>
                      <ul className="space-y-1">
                        {w.actions.map((a, i) => (
                          <li key={i} className="text-sm text-muted">— {a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
