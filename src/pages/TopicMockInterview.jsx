import { useEffect, useRef, useState } from "react";
import { Send, Award, ArrowRight, Sparkles } from "lucide-react";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useApp } from "../context/AppContext";
import { topicInterviewChat } from "../lib/api";

const suggestedTopics = ["React", "System Design", "DBMS", "Python", "Data Structures", "Operating Systems"];

export default function TopicMockInterview() {
  const { sessionId } = useApp();
  const [topic, setTopic] = useState("");
  const [phase, setPhase] = useState("setup"); // setup | interviewing | scored
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const beginInterview = async (chosenTopic) => {
    const t = (chosenTopic ?? topic).trim();
    if (!t) return;
    setTopic(t);
    setPhase("interviewing");
    setLoading(true);
    setDone(false);
    setFinalScore(null);
    setFeedback(null);
    const res = await topicInterviewChat({ sessionId, topic: t, message: null, history: [] });
    setHistory([{ role: "ai", content: res.reply }]);
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!current.trim() || loading) return;
    const newHistory = [...history, { role: "user", content: current }];
    setHistory(newHistory);
    const messageSent = current;
    setCurrent("");
    setLoading(true);
    setFeedback(null);
    const res = await topicInterviewChat({ sessionId, topic, message: messageSent, history: newHistory });
    if (res.feedback) setFeedback(res.feedback);
    setHistory([...newHistory, { role: "ai", content: res.reply }]);
    if (res.technical_score !== undefined) setFinalScore(res);
    setDone(res.done);
    setLoading(false);
  };

  const finishAndScore = () => setPhase("scored");

  const startOver = () => {
    setPhase("setup");
    setTopic("");
    setHistory([]);
    setCurrent("");
    setDone(false);
    setFeedback(null);
    setFinalScore(null);
  };

  const questionNumber = history.filter((h) => h.role === "ai").length;

  return (
    <AppShell
      title="Topic Mock Interview"
      subtitle={phase === "setup" ? "Pick any topic and practice a focused Q&A round." : `Topic: ${topic}`}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {phase === "setup" && (
          <Card className="py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-sage-soft text-sage-dark flex items-center justify-center mx-auto mb-5">
              <Sparkles size={22} />
            </div>
            <h2 className="font-display text-2xl text-ink mb-2">What do you want to practice?</h2>
            <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
              Type any subject — React, DBMS, System Design, Operating Systems — or pick a suggestion below.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-5">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && beginInterview()}
                placeholder="e.g. React, System Design, DBMS..."
                className="flex-1 border border-border rounded-lg px-4 py-2.5 text-ink focus:border-sage outline-none"
              />
              <Button onClick={() => beginInterview()} disabled={!topic.trim()} icon={ArrowRight}>
                Start
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {suggestedTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => beginInterview(t)}
                  className="text-sm bg-sage-soft text-sage-dark rounded-full px-3.5 py-1.5 hover:bg-sage-soft/70 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>
        )}

        {phase === "interviewing" && (
          <Card padded={false} className="overflow-hidden">
            <div className="bg-ink text-cream px-6 py-4 flex items-center justify-between">
              <span className="text-sm">
                {topic} · Question {Math.max(1, questionNumber)}
              </span>
              <span className="text-xs text-cream/60">Mock Interview Room</span>
            </div>

            <div className="p-6 space-y-5 max-h-[420px] overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className={h.role === "ai" ? "" : "flex justify-end"}>
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-[15px] leading-relaxed ${
                      h.role === "ai" ? "bg-sage-soft text-ink" : "bg-sage-dark text-white"
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
                <Button onClick={finishAndScore} icon={Award} iconPosition="left" className="w-full">
                  Get My Score
                </Button>
              )}
            </div>
          </Card>
        )}

        {phase === "scored" && (
          <>
            <Card className="text-center py-8">
              <p className="text-sm text-muted mb-1">{topic} Score</p>
              <p className="font-display text-5xl text-ink">
                {finalScore?.technical_score ?? "—"}
                <span className="text-xl text-muted">/100</span>
              </p>
            </Card>
            {finalScore?.tips && (
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
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={startOver} variant="secondary" className="flex-1">
                Practice Another Topic
              </Button>
              <Button to="/app/dashboard" icon={ArrowRight} className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
