import { useState, useEffect, useRef } from "react";
import { Send, Award, ArrowRight } from "lucide-react";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useApp } from "../context/AppContext";
import { interviewChat, scoreInterview } from "../lib/api";

export default function TechnicalInterview() {
  const { sessionId, targetRole, setTechnicalResult } = useApp();
  const [history, setHistory] = useState([]); // [{role, content}]
  const [current, setCurrent] = useState(""); // draft answer
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [scoring, setScoring] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const start = async () => {
      const res = await interviewChat({ sessionId, message: null, history: [] });
      setHistory([{ role: "ai", content: res.reply }]);
      setLoading(false);
    };
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const submitAnswer = async () => {
    if (!current.trim() || loading) return;
    const newHistory = [...history, { role: "user", content: current }];
    setHistory(newHistory);
    const messageSent = current;
    setCurrent("");
    setLoading(true);
    setFeedback(null);
    const res = await interviewChat({ sessionId, message: messageSent, history: newHistory });
    if (res.feedback) setFeedback(res.feedback);
    setHistory([...newHistory, { role: "ai", content: res.reply }]);
    setDone(res.done);
    setLoading(false);
  };

  const finish = async () => {
    setScoring(true);
    const res = await scoreInterview({ sessionId });
    setFinalScore(res);
    setTechnicalResult(res);
    setScoring(false);
  };

  const questionNumber = history.filter((h) => h.role === "ai").length;

  return (
    <AppShell title="Technical Interview" subtitle={`Target role: ${targetRole || "Software Developer"} · Difficulty: Intermediate`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {!finalScore ? (
          <Card padded={false} className="overflow-hidden">
            <div className="bg-ink text-cream px-6 py-4 flex items-center justify-between">
              <span className="text-sm">Question {Math.max(1, questionNumber)}/4</span>
              <span className="text-xs text-cream/60">Interview Room</span>
            </div>

            <div className="p-6 space-y-5 max-h-[420px] overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className={h.role === "ai" ? "" : "flex justify-end"}>
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-[15px] leading-relaxed ${
                      h.role === "ai"
                        ? "bg-sage-soft text-ink"
                        : "bg-sage-dark text-white"
                    }`}
                  >
                    {h.content}
                  </div>
                </div>
              ))}
              {feedback && (
                <div className="text-sm text-terracotta bg-peach/50 rounded-lg px-4 py-2 inline-block">
                  {feedback}
                </div>
              )}
              {loading && <Spinner label="Interviewer is thinking..." />}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-border p-4">
              {!done ? (
                <div className="flex items-end gap-3">
                  <textarea
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submitAnswer();
                      }
                    }}
                    placeholder="Type your answer..."
                    rows={2}
                    disabled={loading}
                    className="flex-1 border border-border rounded-lg px-4 py-2.5 text-ink focus:border-sage outline-none resize-none disabled:opacity-60"
                  />
                  <Button onClick={submitAnswer} disabled={loading} icon={Send} aria-label="Submit answer" />
                </div>
              ) : (
                <Button onClick={finish} disabled={scoring} icon={Award} iconPosition="left" className="w-full">
                  {scoring ? "Scoring your interview..." : "Get My Score"}
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <>
            <Card className="text-center py-8">
              <p className="text-sm text-muted mb-1">Technical Score</p>
              <p className="font-display text-5xl text-ink">
                {finalScore.technical_score}<span className="text-xl text-muted">/100</span>
              </p>
            </Card>
            <Card>
              <h4 className="font-medium text-ink mb-3">Tips to Improve</h4>
              <ul className="space-y-2">
                {finalScore.tips.map((t, i) => (
                  <li key={i} className="text-sm text-ink/80 flex gap-2">
                    <ArrowRight size={15} className="text-sage-dark shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </Card>
            <Button to="/app/dashboard" className="w-full" icon={ArrowRight}>
              Back to Dashboard
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
