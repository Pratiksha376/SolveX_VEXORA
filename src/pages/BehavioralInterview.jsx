import { useState } from "react";
import { CheckCircle2, XCircle, RefreshCcw, ArrowRight } from "lucide-react";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import ProgressBar from "../components/ProgressBar";
import { useApp } from "../context/AppContext";
import { behavioralQuestions } from "../lib/mockData";

const STAR_KEYWORDS = {
  situation: ["when", "during", "at my", "while working", "situation"],
  task: ["needed to", "had to", "my task", "responsible for", "goal was"],
  action: ["i decided", "i did", "so i", "i took", "i led", "i built", "i talked"],
  result: ["as a result", "in the end", "we finished", "improved", "resulted in", "outcome"],
};

function evaluateStar(text) {
  const lower = text.toLowerCase();
  const star = {};
  Object.entries(STAR_KEYWORDS).forEach(([key, words]) => {
    star[key] = words.some((w) => lower.includes(w));
  });
  const hits = Object.values(star).filter(Boolean).length;
  const base = 55 + hits * 10;
  return {
    star,
    communication: Math.min(95, base + 3),
    leadership: Math.min(95, base - (star.action ? 0 : 8)),
    problemSolving: Math.min(95, base + (star.result ? 5 : -5)),
    overall: Math.min(95, base),
  };
}

export default function BehavioralInterview() {
  const { setBehavioralResult } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | analyzing | result
  const [result, setResult] = useState(null);

  const question = behavioralQuestions[qIndex];

  const submit = () => {
    if (!answer.trim()) return;
    setPhase("analyzing");
    setTimeout(() => {
      const evaluated = evaluateStar(answer);
      setResult(evaluated);
      setBehavioralResult({ overall: evaluated.overall });
      setPhase("result");
    }, 1400);
  };

  const tryAgain = () => {
    setPhase("idle");
    setAnswer("");
    setResult(null);
  };

  const nextQuestion = () => {
    setQIndex((i) => (i + 1) % behavioralQuestions.length);
    tryAgain();
  };

  return (
    <AppShell title="Behavioral Interview" subtitle="Evaluated against the STAR framework.">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <p className="text-sm text-muted mb-2">Question</p>
          <h2 className="font-display text-2xl text-ink mb-6">"{question}"</h2>

          {phase !== "result" && (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Describe the situation, what you needed to do, the action you took, and the result..."
                rows={6}
                disabled={phase === "analyzing"}
                className="w-full border border-border rounded-lg px-4 py-3 text-ink focus:border-sage outline-none disabled:opacity-60"
              />
              <div className="mt-4">
                {phase === "analyzing" ? (
                  <Spinner label="Evaluating your answer..." />
                ) : (
                  <Button onClick={submit} icon={ArrowRight}>Submit Answer</Button>
                )}
              </div>
            </>
          )}
        </Card>

        {phase === "result" && result && (
          <>
            <Card>
              <h3 className="font-display text-lg text-ink mb-4">STAR Analysis</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(result.star).map(([key, present]) => (
                  <div key={key} className="flex items-center gap-2">
                    {present ? (
                      <CheckCircle2 size={16} className="text-sage-dark" />
                    ) : (
                      <XCircle size={16} className="text-terracotta" />
                    )}
                    <span className="text-sm capitalize text-ink/80">{key}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <ProgressBar label="Communication" value={Math.round(result.communication)} tone="sage" />
                <ProgressBar label="Leadership" value={Math.round(result.leadership)} tone="gold" />
                <ProgressBar label="Problem Solving" value={Math.round(result.problemSolving)} tone="terracotta" />
              </div>
            </Card>

            <Card>
              <h4 className="font-medium text-ink mb-2">AI Feedback</h4>
              <p className="text-sm text-ink/80">
                {result.star.result
                  ? "Good structure overall — your outcome was clear. Keep quantifying results where you can."
                  : "Your situation and task were clear, but explain what YOU specifically did and quantify the result."}
              </p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={tryAgain} variant="secondary" icon={RefreshCcw} iconPosition="left" className="flex-1">
                Try Again
              </Button>
              <Button onClick={nextQuestion} icon={ArrowRight} className="flex-1">
                Next Question
              </Button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
