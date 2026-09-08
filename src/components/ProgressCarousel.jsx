import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ArrowUp,
  Mic,
  Code2,
  Users,
  HelpCircle,
  Compass,
  Flag,
  GraduationCap,
  BarChart3,
  Briefcase,
} from "lucide-react";

// Six illustration-style "feature" slides, styled after the reference
// screenshots: an icon badge + serif title on the left, and a dark ink
// panel with small white sub-cards illustrating the feature on the right.
// All built from SkillSetGo's existing color tokens.

function Sparkle() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="absolute top-5 right-5 text-cream/70">
      <path d="M4 4L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12L10.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 20L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DashedArrow() {
  return (
    <svg width="44" height="20" viewBox="0 0 44 20" fill="none" className="shrink-0 hidden sm:block">
      <path d="M1 10H36" stroke="#7C8A78" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M30 4L37 10L30 16" stroke="#7C8A78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileStackCard({ filename = "Resume.pdf", withUpload = true }) {
  return (
    <div className="relative w-[150px] sm:w-[170px]">
      <div className="absolute inset-x-3 -top-2 h-full rounded-2xl bg-white/25" />
      <div className="absolute inset-x-1.5 -top-1 h-full rounded-2xl bg-white/50" />
      <div className="relative bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-3">
          <FileText size={14} className="text-sage-dark" />
          <span className="text-[11px] font-medium text-ink">{filename}</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 rounded-full bg-[#E4E0D6] w-[85%]" />
          <div className="h-1.5 rounded-full bg-[#E4E0D6] w-[60%]" />
          <div className="h-1.5 rounded-full bg-[#E4E0D6] w-[75%]" />
          <div className="h-1.5 rounded-full bg-[#E4E0D6] w-[40%]" />
        </div>
        {withUpload && (
          <div className="absolute -bottom-3 -right-3 w-9 h-9 rounded-full bg-sage-dark ring-4 ring-white flex items-center justify-center">
            <ArrowUp size={15} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

function RingScoreCard({ score = 78, dots = ["sage", "sage", "gold", "terracotta"] }) {
  const size = 64;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const dotColor = { sage: "bg-sage-dark", gold: "bg-gold", terracotta: "bg-terracotta" };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 w-[190px] sm:w-[210px]">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#E8EEE3" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#6F866B"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-ink">
          {score}%
        </div>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {dots.map((tone, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor[tone]}`} />
            <span className="h-1.5 rounded-full bg-[#E4E0D6] flex-1" style={{ opacity: 1 - i * 0.15 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatBubbleCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-[170px] sm:w-[190px] space-y-2">
      <div className="bg-sage-soft rounded-lg px-2.5 py-1.5 text-[10px] text-sage-dark w-[80%]">
        Explain a REST API
      </div>
      <div className="bg-ink text-cream rounded-lg px-2.5 py-1.5 text-[10px] w-[85%] ml-auto">
        It's an interface that uses HTTP...
      </div>
      <div className="flex gap-1 pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-sage-dark" />
        <span className="w-1.5 h-1.5 rounded-full bg-sage-dark/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-sage-dark/30" />
      </div>
    </div>
  );
}

function ChecklistCard({ items = [true, true, false] }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-[190px] sm:w-[210px] space-y-2.5">
      {items.map((ok, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] text-white ${
              ok ? "bg-sage-dark" : "bg-terracotta"
            }`}
          >
            {ok ? "✓" : "!"}
          </span>
          <span className="h-1.5 rounded-full bg-[#E4E0D6] flex-1" style={{ opacity: 1 - i * 0.15 }} />
        </div>
      ))}
    </div>
  );
}

function WaveformCard() {
  const heights = [8, 16, 10, 22, 14, 26, 12, 18, 9, 20];
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-[150px] sm:w-[170px]">
      <div className="flex items-center gap-1.5 mb-3">
        <Mic size={14} className="text-terracotta" />
        <span className="text-[11px] font-medium text-ink">Speaking...</span>
      </div>
      <div className="flex items-end gap-1 h-8">
        {heights.map((h, i) => (
          <span key={i} className="w-1.5 rounded-full bg-terracotta/70" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}

function MeterCard({ rows = [["Fluency", 82], ["Grammar", 88], ["Clarity", 76]] }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-[190px] sm:w-[210px] space-y-2.5">
      {rows.map(([label, val]) => (
        <div key={label}>
          <div className="flex justify-between text-[10px] text-ink/70 mb-1">
            <span>{label}</span>
            <span>{val}</span>
          </div>
          <div className="h-1.5 rounded-full bg-sage-soft overflow-hidden">
            <div className="h-full rounded-full bg-sage-dark" style={{ width: `${val}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TopicChipCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-[170px] sm:w-[190px]">
      <div className="flex items-center gap-1.5 mb-3">
        <HelpCircle size={14} className="text-sage-dark" />
        <span className="text-[11px] font-medium text-ink">Pick a topic</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["React", "DBMS", "System Design"].map((t) => (
          <span key={t} className="text-[9px] bg-sage-soft text-sage-dark rounded-full px-2 py-1">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScoreBadgeCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-[190px] sm:w-[210px] text-center">
      <p className="text-[10px] text-muted mb-1">Round Score</p>
      <p className="text-2xl font-medium text-ink">84<span className="text-xs text-muted">/100</span></p>
      <div className="flex justify-center gap-1 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`w-4 h-1 rounded-full ${i <= 3 ? "bg-sage-dark" : "bg-[#E4E0D6]"}`} />
        ))}
      </div>
    </div>
  );
}

function RoadmapIllustration() {
  return (
    <div className="flex items-center gap-4 sm:gap-6 w-full justify-between">
      <div className="bg-white rounded-2xl p-4 shadow-sm w-[130px] sm:w-[150px] shrink-0">
        <p className="text-[11px] font-medium text-ink leading-snug">
          Your
          <br />
          Path Ahead
        </p>
        <div className="h-1.5 rounded-full bg-sage-soft w-10 mt-2" />
      </div>

      <div className="relative flex-1 h-[110px] flex items-end justify-center">
        <svg viewBox="0 0 160 100" className="w-full h-full max-w-[180px]" fill="none">
          <path d="M10 95 C40 75, 60 90, 80 60 C100 35, 110 45, 130 15" stroke="#8DA089" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
          <path d="M10 95 C40 75, 60 90, 80 60 C100 35, 110 45, 130 15" stroke="#E8EEE3" strokeWidth="3" strokeDasharray="1 8" strokeLinecap="round" />
          <circle cx="10" cy="95" r="5" fill="#526A52" />
          <circle cx="80" cy="60" r="5" fill="#526A52" />
          <circle cx="130" cy="15" r="6" fill="#526A52" />
          <circle cx="130" cy="15" r="3" fill="#F7F4EC" />
        </svg>
        <Flag size={16} className="absolute top-0 right-2 text-gold" />
      </div>

      <div className="hidden sm:flex flex-col gap-2 shrink-0 w-[130px]">
        {[GraduationCap, BarChart3, Briefcase].map((Icon, i) => (
          <div key={i} className="bg-white rounded-xl p-2.5 shadow-sm flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-sage-soft flex items-center justify-center shrink-0">
              <Icon size={12} className="text-sage-dark" />
            </div>
            <div className="h-1.5 rounded-full bg-[#E4E0D6] flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

const slides = [
  {
    icon: FileText,
    title: ["AI Resume", "Analyzer"],
    render: () => (
      <>
        <FileStackCard />
        <DashedArrow />
        <RingScoreCard score={78} />
      </>
    ),
  },
  {
    icon: Mic,
    title: ["English", "Coach"],
    render: () => (
      <>
        <WaveformCard />
        <DashedArrow />
        <MeterCard />
      </>
    ),
  },
  {
    icon: Code2,
    title: ["Technical", "Interview"],
    render: () => (
      <>
        <ChatBubbleCard />
        <DashedArrow />
        <ChecklistCard items={[true, true, false]} />
      </>
    ),
  },
  {
    icon: Users,
    title: ["Behavioral", "Interview"],
    render: () => (
      <>
        <ChatBubbleCard />
        <DashedArrow />
        <MeterCard rows={[["Situation", 90], ["Task", 84], ["Result", 70]]} />
      </>
    ),
  },
  {
    icon: HelpCircle,
    title: ["Topic Mock", "Interview"],
    render: () => (
      <>
        <TopicChipCard />
        <DashedArrow />
        <ScoreBadgeCard />
      </>
    ),
  },
  {
    icon: Compass,
    title: ["Career", "Guidance"],
    render: () => <RoadmapIllustration />,
  },
];

const AUTO_ADVANCE_MS = 800;
const TRANSITION_MS = 350;

export default function ProgressCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((i) => setIndex((i + slides.length) % slides.length), []);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, index]);

  return (
    <div className="relative">
      <div
        className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-[0_20px_60px_-30px_rgba(32,37,31,0.25)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid gap-5 items-center">
          {/* Icon + title (all slides stacked, crossfade between them) */}
          <div className="relative min-w-[160px] min-h-[140px] sm:min-h-[150px]">
            {slides.map(({ icon: Icon, title }, i) => (
              <div
                key={title.join("-")}
                className="absolute inset-0 transition-all ease-out"
                style={{
                  transitionDuration: `${TRANSITION_MS}ms`,
                  opacity: i === index ? 1 : 0,
                  transform: i === index ? "translateY(0px)" : "translateY(8px)",
                  pointerEvents: i === index ? "auto" : "none",
                }}
                aria-hidden={i !== index}
              >
                <div className="w-12 h-12 rounded-xl bg-sage-soft text-sage-dark flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-2xl sm:text-[28px] leading-[1.1] text-ink">
                  {title[0]}
                  <br />
                  {title[1]}
                </h3>
                <div className="h-1 w-9 rounded-full bg-sage mt-3" />
              </div>
            ))}
          </div>

          {/* Illustration panel (all slides stacked, crossfade between them) */}
          <div className="relative bg-ink rounded-xl min-h-[160px] sm:min-h-[180px] overflow-hidden">
            <Sparkle />
            {slides.map((s, i) => (
              <div
                key={s.title.join("-")}
                className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-6 px-5 sm:px-8 py-8 transition-all ease-out"
                style={{
                  transitionDuration: `${TRANSITION_MS}ms`,
                  opacity: i === index ? 1 : 0,
                  transform: i === index ? "translateX(0px)" : "translateX(14px)",
                  pointerEvents: i === index ? "auto" : "none",
                }}
                aria-hidden={i !== index}
              >
                {s.render()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-5 w-9 h-9 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-ink/70 hover:text-ink hover:border-sage transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-5 w-9 h-9 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-ink/70 hover:text-ink hover:border-sage transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {slides.map((s, i) => (
          <button key={s.title.join("-")} onClick={() => goTo(i)} aria-label={`Go to ${s.title.join(" ")} slide`} className="p-1">
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === index ? "w-6 h-2 bg-sage-dark" : "w-2 h-2 bg-border"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

