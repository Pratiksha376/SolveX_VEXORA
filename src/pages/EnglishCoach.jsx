import { useEffect, useState } from "react";
import { Mic, Square, RefreshCcw, ArrowRight, AlertCircle } from "lucide-react";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import ProgressBar from "../components/ProgressBar";
import { useApp } from "../context/AppContext";
import { englishQuestions } from "../lib/mockData";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

function scoreAnswer(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const fillers = ["um", "like", "actually", "basically", "you know"];
  const counts = {};
  fillers.forEach((f) => {
    const re = new RegExp(`\\b${f}\\b`, "gi");
    const m = text.match(re);
    if (m) counts[f] = m.length;
  });
  const lengthScore = Math.min(100, Math.round((words.length / 60) * 100));
  const fillerCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const fluency = Math.max(40, Math.min(96, 60 + lengthScore / 4 - fillerCount * 3));
  const grammar = Math.max(50, 90 - fillerCount * 2);
  const vocabulary = Math.max(45, Math.min(92, 55 + words.length / 3));
  const clarity = Math.max(50, 88 - fillerCount * 4);
  const confidence = Math.max(45, Math.round((fluency + clarity) / 2) - fillerCount);
  const overall = Math.round((fluency + grammar + vocabulary + clarity + confidence) / 5);

  return {
    overall,
    fluency: Math.round(fluency),
    grammar: Math.round(grammar),
    vocabulary: Math.round(vocabulary),
    clarity: Math.round(clarity),
    confidence: Math.round(confidence),
    fillers: counts,
  };
}

export default function EnglishCoach() {
  const { sessionId, setEnglishResult } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | recording | analyzing | result
  const [manualTranscript, setManualTranscript] = useState("");
  const [result, setResult] = useState(null);

  const {
    isSupported,
    isListening,
    transcript: speechTranscript,
    interimTranscript,
    start: startListening,
    stop: stopListening,
    reset: resetSpeech,
    error: speechError,
  } = useSpeechRecognition({ sessionId, continuous: true, interimResults: true });

  // Prefer live speech-to-text; fall back to the editable textarea for
  // browsers without SpeechRecognition support (e.g. Firefox).
  const transcript = isSupported ? speechTranscript : manualTranscript;

  const question = englishQuestions[qIndex];

  useEffect(() => {
    return () => stopListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = () => {
    setPhase("recording");
    setManualTranscript("");
    resetSpeech();
    if (isSupported) startListening();
  };

  const finishRecording = () => {
    if (isSupported) stopListening();
    setPhase("analyzing");
    setTimeout(() => {
      const text = transcript.trim() ||
        "Um, hi, my name is Riya. I am, like, a final year student and I have worked on a few projects.";
      const scored = scoreAnswer(text);
      setResult({ text, ...scored });
      setEnglishResult(scored);
      setPhase("result");
    }, 1600);
  };

  const tryAgain = () => {
    setPhase("idle");
    setManualTranscript("");
    resetSpeech();
    setResult(null);
  };

  const nextQuestion = () => {
    setQIndex((i) => (i + 1) % englishQuestions.length);
    tryAgain();
  };

  return (
    <AppShell title="English Coach" subtitle="Practice speaking, get structured feedback.">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center py-10">
          <p className="text-sm text-muted mb-2">Question</p>
          <h2 className="font-display text-2xl text-ink mb-8">"{question}"</h2>

          {phase === "idle" && (
            <>
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-terracotta text-white flex items-center justify-center mx-auto mb-4 hover:bg-[#c17953] transition-colors"
                aria-label="Start speaking"
              >
                <Mic size={28} />
              </button>
              <p className="text-muted text-sm">Tap to start speaking</p>
            </>
          )}

          {phase === "recording" && (
            <>
              <div className="w-20 h-20 rounded-full bg-terracotta text-white flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Mic size={28} />
              </div>
              <p className="text-terracotta text-sm font-medium mb-5">
                {isSupported ? (isListening ? "🔴 Listening..." : "Starting mic...") : "🔴 Recording..."}
              </p>

              {isSupported ? (
                <div className="w-full min-h-[110px] border border-border rounded-lg px-4 py-3 text-left text-ink mb-5">
                  {transcript ? (
                    <span>{transcript} </span>
                  ) : (
                    <span className="text-muted">Start speaking — your words will appear here live...</span>
                  )}
                  {interimTranscript && <span className="text-muted italic">{interimTranscript}</span>}
                </div>
              ) : (
                <>
                  <textarea
                    value={manualTranscript}
                    onChange={(e) => setManualTranscript(e.target.value)}
                    placeholder="Your browser doesn't support live speech-to-text — type your answer here..."
                    rows={4}
                    className="w-full border border-border rounded-lg px-4 py-3 text-left text-ink focus:border-sage outline-none mb-5"
                  />
                  {speechError && (
                    <p className="flex items-center gap-1.5 text-xs text-terracotta mb-3">
                      <AlertCircle size={13} /> Speech recognition unavailable ({speechError})
                    </p>
                  )}
                </>
              )}

              <Button onClick={finishRecording} icon={Square} iconPosition="left" variant="secondary">
                Stop & Analyze
              </Button>
            </>
          )}

          {phase === "analyzing" && <Spinner label="Analyzing your speech..." />}

          {phase === "result" && result && (
            <div className="text-left">
              <p className="text-sm text-muted mb-6 text-center">You said: "{result.text}"</p>
            </div>
          )}
        </Card>

        {phase === "result" && result && (
          <>
            <Card>
              <h3 className="font-display text-lg text-ink mb-4">Your Communication Analysis</h3>
              <div className="space-y-4">
                <ProgressBar label="Fluency" value={result.fluency} tone="sage" />
                <ProgressBar label="Grammar" value={result.grammar} tone="sage" />
                <ProgressBar label="Vocabulary" value={result.vocabulary} tone="gold" />
                <ProgressBar label="Clarity" value={result.clarity} tone="sage" />
                <ProgressBar label="Confidence" value={result.confidence} tone="terracotta" />
              </div>
            </Card>

            {Object.keys(result.fillers).length > 0 && (
              <Card>
                <h4 className="font-medium text-ink mb-3">Filler Words</h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(result.fillers).map(([w, c]) => (
                    <span key={w} className="text-sm bg-peach text-[#a15a35] rounded-full px-3 py-1">
                      "{w}" → {c}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            <Card>
              <h4 className="font-medium text-ink mb-2">AI Feedback</h4>
              <p className="text-sm text-ink/80">
                {Object.keys(result.fillers).length
                  ? "Reduce filler words and tighten sentence structure — you have the content, just deliver it more directly."
                  : "Solid, clear delivery. Add one more concrete example to make it even stronger."}
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
